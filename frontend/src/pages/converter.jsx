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


    return (
        <div className="p-6 bg-white dark:bg-black rounded-md shadow-md">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Converter</h1>
          {files.length === 0 && (
            <>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Upload files to convert them to a different format.</p>
              <FileUpload onFilesUpload={handleFilesUpload} />
            </>
          )}
          {files.length > 0 && (
            <>
              <StagedFiles files={files} onFormatChange={handleFormatChange} />
              <Button onClick={clearFiles} className="mt-4"> Clear Files </Button>
              <Button onClick={handleConvertFiles} className="mt-4"> Convert Files </Button>
                      {downloadUrl && (
                <a href={downloadUrl} download="converted_files.zip" className="btn-download">
                  Download Converted Files
                </a>
              )}
            </>
          )}
          
        </div>
      );
  }
  
  export default Converter
  