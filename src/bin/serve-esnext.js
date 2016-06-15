import {loop} from 'esnext-async';
import Directory from 'directory-helpers';
import HttpServer from 'serve-esnext/lib/http-server';
import Compiler from 'serve-esnext/lib/compiler';

const directory = new Directory('.');
const httpServer = new HttpServer(8080);
const compiler = new Compiler(directory);

loop(async () => {
  const request = await httpServer;
  const compiledCode = await compiler.compile(request);
  request.respond(compiledCode);
});
