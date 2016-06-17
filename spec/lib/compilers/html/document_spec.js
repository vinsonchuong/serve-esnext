import Document from 'serve-esnext/lib/compilers/html/document';

describe('Document', () => {
  it('can iterate over nodes', () => {
    const document = new Document(`
      <!doctype html>
      <meta charset="utf-8">
    `);

    expect([...document].map(n => n.nodeName))
      .toEqual(['html', 'head', 'meta', 'body']);
  });
});
