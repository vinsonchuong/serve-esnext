import * as http from 'http';
import {AwaitableObservable} from 'esnext-async';

export default class extends AwaitableObservable {
  constructor(port) {
    const server = http.createServer();

    super((observer) => {
      server.on('request', (request, response) => {
        observer.next({
          path: 'index.html',
          respond(body) {
            response.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8'
            });
            response.write(body);
            response.end();
          }
        });
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

// http
//   .createServer(async (request, response) => {
//     // 'application/javascript; charset=utf-8'
//     response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
//     response.write(await directory.read('src/index.html'));
//     response.end();
//   })
//   .listen(8080, () => {
//   });
