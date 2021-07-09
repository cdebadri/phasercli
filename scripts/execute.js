#!/usr/bin/env node

const path = require('path');
const {
  createDir,
  npmInitProcess,
  npmAddScripts,
  copyScripts,
  npmInstallProcess,
} = require('./phasercli');
const { dependencies, devDependencies } = require('../dependencies.json');


const generate = async () => {
  try {
    const pathname = path.join(__dirname, '..');
    const args = process.argv.slice(2);
    const DIRECTORY = createDir(args);

    if (DIRECTORY === null) {
      return;
    }

    await npmInitProcess(DIRECTORY);
    await npmInstallProcess(`${dependencies.join(' ')} --save`, DIRECTORY);
    await npmInstallProcess(`${devDependencies.join(' ')} --save-dev`, DIRECTORY);
    await copyScripts(pathname, DIRECTORY);
    npmAddScripts(DIRECTORY);
  } catch (error) {
    console.error(`Error occurred in main process! - ${error}`);
  }
};

generate();