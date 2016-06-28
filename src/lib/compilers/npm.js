import Builder from 'systemjs-builder';
import * as url from 'url';
import * as path from 'path';

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  async matches({type, path}) {
    const {name} = await this.directory.read('package.json');
    return type === 'js' && !path.startsWith(`${name}/`) &&
      path !== `${name}.js`;
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
        const pathInfo = path.parse(url.parse(load.address).path);

        if (path.basename(pathInfo.dir) === 'node_modules') {
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
