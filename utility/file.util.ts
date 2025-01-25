// file.util.ts

import { MultipartFile } from '@fastify/multipart';
import { MultipartOptions } from './options.model';
import {
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export const getFileFromPart = async (
  part: MultipartFile
): Promise<Storage.MultipartFile> => {
  const buffer = await part.toBuffer(); // <-- $1;
  return {
    buffer,
    size: buffer.byteLength,
    filename: part.filename,
    mimetype: part.mimetype,
    fieldname: part.fieldname,
  };
};

export const validateFile = (
  file: Storage.MultipartFile,
  options: MultipartOptions
): string | void => {
  const validators: FileValidator[] = [];

  if (options.maxFileSize)
    validators.push(new MaxFileSizeValidator({ maxSize: options.maxFileSize }));
  if (options.fileType)
    validators.push(new FileTypeValidator({ fileType: options.fileType }));

  for (const validator of validators) {
    if (validator.isValid(file)) continue;

    return validator.buildErrorMessage(file);
  }
};
