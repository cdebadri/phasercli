const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const { dependencies, devDependencies } = require('../dependencies.json');
const {
  createDir,
  npmInitProcess,
  npmInstallProcess,
  npmAddScripts,
  copyScripts,
} = require('../scripts/phasercli');

jest.mock('child_process');
jest.mock('fs-extra');

describe('creates directory when called with a name', () => {
  const currentPath = path.join(process.cwd(), 'trial2');
  const pathname = path.join(__dirname, '..');
  process.argv[2] = 'trial2';

  test('it calls mkdirSync once', async () => {
    const directory = createDir(['trial2']);
    expect(fs.mkdirSync.mock.calls.length).toEqual(1);
    expect(fs.mkdirSync).toHaveBeenCalledWith(currentPath);
    expect(directory).toEqual(currentPath);
  });

  test('it calls exec for npm init', () => {
    npmInitProcess(currentPath);
    expect(child_process.exec).toHaveBeenCalledWith(
      'npm init -y',
      { cwd: currentPath },
      expect.any(Function)
    );
  });

  test('it calls exec for npm install for dependencies', () => {
    const command = `${dependencies.join(' ')} --save`;
    npmInstallProcess(command, currentPath);
    expect(child_process.exec).toHaveBeenCalledWith(
      `npm i ${command}`,
      { cwd: currentPath },
      expect.any(Function)
    );
  });

  test('it calls exec for npm install for dev dependencies', () => {
    const command = `${devDependencies.join(' ')} --save-dev`;
    npmInstallProcess(command, currentPath);
    expect(child_process.exec).toHaveBeenCalledWith(
      `npm i ${command}`,
      { cwd: currentPath },
      expect.any(Function)
    );
  });

  describe('it calls readJsonSync and writeJsonSync', () => {
    beforeEach(() => {
      npmAddScripts(currentPath);
    });

    it('calls readJsonSync', () => {
      expect(fs.readJsonSync.mock.calls.length).toEqual(1);
      expect(fs.readJsonSync).toHaveBeenCalledWith(`${currentPath}/package.json`);
    });

    it('calls writeJsonSync', () => {
      const packageContents = {
        scripts: {
          start: 'npx webpack serve --config ./webpack.config.dev.js',
          build: 'npx webpack',
        }
      }
      expect(fs.writeJsonSync.mock.calls.length).toEqual(2);
      expect(fs.writeJsonSync).toHaveBeenCalledWith(
        `${currentPath}/package.json`,
        packageContents,
        { spaces: 2 }
      );
    });    
  });

  describe('test copy script', () => {
    beforeEach(() => {
      copyScripts(pathname, currentPath);
    })
    test('calls fs copy 8 times', () => {
      expect(fs.copy.mock.calls.length).toEqual(8);
    });

    test('calls fs copy to copy src', () => {
      expect(fs.copy).toHaveBeenCalledWith(`${pathname}/src`, `${currentPath}/src`);
    });

    test('calls fs copy to copy static', () => {
      expect(fs.copy).toHaveBeenCalledWith(`${pathname}/static`, `${currentPath}/static`);
    });
  });
});
