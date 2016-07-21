import compileJs from 'serve-esnext/lib/compilers/compile-js';

describe('compileJs', () => {
  it('compiles ES.next modules', async () => {
    const compiledCode = await compileJs('serve-esnext/index.js');
    expect(compiledCode).toContain("System.register('serve-esnext/index.js");
    expect(compiledCode).toContain('request, response');
  });
});
