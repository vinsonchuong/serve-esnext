import Directory from 'directory-helpers';
import HttpServer from 'serve-esnext/lib/http-server';
import HtmlCompiler from 'serve-esnext/lib/compilers/html';
import JsCompiler from 'serve-esnext/lib/compilers/js';

const directory = new Directory('.');
const httpServer = new HttpServer(8080);

const compilers = {
  html: new HtmlCompiler(directory),
  js: new JsCompiler(directory)
};

async function run() {
  const request = await httpServer;
  const compiler = compilers[request.type] || {
    compile() {
      return '';
    }
  };
  const compiledCode = await compiler.compile(request.path);
  request.respond(compiledCode);
  await run();
}

run().catch((error) => {
  setTimeout(() => {
    throw error;
  }, 0);
});
