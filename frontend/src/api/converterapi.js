export const uploadFiles = async (formData) => {

  try {
    const response = await fetch(`http://devops-backend-service:8001/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Read the response as text for the error message
      console.error('Error:', errorMessage);
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    // Handle the response as a blob (binary data)
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};