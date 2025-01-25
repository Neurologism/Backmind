declare namespace Storage {
  interface MultipartFile {
    buffer: Buffer;
    filename: string;
    size: number;
    mimetype: string;
    fieldname: string;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    storedFiles: Record<string, Storage.MultipartFile[]>;
    body: unknown;
    headers: Record<string, string>;
    ip: string;
    originalUrl: string;
  }
}
