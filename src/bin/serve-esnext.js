import Directory from 'directory-helpers';
import {tryCatch} from 'esnext-async';
import HttpServer from 'serve-esnext/lib/http-server';
import compile from 'serve-esnext/lib/compile';

const directory = new Directory('.');
const server = new HttpServer(8080);
server.forEach(tryCatch(async (request) => {
  request.respond(await compile(directory, request));
}));
