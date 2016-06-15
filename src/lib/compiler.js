import HtmlCompiler from 'serve-esnext/lib/compilers/html';
import JsCompiler from 'serve-esnext/lib/compilers/js';

class DefaultCompiler {
  compile() {
    return '';
  }
}

export default class {
  constructor(directory) {
    this.html = new HtmlCompiler(directory);
    this.js = new JsCompiler(directory);
    this.default = new DefaultCompiler(directory);
  }

  async compile({type, path}) {
    return await this[type].compile(path);
  }
}
