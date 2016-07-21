import * as babel from 'babel-core';
import Directory from 'directory-helpers';

const directory = new Directory('src');

export default async function(requestedPath) {
  const path = requestedPath.replace(/.*?\//, '');
  const fileContents = await directory.read(path);
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
