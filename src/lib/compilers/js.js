import * as babel from 'babel-core';

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  async compile(requestedPath) {
    const packageJson = await this.directory.read('package.json');
    const absolutePath = this.directory.path(
      requestedPath.replace(packageJson.name, 'src'));
    const fileContents = await this.directory.read(absolutePath);
    const {code} = babel.transform(fileContents, {
      moduleId: requestedPath,
      presets: ['es2015', 'stage-0'],
      plugins: [
        'transform-runtime',
        'transform-es2015-modules-systemjs',
        'transform-decorators-legacy'
      ]
    });
    return code;
  }
}
