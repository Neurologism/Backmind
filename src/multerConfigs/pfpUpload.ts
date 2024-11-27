import multer from 'multer';

export const pfpUploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/webp',
      'image/jpg',
      'image/jpeg',
      'image/png',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type.'));
    }
    cb(null, true);
  },
});
