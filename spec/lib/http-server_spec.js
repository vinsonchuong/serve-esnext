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
  it('routes / to /index.html', withHttpServer(async (httpServer) => {
    await httpServer.listening;

    const responsePromise = fetch('http://localhost:8080');

    const request = await httpServer;
    expect(request.path).toBe('/index.html');
    request.respond('<!doctype html>\n<meta charset="utf-8">');

    const response = await responsePromise;
    expect(await response.text())
      .toBe('<!doctype html>\n<meta charset="utf-8">');
    expect(response.headers.get('Content-Type'))
      .toBe('text/html; charset=utf-8');
  }));

  it('routes /app.js', withHttpServer(async (httpServer) => {
    await httpServer.listening;

    const responsePromise = fetch('http://localhost:8080/app.js');

    const request = await httpServer;
    expect(request.path).toBe('/app.js');
    request.respond('console.log("Hello World!");');

    const response = await responsePromise;
    expect(await response.text())
      .toBe('console.log("Hello World!");');
    expect(response.headers.get('Content-Type'))
      .toBe('application/javascript; charset=utf-8');
  }));
});
