import FileUpload from "../components/ui/FileUpload"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import StagedFiles from '@/components/ui/StagedFiles';
import { uploadFiles } from "@/api/converterapi";


function Converter() {

    const [files, setFiles] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);

    const handleFilesUpload = (uploadedFiles) => {
        // Initialize each file with a default format selection
        const filesWithFormat = uploadedFiles.map((file) => ({
            file,
            format: "", // Default format
        }));
        setFiles((prevFiles) => [...prevFiles, ...filesWithFormat]);
    };
    
    const handleFormatChange = (index, newFormat) => {
        const updatedFiles = files.map((fileItem, i) =>
            i === index ? { ...fileItem, format: newFormat } : fileItem
        );
        setFiles(updatedFiles);
    };

    const clearFiles = () => {
        setFiles([]);
        setDownloadUrl(null);
    }

    const handleConvertFiles = async () => {
      try {
        const formData = new FormData();

        files.forEach((item, index) => {
          formData.append(`files`, item.file);
          formData.append(`formats[]`, item.format);
        });
        
        const blob = await uploadFiles(formData);
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        console.log('Files uploaded successfully, download URL created');
      } catch (error) {
        console.error('Error converting files:', error);
        // Handle the error, such as showing an error message
      }
    };

    const handleDeleteFile = (indexToDelete) => {
      setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
  };


    return (
      <div className="bg-white dark:bg-black flex-col justify-center">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl md:m-6 lg:m-10 font-bold text-gray-900 dark:text-gray-100 px-10 sm:px-6">File Converter</h1>
          <p className="text-center text-sm md:text-base lg:text-lg text-gray-900 dark:text-gray-200 max-w-2xl mx-auto">
            Upload files to convert them to a different format. Supported formats are: <br />
            <span className="text-blue-500 dark:text-blue-300">
              Image: png, jpeg, jpg, gif, webp, tiff, tif, heif, heic, avif, svg, raw <br />
            </span>
            <span className="text-green-500 dark:text-green-300">
              {' '}Video: mp4, mov, wmv, avi, mkv, flv, webm, mpeg, mpg
            </span>
          </p>
          {files.length === 0 && (
            <>
              <FileUpload onFilesUpload={handleFilesUpload} />
            </>
          )}
          {files.length > 0 && (
            <div className="flex flex-col justify-center items-center w-full ">
              <StagedFiles 
                files={files} 
                onFormatChange={handleFormatChange} 
                onDelete={handleDeleteFile} />
              <Button onClick={clearFiles} className="mt-4"> Clear Files </Button>
              <Button onClick={handleConvertFiles} className="mt-4"> Convert Files </Button>
                      {downloadUrl && (
                <a href={downloadUrl} download="converted_files.zip" className="btn-download">
                  Download Converted Files
                </a>
              )}
            </div>
          )}
          
        </div>
      );
  }
  
  export default Converter
  