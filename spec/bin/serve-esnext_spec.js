import {childProcess} from 'node-promise-es6';
import Directory from 'directory-helpers';
import PhantomJS from 'phantomjs-promise-es6';

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
  afterEach(async () => {
    const project = new Project('project');
    await project.stop();
    await project.remove();
  });

  it('serves ES.next to a browser', async () => {
    const project = new Project('project');

    const server = project.start();
    await server.filter((output) => output.match(/Listening/));

    const browser = new PhantomJS();
    await browser.open('http://localhost:8080');
    expect(browser.evaluate((window) =>
      window.document.querySelector('#container').textContent
    )).toBe('Hello World!');
  });
});
