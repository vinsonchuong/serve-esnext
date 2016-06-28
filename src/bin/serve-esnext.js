import Directory from 'directory-helpers';
import {tryCatch} from 'esnext-async';
import HttpServer from 'serve-esnext/lib/http-server';
import Compiler from 'serve-esnext/lib/compiler';

const directory = new Directory('.');
const compiler = new Compiler(directory);
const server = new HttpServer(8080);
server.forEach(tryCatch(async (request) => {
  const compiledCode = await compiler.compile(request);
  request.respond(compiledCode);
}));
