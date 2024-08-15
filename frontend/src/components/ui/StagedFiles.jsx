import React from 'react';
import { Combobox } from "@/components/ui/combobox";

function StagedFiles({ files, onFormatChange, onDelete}) {
  console.log("files", files);
  return (
    <div className="flex flex-col items-center w-full mt-4 md:mt-8 lg:mt-12 mx-4">
      <ul className="w-full max-w-2xl lg:max-w-5xl space-y-2">
        {files.map((fileItem, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-gray-100 dark:bg-black rounded-md"
          >
            <div className="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/50"
                alt="File Icon"
                className="w-10 h-10 rounded"
              >
              </img>
              <div className="text-gray-700 dark:text-gray-300">
                <span className='font-medium'>{fileItem.file.name}</span> 
                <span className="text-sm ml-2 text-gray-500">
                  ({(fileItem.file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className='font-sm text-gray-500'>
                Convert to:
              </span>
              <Combobox 
                currentFormat={fileItem.file.type.split("/")[0]}
                onFormatChange={(newFormat) => onFormatChange(index, newFormat)}
              />
              <button
                onClick={() => onDelete(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove file"
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StagedFiles;