'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');
const path = require('path');
const child_process = require('child_process');
const logger = require('../logger');
const errors = require('../errors');

class ScriptExecutor {
  constructor(scriptAbsPath) {
    const fileParts = _.split(scriptAbsPath, path.sep);
    this.fileName = fileParts[fileParts.length - 1];
    if (!fs.existsSync(scriptAbsPath)) {
      throw new errors.NotFound(`Script ${this.fileName} not found`);
    }
    this.scriptPath = scriptAbsPath;
  }

  execute() {
    return new Promise((resolve, reject) => {
      child_process.exec(this.scriptPath, (err, stdout, stderr) => {
        if (err === null) {
          try {
            stdout = JSON.parse(stdout);
          } catch (err) {
            logger.warn(`Script ${this.fileName} out put is not json. Its recommended to output json`);
          }
          return resolve(stdout);
        } else {
          const errResponse = {
            code: err.code,
            description: stderr !== '' ? stderr : stdout
          };
          return reject(errResponse);
        }
      });
    });
  }
}

module.exports = ScriptExecutor;