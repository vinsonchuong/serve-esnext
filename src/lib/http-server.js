import {Buffer} from 'buffer';
import {Server} from 'http';
import * as path from 'path';
import * as url from 'url';

const mimeTypes = {
  '.js': 'application/javascript',
  '.map': 'application/json'
};
const types = {
  'text/html': 'html',
  'application/x-es-module': 'js',
  'application/javascript': 'js'
};

class Request {
  constructor(request) {
    this.request = request;
  }

  get path() {
    const {pathname} = url.parse(this.request.url);
    return pathname === '/' ?
      'index.html' :
      pathname.replace(/^\//, '');
  }

  get mimeType() {
    const accept = (this.request.headers.accept || '*/*').split(/\s*,\s*/)[0];
    if (accept === '*/*') {
      return mimeTypes[path.extname(this.request.url)];
    }
    return accept;
  }

  get type() {
    return types[this.mimeType] || 'static';
  }
}

export default class {
  constructor(port) {
    this.server = new Server();
    this.listening = new Promise((resolve) => {
      this.server.listen(port, () => {
        process.stdout.write(`Listening on :${8080}\n`);
        resolve();
      });
    });
  }

  handle(handleRequest) {
    this.server.on('request', async (request, response) => {
      const requestProxy = new Request(request);
      const body = await handleRequest(requestProxy);

      response.writeHead(200, {
        'Content-Type': `${requestProxy.mimeType}; charset=utf-8`,
        'Content-Length': Buffer.byteLength(body)
      });
      response.write(body);
      response.end();
    });
  }

  async close() {
    await new Promise((resolve) => {
      this.server.close(resolve);
    });
  }
}
