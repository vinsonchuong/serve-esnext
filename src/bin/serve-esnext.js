import * as path from 'path';
import express from 'express';
import serveEsnext from 'serve-esnext';

express()
  .use(serveEsnext)
  .use(express.static(path.resolve()))
  .listen(8080, () => {
    process.stdout.write('Listening on :8080\n');
  });
