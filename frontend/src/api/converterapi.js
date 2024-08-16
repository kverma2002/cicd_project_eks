const BASE_URL = 'http://localhost:3001';

export const uploadFiles = async (formData) => {

  try {
    const response = await fetch(`${BASE_URL}/api/upload`, {
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

// export const convertFiles = async (fileIds, format) => {
//   try {
//     const response = await fetch(`${BASE_URL}/convert`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ fileIds, format }),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error('Error converting files:', error);
//     throw error;
//   }
// };