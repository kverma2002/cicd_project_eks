const uploadRouter = require('express').Router()
const multer = require('multer')
const sharp = require('sharp');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const archiver = require('archiver');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegPath);


uploadRouter.get('/', (req, res) => {
    res.json('Hello World')
  });
  
uploadRouter.post('/', upload.array('files'), async (req, res) => {
  try {
    const files = req.files; // req.files contains the uploaded files
    const formats = req.body.formats;

    if (!formats || files.length === 0) {
      console.log('Format:', formats);
      console.log('Files:', files);
      return res.status(400).json({ error: 'Format and files are required' });
    }
    console.log('Format:', formats);
    console.log('Files:', files);

    const convertedFiles = await Promise.all(
      files.map(async (file, index) => {
        const outputFilePath = path.join('converted', `${path.parse(file.originalname).name}.${formats[index]}`);
        try {
          console.log('File:', file.originalname);
          console.log('Mimetype:', file.mimetype);
          console.log('Output:', outputFilePath);
          console.log('Format:', formats[index]);

          if (file.mimetype.startsWith('video')) {
            await new Promise((resolve, reject) => {
              ffmpeg(file.path)
                .output(outputFilePath)
                .format(formats[index])
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .run();
            });
          } else if (file.mimetype.startsWith('image')) {
            console.log('Image Format:', formats[index]);
            await sharp(file.path)
              .toFormat(formats[index])
              .toFile(outputFilePath);
          } else {  
            throw new Error('Unsupported file type');
          }
        } finally {
          fs.unlinkSync(file.path);
        }
        return outputFilePath;
      })
    );

    // Create a zip file and stream it in the response
  res.status(200);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=converted_files.zip');
  console.log('Converted files:', convertedFiles);

  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
  });

  archive.on('error', function (err) {
    console.error('Archive error:', err);
    res.status(500).end();
  });

  archive.on('end', () => {
    // Clean up the converted files after the archive has been created
    convertedFiles.forEach(file => fs.unlinkSync(file));
  });

  archive.pipe(res);

  convertedFiles.forEach(file => {
    console.log('File:', path.basename(file));
    archive.file(file, { name: path.basename(file) });
  });

  archive.finalize();
  } catch (error) {
    console.log('Error converting files:', error);
    res.status(500).json({ error: 'Image conversion failed', details: error.message });
  }
});


module.exports = uploadRouter