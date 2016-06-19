import * as parse5 from 'parse5';

const treeAdapter = parse5.treeAdapters.default;

export default class Document {
  constructor(document) {
    this.ast = typeof document === 'string' ?
      parse5.parse(document) :
      document;
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

  find(tagName, attrs = {}) {
    const elements = [];
    for (const element of this) {
      if (
        element.tagName === tagName &&
        Object.entries(attrs).every(([n1, v1]) =>
          element.attrs.some(({name: n2, value: v2}) =>
            n1 === n2 && v1 === v2
          )
        )
      ) {
        elements.push(element);
      }
    }
    return elements;
  }

  get head() {
    return new Document(this.find('head')[0]);
  }

  appendChild(htmlElementString) {
    const element = parse5.parseFragment(htmlElementString).childNodes[0];
    treeAdapter.appendChild(this.ast, element);
  }
}

