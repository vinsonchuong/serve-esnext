import {Buffer} from 'buffer';
import fetch from 'node-fetch';
import HttpServer from 'serve-esnext/lib/http-server';

function withHttpServer(test) {
  return async () => {
    const httpServer = new HttpServer(8080);
    try {
      await test(httpServer);
    } finally {
      await httpServer.close();
    }
  };
}

describe('HttpServer', () => {
  it('routes / to index.html', withHttpServer(async (httpServer) => {
    await httpServer.listening;

    const htmlString = '<!doctype html>\n<meta charset="utf-8">';

    const responsePromise = fetch('http://localhost:8080');

    const request = await httpServer;
    expect(request.path).toBe('index.html');
    expect(request.type).toBe('html');
    request.respond(htmlString);

    const response = await responsePromise;
    expect(await response.text()).toBe(htmlString);
    expect(response.headers.get('Content-Length'))
      .toBe(Buffer.byteLength(htmlString).toString());
    expect(response.headers.get('Content-Type'))
      .toBe('text/html; charset=utf-8');
  }));

  it('routes app.js', withHttpServer(async (httpServer) => {
    await httpServer.listening;

    const code = 'console.log("Hello World!");';

    const responsePromise = fetch('http://localhost:8080/app.js');

    const request = await httpServer;
    expect(request.path).toBe('app.js');
    expect(request.type).toBe('js');
    request.respond(code);

    const response = await responsePromise;
    expect(await response.text()).toBe(code);
    expect(response.headers.get('Content-Length'))
      .toBe(Buffer.byteLength(code).toString());
    expect(response.headers.get('Content-Type'))
      .toBe('application/javascript; charset=utf-8');
  }));
});
