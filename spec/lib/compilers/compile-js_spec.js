import Directory from 'directory-helpers';
import compileJs from 'serve-esnext/lib/compilers/compile-js';

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

describe('compileJs', () => {
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

    const compiledCode = await compileJs(project, 'project/app.js');
    expect(compiledCode).toContain("console.log('Hello World!')");
    expect(compiledCode).toContain("System.register('project/app.js");
  }));
});
