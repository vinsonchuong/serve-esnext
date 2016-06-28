import HtmlCompiler from 'serve-esnext/lib/compilers/html';
import JsCompiler from 'serve-esnext/lib/compilers/js';
import NpmCompiler from 'serve-esnext/lib/compilers/npm';

export default class {
  constructor(directory) {
    this.compilers = [
      new HtmlCompiler(directory),
      new JsCompiler(directory),
      new NpmCompiler(directory)
    ];
  }

  async compile({type, path}) {
    for (const compiler of this.compilers) {
      if (await compiler.matches({type, path})) {
        return await compiler.compile(path);
      }
    }
    return '';
  }
}
