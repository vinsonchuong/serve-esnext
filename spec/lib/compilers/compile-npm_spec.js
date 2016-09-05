import compileNpm from 'serve-esnext/lib/compilers/compile-npm';

describe('compileNpm', () => {
  it('converts npm packages to SystemJS modules', async () => {
    const compiled = await compileNpm('react.js');
    expect(compiled).toContain("System.registerDynamic('react.js");
    expect(compiled).toContain("System.registerDynamic('react/react.js");
    expect(compiled).toContain("System.registerDynamic('react/lib/React.js");
  });
});
