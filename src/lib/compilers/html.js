import * as parse5 from 'parse5';

const treeAdapter = parse5.treeAdapters.default;

class Document {
  constructor(document) {
    this.ast = typeof document === 'string' ?
      parse5.parse(document) :
      document;
  }

  get head() {
    return new Document(this.ast.childNodes[1].childNodes[0]);
  }

  toString() {
    return parse5.serialize(this.ast).replace(/\n/g, '');
  }

  appendChild(htmlElementString) {
    const element = parse5.parseFragment(htmlElementString).childNodes[0];
    treeAdapter.appendChild(this.ast, element);
  }
}

export default class {
  constructor(directory) {
    this.directory = directory;
  }

  async compile(requestedPath) {
    const absolutePath = this.directory.path('src', requestedPath);
    const fileContents = await this.directory.read(absolutePath);

    const document = new Document(fileContents);
    document.head.appendChild(
      '<script src="es6-module-loader/dist/es6-module-loader-dev.js"></script>'
    );
    return document.toString();
  }
}
