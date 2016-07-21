import Directory from 'directory-helpers';
import Document from 'serve-esnext/lib/compilers/html/document';

const directory = new Directory('src');

export default async function() {
  const html = await directory.read('index.html');
  const document = new Document(html);

  document.head.appendChild(
    '<script src="node_modules/systemjs/dist/system.js"></script>'
  );
  document.head.appendChild(
    '<script>System.config({defaultJSExtensions: true})</script>'
  );
  for (const script of document.find('script', {type: 'module'})) {
    script.remove();
    document.head.appendChild(
      `<script>System.import('${script.attributes.src}')</script>`
    );
  }

  return document.toString();
}
