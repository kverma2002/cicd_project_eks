import React from 'react';
import { Combobox } from "@/components/ui/combobox";
import photoImage from "@/assets/image.png";
import videoImage from "@/assets/video.png";

function StagedFiles({ files, onFormatChange, onDelete}) {
  // console.log("files", files);

  function truncateFilename(filename) {
    const maxLength = 30;
    const extensionIndex = filename.lastIndexOf(".");
    const extension = extensionIndex > 0 ? filename.substring(extensionIndex) : '';
    const baseName = extensionIndex > 0 ? filename.substring(0, extensionIndex) : filename;

    if (filename.length > maxLength) {
      // Calculate the maximum length the base name can be (accounting for the ellipsis and extension length)
      const maxBaseLength = maxLength - 3 - extension.length;
      return `${baseName.substring(0, maxBaseLength)}...${extension}`;
    }

    return filename;
  }

  function getFilePlaceholder(fileType) {
    // Check if the fileType includes 'video' or 'image' and return the corresponding placeholder
    if (fileType.startsWith('video')) {
      return videoImage;
    } else if (fileType.startsWith('image')) {
      return photoImage;
    }
    // Default placeholder if needed
    return 'https://via.placeholder.com/50';
  }

  return (
    <div className="flex flex-col items-center w-full mt-4 md:mt-8 lg:mt-12 mx-4">
      <ul className="w-full max-w-2xl lg:max-w-5xl space-y-2">
        {files.map((fileItem, index) => (
          <li
            key={index}
            className="relative flex items-center"
          >
          <div className='relative flex flex-wrap items-center justify-between w-full px-4 py-4 space-y-2 border cursor-pointer lg:py-0 rounded-xl h-fit lg:h-20 lg:px-10 lg:flex-nowrap'>
            <div className="flex items-center gap-4">
              <img
                src={getFilePlaceholder(fileItem.file.type)}
                alt="File Icon"
                className="w-10 h-10 rounded"
              >
              </img>
              <div className="flex items-center gap-1 w-96">
                <span className='font-medium'>{truncateFilename(fileItem.file.name)}</span> 
                <span className="text-sm ml-2 text-gray-500">
                  ({(fileItem.file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-md">
              <span>
                Convert to:
              </span>
              <Combobox 
                currentFormat={fileItem.file.type.split("/")[0]}
                onFormatChange={(newFormat) => onFormatChange(index, newFormat)}
              />
            </div>
            <span className='flex items-center justify-center w-10 h-10 text-2xl rounded-full cursor-pointer hover:bg-muted text-foreground'>
              <button
                onClick={() => onDelete(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove file"
              >
                &times;
              </button>
            </span>
          </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StagedFiles;