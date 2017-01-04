import * as path from 'path';
import {tryCatch} from 'esnext-async';
import compileHtml from 'serve-esnext/lib/compilers/compile-html';
import compileJs from 'serve-esnext/lib/compilers/compile-js';
import compileNpm from 'serve-esnext/lib/compilers/compile-npm';

export default tryCatch(async (request, response, next) => {
  /* eslint-disable global-require, lines-around-comment */
  const {name} = require(path.resolve('package.json'));
  /* eslint-enable global-require, lines-around-comment */

  const requestedPath = request.path.replace('/', '');

  if (requestedPath === '') {
    response.send(await compileHtml());
    return;
  }

  if ((request.get('Accept') || '').includes('application/x-es-module')) {
    response.send(
      requestedPath.startsWith(`${name}/`) || requestedPath === `${name}.js` ?
        await compileJs(requestedPath) :
        await compileNpm(requestedPath)
    );
    return;
  }

  next();
});
