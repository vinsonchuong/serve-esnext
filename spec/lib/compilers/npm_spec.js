import Directory from 'directory-helpers';
import NpmCompiler from 'serve-esnext/lib/compilers/npm';

function withDependencies(test) {
  return async () => {
    const project = new Directory('.');
    await test(project);
  };
}

describe('NpmCompiler', () => {
  it('matches requests of type js for paths outside of src', withDependencies(async (project) => {
    const compiler = new NpmCompiler(project);
    expect(await compiler.matches({type: 'js', path: 'react.js'}))
      .toBe(true);
    expect(await compiler.matches({type: 'js', path: 'react/react.js'}))
      .toBe(true);
    expect(await compiler.matches({type: 'js', path: 'serve-esnext.js'}))
      .toBe(false);
    expect(await compiler.matches({type: 'html'})).toBe(false);
  }));

  it('does not attempt to compile SystemJS', withDependencies(async (project) => {
    const compiler = new NpmCompiler(project);
    const systemJsPath = 'systemjs/dist/system.js';

    expect(await compiler.compile(systemJsPath))
      .toBe(await project.read('node_modules/systemjs/dist/system.js'));
  }));

  it('converts npm packages to SystemJS modules', withDependencies(async (project) => {
    const compiler = new NpmCompiler(project);
    const compiled = await compiler.compile('react.js');
    expect(compiled).toContain('System.registerDynamic("react.js');
    expect(compiled).toContain('System.registerDynamic("react/react.js');
    expect(compiled).toContain('System.registerDynamic("react/lib/React.js');
  }));
});
