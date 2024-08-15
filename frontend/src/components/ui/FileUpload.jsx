import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFilesUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Pass the uploaded files to the parent component
    onFilesUpload(acceptedFiles);
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple file uploads
    accept: {
      'image/*': [],
      'video/*': [],
    },
  });

  return (
    <div className="flex justify-center items-center w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer w-full max-w-md lg:max-w-4xl 
          h-48 lg:h-80 flex items-center justify-center mx-4 md:mx-auto mt-4 md:mt-8 lg:mt-12 ${
          isDragActive ? 'border-blue-600' : 'border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>
            Drag & drop some files here, or click to select files
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
