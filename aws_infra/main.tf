# Create a VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# Create 2 public subnets for frontend and NAT Gateway + HA
resource "aws_subnet" "public_subnet1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.0.0/20"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
}

resource "aws_subnet" "public_subnet2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.16.0/20"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1b"
}

# Create 2 private subnets for the backend + HA
resource "aws_subnet" "private_subnet1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.32.0/20"
  map_public_ip_on_launch = false
  availability_zone       = "us-east-1a"
}

resource "aws_subnet" "private_subnet2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.48.0/20"
  map_public_ip_on_launch = false
  availability_zone       = "us-east-1b"
}

# IGW
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# Public RT
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Associate the public subnet with the public route table
resource "aws_route_table_association" "public_assoc1" {
  subnet_id      = aws_subnet.public_subnet1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_assoc2" {
  subnet_id      = aws_subnet.public_subnet2.id
  route_table_id = aws_route_table.public_rt.id
}

# Allocate 2 Elastic IPs for the NAT Gateway to make HA
resource "aws_eip" "nat_eip1" {
  domain = "vpc"
}

resource "aws_eip" "nat_eip2" {
  domain = "vpc"
}

# Create a NAT Gateway in each public subnet
resource "aws_nat_gateway" "nat_gw1" {
  allocation_id = aws_eip.nat_eip1.id
  subnet_id     = aws_subnet.public_subnet1.id
  depends_on    = [aws_internet_gateway.igw]
}

resource "aws_nat_gateway" "nat_gw2" {
  allocation_id = aws_eip.nat_eip2.id
  subnet_id     = aws_subnet.public_subnet2.id
  depends_on    = [aws_internet_gateway.igw]
}

# Create a Private Route Table for each private subnet
resource "aws_route_table" "private_rt1" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw1.id
  }
}

resource "aws_route_table" "private_rt2" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw2.id
  }
}

# Associate each private subnet with its respective route table
resource "aws_route_table_association" "private_assoc1" {
  subnet_id      = aws_subnet.private_subnet1.id
  route_table_id = aws_route_table.private_rt1.id
}

resource "aws_route_table_association" "private_assoc2" {
  subnet_id      = aws_subnet.private_subnet2.id
  route_table_id = aws_route_table.private_rt2.id
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "19.0.0"

  cluster_name = "devops-project-eks-cluster"
  cluster_version = "1.27"

  vpc_id = aws_vpc.main.id
  subnet_ids = [ aws_subnet.public_subnet1.id, aws_subnet.public_subnet2.id, aws_subnet.private_subnet1.id,aws_subnet.private_subnet2.id]
  control_plane_subnet_ids = [ aws_subnet.public_subnet1.id, aws_subnet.public_subnet2.id, aws_subnet.private_subnet1.id,aws_subnet.private_subnet2.id]
  eks_managed_node_groups = {
    eks_nodes = {
      desired_capacity = 2
      max_capacity     = 4
      min_capacity     = 1
      instance_type    = "t3.small"
    }
  }
}
