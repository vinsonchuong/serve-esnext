import {childProcess} from 'node-promise-es6';
import register from 'test-inject';
import Directory from 'directory-helpers';
import PhantomJS from 'phantomjs-adapter';

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

class Project extends Directory {
  start() {
    return this.spawn('npm', ['start']);
  }

  async stop() {
    try {
      const {stdout: serverPid} = await childProcess.exec("pgrep -f 'node.*serve-esnext$'");
      await childProcess.exec(`kill ${serverPid}`);
      await sleep(1000);
    } catch (error) {
      if (error.message.indexOf("pgrep -f 'node.*serve-esnext$'") === -1) {
        throw error;
      }
    }
  }
}

const inject = register({
  project: {
    setUp: () => new Project('project'),
    tearDown: async (project) => {
      await project.stop();
      await project.remove();
    }
  },
  browser: {
    setUp: () => new PhantomJS(),
    tearDown: async (browser) => await browser.exit()
  }
});

describe('serve-esnext', () => {
  it('serves index.html when requesting /', inject(async ({project, browser}) => {
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
    await project.symlink('../node_modules', 'node_modules');

    await project.start().filter((output) => output.match(/Listening/));

    await browser.open('http://localhost:8080');
    expect((await browser.find('#container')).textContent).toBe('Hello World!');
  }));

  it('serves ES.next modules compiled into ES5', inject(async ({project, browser}) => {
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
        <script type="module" src="project/app.js"></script>
        <div id="container"></div>
      `,
      'src/app.js': `
        import addText from './add-text.js';
        window.container::addText('Hello World!');
      `,
      'src/add-text.js': `
        export default function(text) {
          this.textContent = text;
        }
      `
    });
    await project.symlink('../node_modules', 'node_modules');

    await project.start().filter((output) => output.match(/Listening/));

    await browser.open('http://localhost:8080');
    expect(await browser.find('#container', {text: 'Hello World!', wait: 2000}))
      .not.toBe(null);
  }));

  it('serves external dependencies', inject(async ({project, browser}) => {
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
        <script type="module" src="project/app.js"></script>
        <div id="container"></div>
      `,
      'src/app.js': `
        import React from 'react';
        import ReactDOM from 'react-dom';

        function Component() {
          return React.createElement('p', null, 'Hello World!');
        }

        ReactDOM.render(React.createElement(Component), window.container);
      `
    });
    await project.symlink('../node_modules', 'node_modules');

    await project.start().filter((output) => output.match(/Listening/));

    await browser.open('http://localhost:8080');
    expect(await browser.find('#container p', {text: 'Hello World!', wait: 5000}))
      .not.toBe(null);
  }), 10000);
});
