# DevOps Workflow Project Documentation

This project demonstrates a full DevOps pipeline for a file converter application. The focus is on containerization, CI/CD automation, infrastructure provisioning with Terraform, deployment to Amazon EKS, restructuring the app to use an Express server for static assets and API proxying, and monitoring using Prometheus and Grafana.

---

## Table of Contents

1. [Containerization](#containerization)
2. [Initial CI/CD Pipeline (Build & Push Images)](#initial-cicd-pipeline)
3. [Infrastructure Provisioning with Terraform](#terraform-infrastructure)
4. [Deploying to EKS](#deploying-to-eks)
5. [Restructuring the App for API Proxying](#express-proxy)
6. [CI/CD for Deployment Updates](#deployment-cicd)
7. [Monitoring with Prometheus & Grafana](#monitoring)
8. [Summary](#summary)

---

## 1. Containerization

Both the **frontend** and **backend** applications are containerized. Containerizing applications provide a consistent, isolated, and scalable environment across all stages of development and deployment. 

### Frontend Dockerfile (v1)

```dockerfile
# Build stage
FROM node:18-alpine AS build

# Set working directory.
WORKDIR /app

# Copy package files and install dependencies.
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the production bundle.
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage to Nginx's html folder.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80.
EXPOSE 80

# Run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
```
The front end docker file simly needed a lightweight Node image, runs the build script using vite to bundle the React app into static assets. It then uses Nginx to serve the static files generated and exposes port 80.

### Backend Dockerfile (v1)

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Set production environment and install only production dependencies
ENV NODE_ENV=production
RUN npm ci --only=production

# Copy the rest of your app's source code
COPY . .

# Expose the desired port
EXPOSE 8001

# Start your app (ensure your npm start script is production-ready)
CMD ["npm", "start"]

```
This backend Dockerfile the same lightweight Node.js image to run the backend application. I set NODE_ENV to production and use npm ci --only=production to ensure only the production dependencies are installed, reducing the image size and optimizing performance. It then starts the backend by running the npm start command and exposes port 8001 for the Express server. 

## 2. Initial CI/CD Pipeline (Build & Push Images)

Below is the initial GitHub Actions workflow that builds the Docker images and pushes them to DockerHub. 

### Frontend GitHub Action (v1)
```yaml
name: Build and Publish Front End Image to DockerHub
on: 
    [workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build image
        run: docker build ./frontend -t ${{ secrets.DOCKERHUB_USERNAME }}/devops-fileconverter-frontend:latest
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Push image to docker hub
        run: |
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/devops-fileconverter-frontend:latest
          echo "Image pushed to Docker Hub"
```

### Backend GitHub Action (v1)
```yaml
name: Build and Publish Backend Image to DockerHub
on: 
    [workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build image
        run: docker build ./src -t ${{ secrets.DOCKERHUB_USERNAME }}/devops-fileconverter-backend:latest
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Push image to docker hub
        run: |
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/devops-fileconverter-backend:latest
          echo "Image pushed to Docker Hub"
```

## 3. Infrastructure Provisioning with Terraform
Now we have the the CI/CD built for creating images, we need to provision the resources we need to host the containers using EKS in AWS.

The terraform files are in the aws_infra folder and create the architecture below.

[Insert Image Here]

## 4. Deploying to EKS

After setting up the AWS infrastructure, the next step is to deploy the containerized frontend and backend applications to AWS EKS. This involves creating Kubernetes Deployments, Services, and using kubectl to deploy and manage the workloads.

To configure kubectl to interact with the EKS cluster
```sh
aws eks update-kubeconfig --region us-east-1 --name devops-project-eks-cluster
```
Verify the connection:
```sh
kubectl get nodes
```
I had errors here. You have to make sure that public access is enabled for the EKS cluster and that your machine's public IP is allowed to connect. Without this, you might encounter errors when running kubectl commands.
```sh
aws eks update-cluster-config \                                                                                   
  --region us-east-1 \
  --name devops-project-eks-cluster \
  --resources-vpc-config endpointPublicAccess=true,publicAccessCidrs="Your Public IP"
```
Next is creating the deployments. The deployments manage the lifecycle and scaling of the pods. 

Here is the front end
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: devops-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: devops-frontend
  template:
    metadata:
      labels:
        app: devops-frontend
    spec:
      containers:
      - name: frontend
        image: kverma2002/devops-fileconverter-frontend:latest
        ports:
        - containerPort: 3000
```
The frotn end deployment defines two replica to ensure high availability. It uses the latest frontend image from the DockerHub repository that we build and push images to. The application runs on port 3000, which is exposed to serve the frontend application.

Here is the backend
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: devops-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: devops-backend
  template:
    metadata:
      labels:
        app: devops-backend
    spec:
      containers:
      - name: backend
        image: kverma2002/devops-fileconverter-backend:latest
        ports:
        - containerPort: 8001
```
Simmilar to the frontend, two replicas are defined for HA. It also uses the latest docker image and exposes port 8001.

Next are the services. The services expose Pods to the network and enable access. They also define pod communication and load balancing with different service types.

Here is the frontend service 
```yaml
apiVersion: v1
kind: Service
metadata:
  name: devops-frontend-service
spec:
  selector:
    app: devops-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
 ```
 The frontend srvice uses servicese type load balancer that create an ELB and allows users to access the frontend application from the internet. The selector ensures the service routes traffic to Pods with the label app: devops-frontend, which belong to the frontend deployment.


 Here is the backend service
 
 ```yaml
 apiVersion: v1
kind: Service
metadata:
  name: devops-backend-service
spec:
  selector:
    app: devops-backend
  ports:
    - protocol: TCP
      port: 8001
      targetPort: 8001
  type: ClusterIP
```
The backend service is a ClusterIP service, meaning it is only accessible within the cluster and is not exposed to the internet. This sercures our backend service and allows secure internla communication

## 5. Restructuring the App for API Proxying (#express-proxy)

We now need to restructure the app to work in EKS. The first step is to change what the frontend calls. We need to change it to http://devops-backend-service:8001. This will resolve from inside the cluster since Kubernetes' internal DNS automatically maps service names to their corresponding cluster IPs, allowing communication between services.

However, when trying this with React, it doesn't work. This is because React runs in the user's browser, not inside the Kubernetes cluster, so the api call to http://devops-backend-service:8001 is coming from the public internet which will not resolve.

[Insert Image]

Instead, we need to proxy these requests so that the frontend can communicate with the backend service. Frameworks like Next.js have built-in API routes that make this process easier, but unfortunately, React does not natively support backend proxies in production builds. We need to introduce an Express server to serve the React app and proxy requests to the backend.

#### Steps to Fix
1. Create an Express server in the frontend container to:
2. Serve the React static files.
3. Proxy API requests to http://devops-backend-service:8001.
4. Modify the frontend Dockerfile to use Express instead of Nginx to handle API requests.

[Insert Image]

React still runs in the browser, but instead of calling http://devops-backend-service:8001 directly, it calls /api/upload route of the load balancer. The Express server intercepts these requests and proxies them to the backend using Kubernetes' internal DNS. Since Express is inside the cluster, it can resolve http://devops-backend-service:8001, making the API request successfully reach the backend.

## 6. CI/CD for Deployment Updates

We automated the Docker Image process however the EKS deployment is not automatically updated. In order to do this we will use GitHub Actions again. First we have to create an IAM User with the correct permissions. I created the IAM User github_action_eks_deployer and attached the following permissions policy.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EKSClusterPermissions",
            "Effect": "Allow",
            "Action": [
                "eks:DescribeCluster",
                "eks:ListClusters",
                "eks:AccessKubernetesApi"
            ],
            "Resource": "*"
        },
        {
            "Sid": "STSPermissions",
            "Effect": "Allow",
            "Action": [
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

This give it the permission to run *kubectl rollout restart deployment/frontend* and *kubectl rollout restart deployment/backend*

I added the following to the GitHub Actions as well

```yaml
- name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Install kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'
      - name: Update kubeconfig
        run: aws eks update-kubeconfig --region ${{ secrets.AWS_REGION }} --name ${{ secrets.EKS_CLUSTER_NAME }}
      - name: Update EKS Deployment
        run: |
          kubectl get pods
          kubectl rollout restart deployment/frontend
          kubectl get services
          echo "Deployment rollout restarted"
```
And

```yaml
- name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Install kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'
      - name: Update kubeconfig
        run: aws eks update-kubeconfig --region ${{ secrets.AWS_REGION }} --name ${{ secrets.EKS_CLUSTER_NAME }}
      - name: Update EKS Deployment
        run: |
          kubectl get pods
          kubectl rollout restart deployment/backend
          kubectl get services
          echo "Deployment rollout restarted"
```

This now completes the CI/CD. When new code is pushed, a new Docker Image is created, pushed to Docker Hub and then finally gets deployed to EKS


## 7. Monitoring with Prometheus & Grafana

Lastly, to create observability and monitoring in our EKS cluster, we set up Prometheus to collect metrics and Grafana to visualize them. This setup helps track the performance, resource usage, and overall health of our cluster and application.

First add the Helm Chart Repository
```sh
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```
Then install Prometheus
```sh
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
```
You can verify Prometheus installation by
```sh
kubectl get pods -n monitoring
```
Grafana comes bundled with the Prometheus Helm chart, but we need to now expose it so we can access it. It will be available at localhost on port 3000
```sh
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
```
After logging in, you can create dashboards and see real-time visualizations of CPU, memory, and network usage across your Kubernetes cluster.

Ex.

[Insert Image]

This monitors CPU usage of Kubernetes pods over a rolling 5-minute window using the PromQL query
```promql
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)
```

## 8. Summary

This project successfully implemented a full DevOps workflow to containerize, deploy, and monitor a file converter application in Amazon EKS. The primary focus was on automation, scalability, and observability, ensuring smooth CI/CD, resilient infrastructure, and real-time monitoring.

#### Tools & Technologies Used
Containerization: Docker
CI/CD Automation: GitHub Actions
Infrastructure as Code: Terraform 
Orchestration: Kubernetes 
Networking & Load Balancing: Kubernetes Services (LoadBalancer & ClusterIP)
Logging & Monitoring: Prometheus & Grafana


Potential Future Improvements
Horizontal Pod Autoscaling (HPA): Automatically scale pods based on CPU/memory usage.
Database Integration: Store file conversion history for tracking user interactions.
More Granular Monitoring: Use Grafana dashboards to monitor request latency and API response times.
Enhanced Security: Implement role-based access control (RBAC) and AWS IAM fine-tuning.
This project lays the foundation for a production-ready DevOps pipeline, ensuring a fully automated, scalable, and observable application deployment. 🚀
 

