import {childProcess} from 'node-promise-es6';

describe('serve-esnext', () => {
  it('outputs "3...2...1...Hello World!"', async () => {
    const {stdout} = await childProcess.exec('serve-esnext');
    expect(stdout.trim()).toBe('3...2...1...Hello World!');
  });
});
