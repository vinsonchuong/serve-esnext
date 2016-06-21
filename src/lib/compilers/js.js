import * as path from 'path';
import * as babel from 'babel-core';
import Builder from 'systemjs-builder';

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  async compile(requestedPath) {
    const packageJson = await this.directory.read('package.json');

    if (
      requestedPath === packageJson.name ||
      requestedPath.startsWith(`${packageJson.name}/`)
    ) {
      const absolutePath = this.directory.path(
        requestedPath.replace(packageJson.name, 'src'));
      const fileContents = await this.directory.read(absolutePath);
      return babel.transform(fileContents, {
        presets: ['es2015', 'stage-0'],
        plugins: [
          'transform-runtime',
          'transform-es2015-modules-systemjs',
          'transform-decorators-legacy'
        ]
      }).code;
    } else {
      const builder = new Builder({
        defaultJSExtensions: true
      });
      const [packageName] = requestedPath.split('/');

      if (packageName === 'systemjs') {
        const absolutePath = require.resolve(requestedPath);
        return await this.directory.read(absolutePath);
      } else {
        const packagePath = path.dirname(
          require.resolve(`${packageName}/package.json`));
        const {source, modules} = await builder.bundle(
          `[${packagePath}/**/*.js]`);
        return source;
      }
    }
  }
}
