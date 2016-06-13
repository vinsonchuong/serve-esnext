import Directory from 'directory-helpers';
import JsCompiler from 'serve-esnext/lib/compilers/js';

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

describe('JsCompiler', () => {
  it('compiles ES.next modules', withDependencies(async (project) => {
    await project.write({
      'package.json': {
        name: 'project',
        private: true
      },
      'src/app.js': `
        console.log('Hello World!');
      `
    });

    const compiler = new JsCompiler(project);
    const compiledCode = await compiler.compile('project/app.js');
    expect(compiledCode).toContain("console.log('Hello World!')");
    expect(compiledCode).toContain('System.register');
  }));

  it('does not compile npm packages', withDependencies(async (project) => {
    await project.write({
      'package.json': {
        name: 'project',
        private: true
      }
    });

    const compiler = new JsCompiler(project);
    const modulePath = 'es6-module-loader/dist/es6-module-loader-dev.js';
    expect(await compiler.compile(modulePath))
      .toBe(await project.read(require.resolve(modulePath)));
  }));
});
