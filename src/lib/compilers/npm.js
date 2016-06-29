import Builder from 'systemjs-builder';
import {parse as parseUrl} from 'url';
import {parse as parsePath, basename} from 'path';

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  async compile(requestedPath) {
    if (requestedPath.startsWith('systemjs/')) {
      return await this.directory.read(`node_modules/${requestedPath}`);
    }

    const builder = new Builder({
      paths: {
        '*': 'node_modules/*'
      },
      defaultJSExtensions: true
    });
    const {source} = await builder.bundle(requestedPath, {
      format: 'es6',
      fetch: async (load, fetch) => {
        const pathInfo = parsePath(parseUrl(load.address).path);

        if (basename(pathInfo.dir) === 'node_modules') {
          const packageJson = await this.directory.read(
            `${pathInfo.dir}/${pathInfo.name}/package.json`);
          const main = `${pathInfo.name}/${packageJson.main || 'index.js'}`;
          return `module.exports = require('${main}')`;
        }

        return await fetch(load);
      }
    });
    return source;
  }
}
