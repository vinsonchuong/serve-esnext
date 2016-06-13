import * as babel from 'babel-core';

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  async compile(requestedPath) {
    const packageJson = await this.directory.read('package.json');

    if (requestedPath.startsWith(`${packageJson.name}/`)) {
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
    }

    const absolutePath = require.resolve(requestedPath);
    const fileContents = await this.directory.read(absolutePath);
    return fileContents;
  }
}
