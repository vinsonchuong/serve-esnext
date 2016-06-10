import {childProcess} from 'node-promise-es6';
import Directory from 'directory-helpers';
import PhantomJS from 'phantomjs-adapter';

class Project extends Directory {
  start() {
    return this.spawn('npm', ['start']);
  }

  async stop() {
    try {
      const {stdout: serverPid} = await childProcess.exec("pgrep -f 'node.*serve-esnext$'");
      await childProcess.exec(`kill ${serverPid}`);
    } catch (error) {
      if (error.message.indexOf("pgrep -f 'node.*serve-esnext$'") === -1) {
        throw error;
      }
    }
  }
}

describe('serve-esnext', () => {
  function withDependencies(test) {
    return async () => {
      const project = new Project('project');
      const browser = new PhantomJS();
      try {
        await test(project, browser);
      } finally {
        await project.stop();
        await project.remove();
        await browser.exit();
      }
    };
  }

  it('serves index.html', withDependencies(async (project, browser) => {
    await project.write({
      'package.json': {
        name: 'project',
        private: true,
        scripts: {
          start: 'serve-esnext'
        }
      },
      'src/index.html': `
        <!doctype html>
        <meta charset="utf-8">
        <div id="container">Hello World!</div>
      `
    });

    await project.start().filter((output) => output.match(/Listening/));

    await browser.open('http://localhost:8080');
    expect((await browser.find('#container')).textContent).toBe('Hello World!');
  }));
});
