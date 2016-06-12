import Directory from 'directory-helpers';
import HttpServer from 'serve-esnext/lib/http-server';
import * as babel from 'babel-core';

const directory = new Directory('.');
const httpServer = new HttpServer(8080);

const compilationStrategies = {
  html(code) {
    return code;
  },

  js(code) {
    return babel.transform(code, {
      presets: ['es2015', 'stage-0'],
      plugins: ['transform-runtime', 'transform-decorators-legacy']
    }).code;
  }
};

async function run() {
  const request = await httpServer;
  const file = await directory.read(directory.path('src', request.path));
  const compiledCode = compilationStrategies[request.type](file);
  request.respond(compiledCode);
  await run();
}

run().catch((error) => {
  setTimeout(() => {
    throw error;
  }, 0);
});
