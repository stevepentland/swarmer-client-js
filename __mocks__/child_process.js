'use strict';

const child_process = jest.genMockFromModule('child_process');

function spawnSync(cmd, args, options) {
    return {
        status: 0,
        stderr: undefined,
        stdout: 'The standard output'
    };
}

child_process.spawnSync = spawnSync;

module.exports = child_process;