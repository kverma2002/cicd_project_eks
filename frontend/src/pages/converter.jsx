import FileUpload from "../components/ui/FileUpload"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import StagedFiles from '@/components/ui/StagedFiles';
import { uploadFiles } from "@/api/converterapi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function Converter() {

    const [files, setFiles] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);

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
        setDownloading(true);
        const blob = await uploadFiles(formData);
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        console.log('Files uploaded successfully, download URL created');
      } catch (error) {
        console.error('Error converting files:', error);
        setError('There was an error converting the files. Please try again.');
        setErrorInfo(error.message);
      }
      setDownloading(false);
    };

  const handleDeleteFile = (indexToDelete) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, index) => index !== indexToDelete) 
      if (updatedFiles.length === 0) {
        setDownloadUrl(null);
      }
      return updatedFiles;
    });
  };

  const closeAlert = () => {
    setError(null);
    setErrorInfo(null);
  }


    return (
      <div className="flex-col justify-center dark:bg-slate-950">
          <div className="space-y-6">
            <h1 className="text-center text-2xl md:text-3xl lg:text-4xl md:m-6 lg:m-10 text-gray-900 dark:text-gray-100 px-10 sm:px-6">
              Your Own File Converter
            </h1>
            <p className="text-center text-sm md:text-base lg:text-lg text-gray-900 dark:text-gray-200 max-w-2xl mx-auto">
              Upload files to convert them to a different format. Supported formats are: <br />
              <span className="text-blue-500 dark:text-blue-300">
                Image: png, jpeg, jpg, gif, webp, tiff, avif, raw <br />
              </span>
              <span className="text-green-500 dark:text-green-300">
                {' '}Video: mp4, mov, wmv, avi, mkv, flv, webm, mpeg, mpg
              </span>
            </p>
            
            {error && (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <Alert variant="destructive">
                    <AlertTitle>{error}</AlertTitle>
                    <AlertDescription>{errorInfo}</AlertDescription>
                    <Button variant="ghost" onClick={closeAlert}>
                      Dismiss
                    </Button>
                  </Alert>
                </div>
              </div>
            )}
          </div>
          {files.length === 0 && (
            <>
              <FileUpload onFilesUpload={handleFilesUpload} />
            </>
          )}
          {files.length > 0 && (
            <div className="flex flex-col justify-center items-center w-full">
              <StagedFiles 
                files={files} 
                onFormatChange={handleFormatChange} 
                onDelete={handleDeleteFile} />
              <div className="flex items-center justify-center w-full">
                {!downloadUrl ? (
                  <Button onClick={handleConvertFiles} disabled={files.length === 0 || downloading} className="m-4">
                    {downloading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      : "Convert Files"}
                  </Button>
                ) : (
                  <a href={downloadUrl} download="converted_files.zip" className="m-4">
                    <Button>
                      Download
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v11.25m0 0L8.25 12.75m3.75 3.75L15.75 12.75M4.5 15.75V18a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18v-2.25"
                        />
                      </svg>
                    </Button>
                  </a>
                )}
                
                <Button onClick={clearFiles} className="m-4"> Clear Files </Button>
                {/* {downloadUrl && (
                  <a href={downloadUrl} download="converted_files.zip" className="btn-download">
                    Download Converted Files
                  </a>
                )} */}
              </div>
            </div>
          )}
          
        </div>
      );
  }
  
  export default Converter
  