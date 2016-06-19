import Document from 'serve-esnext/lib/compilers/html/document';

describe('Document', () => {
  it('can iterate over elements', () => {
    const document = new Document(`
      <!doctype html>
      <meta charset="utf-8">
      <article>
        <h1>Hello World!</h1>
        <p>This is a paragraph.</p>
      </article>
    `);

    expect([...document].map((element) => element.ast.tagName))
      .toEqual(['html', 'head', 'meta', 'body', 'article', 'h1', 'p']);
  });

  it('can find elements by tag and attributes', () => {
    const document = new Document(`
      <!doctype html>
      <meta charset="utf-8">
      <article>
        <h1>Hello World!</h1>
        <p class="subtitle">This is a paragraph.</p>
        <p class="subtitle">This is a paragraph.</p>
        <p class="text">This is a paragraph.</p>
      </article>
    `);

    expect(document.find('head').length).toBe(1);
    expect(document.find('p').length).toBe(3);
    expect(document.find('p', {class: 'subtitle'}).length).toBe(2);
  });
});
