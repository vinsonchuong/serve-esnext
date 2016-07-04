import {Buffer} from 'buffer';
import fetch from 'node-fetch';
import HttpServer from 'serve-esnext/lib/http-server';
import {AwaitableObservable} from 'esnext-async';

function withHttpServer(test) {
  return async () => {
    const httpServer = new HttpServer(8080);
    const requests = new AwaitableObservable((observer) => {
      httpServer.handle(async (request) =>
        await new Promise((resolve) => {
          observer.next(Object.assign(request, {resolve}));
        })
      );
    });
    try {
      await httpServer.listening;
      await test(requests);
    } finally {
      await httpServer.close();
    }
  };
}

describe('HttpServer', () => {
  it('routes / to index.html', withHttpServer(async (requests) => {
    const htmlString = '<!doctype html>\n<meta charset="utf-8">';

    const responsePromise = fetch('http://localhost:8080', {
      headers: {
        Accept: 'text/html, */*'
      }
    });

    const request = await requests;
    expect(request.path).toBe('index.html');
    expect(request.type).toBe('html');
    request.resolve(htmlString);

    const response = await responsePromise;
    expect(await response.text()).toBe(htmlString);
    expect(response.headers.get('Content-Length'))
      .toBe(Buffer.byteLength(htmlString).toString());
    expect(response.headers.get('Content-Type'))
      .toBe('text/html; charset=utf-8');
  }));

  it('routes app.js', withHttpServer(async (requests) => {
    const code = 'console.log("Hello World!");';

    const responsePromise = fetch('http://localhost:8080/app.js', {
      headers: {
        Accept: 'application/x-es-module, */*'
      }
    });

    const request = await requests;
    expect(request.path).toBe('app.js');
    expect(request.type).toBe('js');
    request.resolve(code);

    const response = await responsePromise;
    expect(await response.text()).toBe(code);
    expect(response.headers.get('Content-Length'))
      .toBe(Buffer.byteLength(code).toString());
    expect(response.headers.get('Content-Type'))
      .toBe('application/x-es-module; charset=utf-8');
  }));

  it('routes system.js', withHttpServer(async (requests) => {
    const code = 'console.log("Hello World!");';

    const responsePromise = fetch('http://localhost:8080/system.js', {
      headers: {
        Accept: '*/*'
      }
    });

    const request = await requests;
    expect(request.path).toBe('system.js');
    expect(request.type).toBe('js');
    request.resolve(code);

    const response = await responsePromise;
    expect(await response.text()).toBe(code);
    expect(response.headers.get('Content-Length'))
      .toBe(Buffer.byteLength(code).toString());
    expect(response.headers.get('Content-Type'))
      .toBe('application/javascript; charset=utf-8');
  }));

  it('routes npm modules', withHttpServer(async (requests) => {
    const code = 'console.log("Hello World!");';

    const responsePromise = fetch('http://localhost:8080/react', {
      headers: {
        Accept: 'application/x-es-module, */*'
      }
    });

    const request = await requests;
    expect(request.path).toBe('react');
    expect(request.type).toBe('js');
    request.resolve(code);

    const response = await responsePromise;
    expect(await response.text()).toBe(code);
    expect(response.headers.get('Content-Length'))
      .toBe(Buffer.byteLength(code).toString());
    expect(response.headers.get('Content-Type'))
      .toBe('application/x-es-module; charset=utf-8');
  }));

  it('routes requests with no Accept header by file extension', withHttpServer(async (requests) => {
    const code = '...';

    const responsePromise = fetch('http://localhost:8080/system.js.map', {
      headers: {
        Accept: ''
      }
    });

    const request = await requests;
    expect(request.path).toBe('system.js.map');
    expect(request.type).toBe('static');
    request.resolve(code);

    const response = await responsePromise;
    expect(await response.text()).toBe(code);
    expect(response.headers.get('Content-Length'))
      .toBe(Buffer.byteLength(code).toString());
    expect(response.headers.get('Content-Type'))
      .toBe('application/json; charset=utf-8');
  }));
});
