import compileHtml from 'serve-esnext/lib/compilers/compile-html';
import compileJs from 'serve-esnext/lib/compilers/compile-js';
import compileNpm from 'serve-esnext/lib/compilers/compile-npm';

export default async function(directory, {type, path}) {
  const {name} = await directory.read('package.json');

  if (type === 'html') {
    return await compileHtml(directory, path);
  } else if (type === 'js') {
    if (path.startsWith(`${name}/`) || path === `${name}.js`) {
      return await compileJs(directory, path);
    }

    return await compileNpm(directory, path);
  }

  return '';
}
