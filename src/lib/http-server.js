import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import {AwaitableObservable} from 'esnext-async';

const types = {
  '.html': 'text/html',
  '.js': 'application/javascript'
};

class Request {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  get path() {
    const {pathname} = url.parse(this.request.url);
    return pathname === '/' ?
      '/index.html' :
      pathname;
  }

  respond(body) {
    const mimeType = types[path.extname(this.path)];

    this.response.writeHead(200, {
      'Content-Type': `${mimeType}; charset=utf-8`
    });
    this.response.write(body);
    this.response.end();

  }
}

export default class extends AwaitableObservable {
  constructor(port) {
    const server = http.createServer();

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
