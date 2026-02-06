import fs from 'fs';

try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

// Force mongodb-memory-server to use a Windows x64 binary on ARM64 hosts.
if (process.platform === 'win32' && process.arch === 'arm64') {
  process.env.MONGOMS_DOWNLOAD_URL =
    process.env.MONGOMS_DOWNLOAD_URL ||
    'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14.zip';
  process.env.MONGOMS_VERSION = process.env.MONGOMS_VERSION || '7.0.14';

  try {
    // Patch mongodb-memory-server to accept "windows" archive names for parsing.
    // This allows using the x64 Windows binary on ARM64 under emulation.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {
      DryMongoBinary,
    } = require('mongodb-memory-server-core/lib/util/DryMongoBinary');
    const originalParse = DryMongoBinary.parseArchiveNameRegex;
    DryMongoBinary.parseArchiveNameRegex = function (input: string, opts: any) {
      const patchedInput = input.replace(/mongodb-windows-/g, 'mongodb-win32-');
      return originalParse.call(this, patchedInput, opts);
    };
  } catch {
    // ignore if patching fails; tests will surface the error
  }
} else {
  process.env.MONGOMS_VERSION = process.env.MONGOMS_VERSION || '7.0.14';
}

jest.mock('bcrypt', () => {
  const hashValue = (value: string) => `mocked:${value}`;
  return {
    genSalt: async () => 'salt',
    genSaltSync: () => 'salt',
    hash: async (value: string) => hashValue(value),
    hashSync: (value: string) => hashValue(value),
    compare: async (value: string, hashed: string) =>
      hashed === hashValue(value) || hashed === value,
    compareSync: (value: string, hashed: string) =>
      hashed === hashValue(value) || hashed === value,
  };
});

jest.mock('sharp', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');

  const mockSharp = () => {
    const api = {
      metadata: async () => ({ width: 128, height: 128, format: 'png' }),
      resize: () => api,
      png: () => api,
      toFile: async (filePath: string) => {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, Buffer.from(''));
      },
    };
    return api;
  };

  return Object.assign(mockSharp, { default: mockSharp });
});
