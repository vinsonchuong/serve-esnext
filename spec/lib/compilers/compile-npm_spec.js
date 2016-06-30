import Directory from 'directory-helpers';
import compileNpm from 'serve-esnext/lib/compilers/compile-npm';

function withDependencies(test) {
  return async () => {
    const project = new Directory('.');
    await test(project);
  };
}

describe('compileNpm', () => {
  it('does not attempt to compile SystemJS', withDependencies(async (project) => {
    const systemJsPath = 'systemjs/dist/system.js';
    expect(await compileNpm(project, systemJsPath))
      .toBe(await project.read('node_modules/systemjs/dist/system.js'));
  }));

  it('converts npm packages to SystemJS modules', withDependencies(async (project) => {
    const compiled = await compileNpm(project, 'react.js');
    expect(compiled).toContain('System.registerDynamic("react.js');
    expect(compiled).toContain('System.registerDynamic("react/react.js');
    expect(compiled).toContain('System.registerDynamic("react/lib/React.js');
  }));
});
