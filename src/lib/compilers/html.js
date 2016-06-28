import Document from 'serve-esnext/lib/compilers/html/document';

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  matches({type}) {
    return type === 'html';
  }

  async compile(requestedPath) {
    const absolutePath = this.directory.path('src', requestedPath);
    const fileContents = await this.directory.read(absolutePath);

    const document = new Document(fileContents);
    document.head.appendChild(
      '<script src="systemjs/dist/system.js"></script>'
    );
    document.head.appendChild(
      `<script>System.config({defaultJSExtensions: true})</script>`
    );
    for (const script of document.find('script', {type: 'module'})) {
      script.remove();
      document.head.appendChild(
        `<script>System.import('${script.attributes.src}')</script>`
      );
    }

    return document.toString();
  }
}
