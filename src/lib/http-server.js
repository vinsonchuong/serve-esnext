import {Buffer} from 'buffer';
import {Server} from 'http';
import * as path from 'path';
import * as url from 'url';

const mimeTypes = {
  '.js': 'application/javascript'
};
const types = {
  'text/html': 'html',
  'application/x-es-module': 'js',
  'application/javascript': 'js'
};

class Request {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  get path() {
    const {pathname} = url.parse(this.request.url);
    return pathname === '/' ?
      'index.html' :
      pathname.replace(/^\//, '');
  }

  get mimeType() {
    const accept = this.request.headers.accept.split(/\s*,\s*/)[0];
    if (accept === '*/*') {
      return mimeTypes[path.extname(this.request.url)];
    } else {
      return accept;
    }
  }

  get type() {
    return types[this.mimeType];
  }

  respond(body) {
    this.response.writeHead(200, {
      'Content-Type': `${this.mimeType}; charset=utf-8`,
      'Content-Length': Buffer.byteLength(body)
    });
    this.response.write(body);
    this.response.end();

  }
}

export default class {
  constructor(port, handleRequest) {
    this.server = new Server();
    this.server.on('request', (request, response) => {
      handleRequest(new Request(request, response));
    });
    this.listening = new Promise((resolve) => {
      this.server.listen(port, () => {
        process.stdout.write(`Listening on :${8080}\n`);
        resolve();
      });
    });
  }

  async close() {
    await new Promise((resolve) => {
      this.server.close(resolve);
    });
  }
}
