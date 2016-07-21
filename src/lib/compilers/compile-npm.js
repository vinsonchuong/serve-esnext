import {parse as parseUrl} from 'url';
import {parse as parsePath, basename} from 'path';
import Directory from 'directory-helpers';
import Builder from 'systemjs-builder';

const directory = new Directory('node_modules');

const builder = new Builder({
  paths: {
    '*': 'node_modules/*'
  },
  defaultJSExtensions: true
});

async function fetch(load, oldFetch) {
  const pathInfo = parsePath(parseUrl(load.address).path);

  if (basename(pathInfo.dir) === 'node_modules') {
    const packageJson = await directory.read(
      `${pathInfo.name}/package.json`);
    const main = `${pathInfo.name}/${packageJson.main || 'index.js'}`;
    return `module.exports = require('${main}')`;
  }

  return await oldFetch(load);
}

export default async function(requestedPath) {
  const {source} = await builder.bundle(requestedPath, {format: 'es6', fetch});
  return source;
}
