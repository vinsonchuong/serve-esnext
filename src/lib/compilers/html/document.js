import * as parse5 from 'parse5';

const treeAdapter = parse5.treeAdapters.default;

export default class Document {
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

  *[Symbol.iterator]() {
    if (this.ast.tagName) {
      yield this.ast;
    }

    for (const node of this.ast.childNodes || []) {
      yield* new Document(node);
    }
  }

  appendChild(htmlElementString) {
    const element = parse5.parseFragment(htmlElementString).childNodes[0];
    treeAdapter.appendChild(this.ast, element);
  }
}

