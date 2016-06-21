import Builder from 'systemjs-builder';

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  async compile(requestedPath) {
    if (requestedPath === 'systemjs/dist/system.src.js') {
      return await this.directory.read(`node_modules/${requestedPath}`);
    }

    const builder = new Builder({
      paths: {
        '*': 'node_modules/*'
      },
      defaultJSExtensions: true,
      packageConfigPaths: ['./node_modules/*/package.json']
    });
    const {source} = await builder.bundle(requestedPath, {
      format: 'es6',
      fetch(load, fetch) {
        if (load.address.match(/node_modules\/[^/]*\.js$/)) {
          load.address = load.address.replace(/\.js$/, '/index.js');
        }
        return fetch(load);
      }
    });
    return source;
  }
}
