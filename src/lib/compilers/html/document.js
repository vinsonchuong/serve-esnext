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
      yield new Document(this.ast);
    }

    for (const node of this.ast.childNodes || []) {
      yield* new Document(node);
    }
  }

  find(tagName, attrs = {}) {
    const elements = [];
    for (const element of this) {
      if (
        element.ast.tagName === tagName &&
        Object.entries(attrs).every(([name, value]) =>
          element.attributes[name] === value
        )
      ) {
        elements.push(element);
      }
    }
    return elements;
  }

  get head() {
    return this.find('head')[0];
  }

  get attributes() {
    return this.ast.attrs.reduce((attrs, {name, value}) =>
      Object.assign(attrs, {[name]: value}), {});
  }

  appendChild(htmlElementString) {
    const element = parse5.parseFragment(htmlElementString).childNodes[0];
    treeAdapter.appendChild(this.ast, element);
  }

  remove() {
    treeAdapter.detachNode(this.ast);
  }
}

