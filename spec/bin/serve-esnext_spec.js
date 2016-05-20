import Directory from 'directory-helpers';

describe('serve-esnext', () => {
  it('outputs "3...2...1...Hello World!"', async () => {
    const directory = new Directory('.');
    expect(await directory.exec('serve-esnext')).toBe('Hello World!');
  });
});
