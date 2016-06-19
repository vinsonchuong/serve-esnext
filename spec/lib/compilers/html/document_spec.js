import Document from 'serve-esnext/lib/compilers/html/document';

describe('Document', () => {
  it('can iterate over nodes', () => {
    const document = new Document(`
      <!doctype html>
      <meta charset="utf-8">
      <article>
        <h1>Hello World!</h1>
        <p>This is a paragraph.</p>
      </article>
    `);

    expect([...document].map(n => n.nodeName))
      .toEqual(['html', 'head', 'meta', 'body', 'article', 'h1', 'p']);
  });
});
