import {Buffer} from 'buffer';
import {Server} from 'http';
import * as url from 'url';
import * as path from 'path';
import {AwaitableObservable} from 'esnext-async';

const types = {
  html: 'text/html',
  js: 'application/javascript'
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

  get type() {
    return path.extname(this.path).slice(1);
  }

  respond(body) {
    const mimeType = types[this.type];

    this.response.writeHead(200, {
      'Content-Type': `${mimeType}; charset=utf-8`,
      'Content-Length': Buffer.byteLength(body)
    });
    this.response.write(body);
    this.response.end();

  }
}

export default class extends AwaitableObservable {
  constructor(port) {
    const server = new Server();

    super((observer) => {
      server.on('request', (request, response) => {
        observer.next(new Request(request, response));
      });
    });

    this.listening = new Promise((resolve) => {
      server.listen(port, () => {
        process.stdout.write(`Listening on :${8080}\n`);
        resolve();
      });
    });

    this.server = server;
  }

  async close() {
    await new Promise((resolve) => {
      this.server.close(resolve);
    });
  }
}
