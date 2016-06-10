import Directory from 'directory-helpers';
import HttpServer from 'serve-esnext/lib/http-server';

const directory = new Directory('.');
const httpServer = new HttpServer(8080);

async function run() {
  const request = await httpServer;
  request.respond(await directory.read(directory.path('src', request.path)));
  await run();
}

run().catch((error) => {
  setTimeout(() => {
    throw error;
  }, 0);
});
