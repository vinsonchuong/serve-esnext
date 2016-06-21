import Directory from 'directory-helpers';
import System from 'systemjs';
import NpmCompiler from 'serve-esnext/lib/compilers/npm';

const systemModules = new Set(Object.keys(System._loader.modules));

function withDependencies(test) {
  return async () => {
    const project = new Directory('.');
    try {
      await test(project);
    } finally {
      for (const moduleName of Object.keys(System._loader.modules)) {
        if (!systemModules.has(moduleName)) {
          System.delete(moduleName);
        }
      }
    }
  };
}

fdescribe('NpmCompiler', () => {
  it('does not attempt to compile SystemJS', withDependencies(async (project) => {
    const compiler = new NpmCompiler(project);
    const systemJsPath = 'systemjs/dist/system.src.js';

    expect(await compiler.compile(systemJsPath))
      .toBe(await project.read('node_modules/systemjs/dist/system.src.js'));
  }));

  it('converts npm packages to SystemJS modules', withDependencies(async (project) => {
    const compiler = new NpmCompiler(project);
    eval(await compiler.compile('react'));
    console.log(System._loader);
  }));
});
