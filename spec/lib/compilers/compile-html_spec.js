import Directory from 'directory-helpers';
import compileHtml from 'serve-esnext/lib/compilers/compile-html';

describe('compileHtml', () => {
  it('adds the ES6 Module Loader Polyfill', async () => {
    const src = new Directory('src');
    try {
      await src.write({
        'index.html': `
          <!doctype html>
          <meta charset="utf-8">
          <div id="container"></div>
        `
      });

      expect(await compileHtml()).toBe([
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="utf-8">',
        '<script src="node_modules/systemjs/dist/system.js"></script>',
        '<script>System.config({defaultJSExtensions: true})</script>',
        '</head>',
        '<body>',
        '<div id="container"></div>',
        '</body>',
        '</html>'
      ].join(''));
    } finally {
      await src.remove('index.html');
    }
  });

  it('supports <script type="module">', async () => {
    const src = new Directory('src');
    try {
      await src.write({
        'index.html': `
          <!doctype html>
          <meta charset="utf-8">
          <script type="module" src="project/app.js"></script>
          <div id="container"></div>
        `
      });

      expect(await compileHtml()).toBe([
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="utf-8">',
        '<script src="node_modules/systemjs/dist/system.js"></script>',
        '<script>System.config({defaultJSExtensions: true})</script>',
        "<script>System.import('project/app.js')</script>",
        '</head>',
        '<body>',
        '<div id="container"></div>',
        '</body>',
        '</html>'
      ].join(''));
    } finally {
      await src.remove('index.html');
    }
  });
});
