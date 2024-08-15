import React from 'react';
import { Combobox } from "@/components/ui/combobox";

function StagedFiles({ files, onFormatChange }) {
  console.log("files", files);
  return (
    <div className="mt-4">
      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Uploaded Files:</h4>
      <ul className="mt-2 space-y-2">
        {files.map((fileItem, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-gray-100 dark:bg-black rounded-md"
          >
            <div className="text-gray-700 dark:text-gray-300">
              {fileItem.file.name} - {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
            </div>
            <Combobox 
              currentFormat={fileItem.file.type.split("/")[0]}
              onFormatChange={(newFormat) => onFormatChange(index, newFormat)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StagedFiles;