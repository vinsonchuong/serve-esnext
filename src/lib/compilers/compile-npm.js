import Builder from 'systemjs-builder';
import {parse as parseUrl} from 'url';
import {parse as parsePath, basename} from 'path';

const cache = new Map();

const builder = new Builder({
  paths: {
    '*': 'node_modules/*'
  },
  defaultJSExtensions: true
});

export default async function(directory, requestedPath) {
  if (cache.has(requestedPath)) {
    return cache.get(requestedPath);
  }

  if (requestedPath.startsWith('systemjs/')) {
    const source = await directory.read(`node_modules/${requestedPath}`);
    cache.set(requestedPath, source);
    return source;
  }

  const {source} = await builder.bundle(requestedPath, {
    format: 'es6',
    fetch: async (load, fetch) => {
      const pathInfo = parsePath(parseUrl(load.address).path);

      if (basename(pathInfo.dir) === 'node_modules') {
        const packageJson = await directory.read(
          `${pathInfo.dir}/${pathInfo.name}/package.json`);
        const main = `${pathInfo.name}/${packageJson.main || 'index.js'}`;
        return `module.exports = require('${main}')`;
      }

      return await fetch(load);
    }
  });
  cache.set(requestedPath, source);
  return source;
}
