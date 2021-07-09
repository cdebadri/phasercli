const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const createDir = args => {
  if (args.length === 0) {
    console.error('usage -- provide a name for the project');
    return null;
  } else {
    fs.mkdirSync(path.join(process.cwd(), args[0]));
    return path.resolve(process.cwd(), args[0]);
  }
}

const npmInitProcess = DIRECTORY =>
  new Promise((resolve, reject) =>
    exec('npm init -y', {
      cwd: DIRECTORY,
    }, (error, stdout) => {
      if (error) {
        console.error(`Some error occureed - ${JSON.stringify(error)}`);
        reject(error);
      }
      console.log(stdout);
      resolve();
    }
  ));

const npmInstallProcess = (depString, DIRECTORY) =>
  new Promise((resolve, reject) =>
    exec(`npm i ${depString}`, {
      cwd: DIRECTORY,
    }, (error, stdout) => {
      if (error) {
        console.error(`Error during install - ${JSON.stringify(error)}`);
        reject(error);
      }
      console.log(stdout);
      resolve();
    }
  ));

const npmAddScripts = DIRECTORY => {
  const packageContents = fs.readJsonSync(`${DIRECTORY}/package.json`);
  packageContents.scripts.start = 'npx webpack serve --config ./webpack.config.dev.js';
  packageContents.scripts.build = 'npx webpack';
  fs.writeJsonSync(`${DIRECTORY}/package.json`, packageContents, { spaces: 2 });
}

const copyScripts = async (pathname, DIRECTORY) => {
  try {
    await fs.copy(`${pathname}/src`, `${DIRECTORY}/src`);
    await fs.copy(`${pathname}/static`, `${DIRECTORY}/static`);
    await fs.copy(`${pathname}/.editorconfig`, `${DIRECTORY}/.editorconfig`);
    await fs.copy(`${pathname}/index.html`, `${DIRECTORY}/index.html`);
    await fs.copy(`${pathname}/index.js`, `${DIRECTORY}/index.js`);
    await fs.copy(`${pathname}/jsconfig.json`, `${DIRECTORY}/jsconfig.json`);
    await fs.copy(`${pathname}/webpack.config.dev.js`, `${DIRECTORY}/webpack.config.dev.js`);
    await fs.copy(`${pathname}/webpack.config.js`, `${DIRECTORY}/webpack.config.js`);
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

module.exports = {
  createDir,
  npmInitProcess,
  npmInstallProcess,
  copyScripts,
  npmAddScripts,
};
