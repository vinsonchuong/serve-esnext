import * as babel from 'babel-core';

export default async function(directory, requestedPath) {
  const packageJson = await directory.read('package.json');
  const absolutePath = directory.path(
    requestedPath.replace(packageJson.name, 'src'));
  const fileContents = await directory.read(absolutePath);
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
