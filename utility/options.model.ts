// options.model.ts

export class MultipartOptions {
  constructor(
    public maxFileSize?: number,
    public fileType?: string | RegExp
  ) {}
}
