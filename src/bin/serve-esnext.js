import * as http from 'http';
import Directory from 'directory-helpers';

const directory = new Directory('.');

http
  .createServer(async (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.write(await directory.read('src/index.html'));
    response.end();
  })
  .listen(8080, () => {
    process.stdout.write('Listening on :8080\n');
  });
