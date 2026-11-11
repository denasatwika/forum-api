import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'test' ? '.test.env' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: [
        'src/**/_test/**',
        'src/app.js',
        'src/Commons/config.js',
        'src/Infrastructures/container.js',
        'src/Infrastructures/database/**',
      ],
    },
  },
});