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
      '<script src="systemjs/dist/system.js"></script>',
      '<script>System.config({defaultJSExtensions: true})</script>',
      '</head>',
      '<body>',
      '<div id="container"></div>',
      '</body>',
      '</html>'
    ].join(''));
  }));

  it('supports <script type="module">', withDependencies(async (project) => {
    await project.write({
      'src/index.html': `
        <!doctype html>
        <meta charset="utf-8">
        <script type="module" src="project/app.js"></script>
        <div id="container"></div>
      `
    });

    const compiler = new HtmlCompiler(project);
    expect(await compiler.compile('index.html')).toBe([
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '<meta charset="utf-8">',
      '<script src="systemjs/dist/system.js"></script>',
      '<script>System.config({defaultJSExtensions: true})</script>',
      "<script>System.import('project/app.js')</script>",
      '</head>',
      '<body>',
      '<div id="container"></div>',
      '</body>',
      '</html>'
    ].join(''));
  }));
});
