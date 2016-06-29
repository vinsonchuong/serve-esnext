import HtmlCompiler from 'serve-esnext/lib/compilers/html';
import JsCompiler from 'serve-esnext/lib/compilers/js';
import NpmCompiler from 'serve-esnext/lib/compilers/npm';

export default class {
  constructor(directory) {
    this.directory = directory;
    this.html = new HtmlCompiler(directory);
    this.js = new JsCompiler(directory);
    this.npm = new NpmCompiler(directory);
  }

  async compile({type, path}) {
    const {name} = await this.directory.read('package.json');

    if (type === 'html') {

      // it('matches requests with type html', withDependencies(async (project) => {
      //   const compiler = new HtmlCompiler(project);
      //   expect(await compiler.matches({type: 'html'})).toBe(true);
      //   expect(await compiler.matches({type: 'js'})).toBe(false);
      // }));

      return await this.html.compile(path);
    } else if (type === 'js' && (path.startsWith(`${name}/`) || path === `${name}.js`)) {

      // it('matches requests of type js for paths within src', withDependencies(async (project) => {
      //   await project.write({
      //     'package.json': {
      //       name: 'project',
      //       private: true
      //     },
      //     'src/app.js': `
      //       console.log('Hello World!');
      //     `
      //   });

      //   const compiler = new JsCompiler(project);
      //   expect(await compiler.matches({type: 'js', path: 'project.js'})).toBe(true);
      //   expect(await compiler.matches({type: 'js', path: 'project/app.js'})).toBe(true);
      //   expect(await compiler.matches({type: 'js', path: 'package/app.js'})).toBe(false);
      //   expect(await compiler.matches({type: 'html'})).toBe(false);
      // }));

      return await this.js.compile(path);
    } else if (type === 'js' && !path.startsWith(`${name}/`) && path !== `${name}.js`) {

      // it('matches requests of type js for paths outside of src', withDependencies(async (project) => {
      //   const compiler = new NpmCompiler(project);
      //   expect(await compiler.matches({type: 'js', path: 'react.js'}))
      //     .toBe(true);
      //   expect(await compiler.matches({type: 'js', path: 'react/react.js'}))
      //     .toBe(true);
      //   expect(await compiler.matches({type: 'js', path: 'serve-esnext.js'}))
      //     .toBe(false);
      //   expect(await compiler.matches({type: 'html'})).toBe(false);
      // }));

      return await this.npm.compile(path);
    }

    return '';
  }
}
