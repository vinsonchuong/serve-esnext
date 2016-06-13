import Directory from 'directory-helpers';
import HtmlCompiler from 'serve-esnext/lib/compilers/html';

function withDependencies(test) {
  return async () => {
    const project = new Directory('project');
    try {
      await test(project);
    } finally {
      await project.remove();
    }
  };
}

describe('HtmlCompiler', () => {
  it('adds the ES6 Module Loader Polyfill', withDependencies(async (project) => {
    await project.write({
      'src/index.html': `
        <!doctype html>
        <meta charset="utf-8">
        <div id="container"></div>
      `
    });

    const compiler = new HtmlCompiler(project);
    expect(await compiler.compile('index.html')).toBe([
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '<meta charset="utf-8">',
      '<script src="systemjs/dist/system.src.js"></script>',
      '</head>',
      '<body>',
      '<div id="container"></div>',
      '</body>',
      '</html>'
    ].join(''));
  }));
});
