import { RunnerConfig } from './config';

const oldEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
});

afterEach(() => {
    process.env = oldEnv;
});

[
    {
        envs: [],
        msg: 'Was expecting RUN_BASE_DIR to be set, but it was not...',
        name: 'RUN_BASE_DIR',
    },
    {
        envs: ['RUN_BASE_DIR'],
        msg: 'Was expecting RUN_CMD to be set, but it was not...',
        name: 'RUN_CMD',
    },
    {
        envs: ['RUN_BASE_DIR', 'RUN_CMD'],
        msg: 'Was expecting SWARMER_ADDRESS to be set, but it was not...',
        name: 'SWARMER_ADDRESS',
    },
    {
        envs: ['RUN_BASE_DIR', 'RUN_CMD', 'SWARMER_ADDRESS'],
        msg: 'Was expecting TASK_NAME to be set, but it was not...',
        name: 'TASK_NAME',
    },
    {
        envs: ['RUN_BASE_DIR', 'RUN_CMD', 'SWARMER_ADDRESS', 'TASK_NAME'],
        msg: 'Was expecting SWARMER_JOB_ID to be set, but it was not...',
        name: 'SWARMER_JOB_ID',
    },
].forEach((args) => {
    test(`Should throw if ${args.name} is not set`, () => {
        args.envs.forEach((e) => process.env[e] = 'set');
        expect(() => {
            RunnerConfig.fromEnvironment();
        }).toThrowError(args.msg);
    });
});

test('Should properly set fields from env', () => {
    const expectedBase = '/dir';
    const expectedCmd = 'cmd';
    const expectedAddr = 'swarmer';
    const expectedName = 'TheTask';
    const expectedId = 'ABC123';
    const originalArgs = '-a, --arg2, something, -v';
    const expectedArgs = ['-a', '--arg2', 'something', '-v'];

    process.env.RUN_BASE_DIR = expectedBase;
    process.env.RUN_CMD = expectedCmd;
    process.env.SWARMER_ADDRESS = expectedAddr;
    process.env.TASK_NAME = expectedName;
    process.env.SWARMER_JOB_ID = expectedId;
    process.env.RUN_ARGS = originalArgs;

    const actual = RunnerConfig.fromEnvironment();
    expect(actual.runCmd).toBe(expectedCmd);
    expect(actual.runBase).toBe(expectedBase);
    expect(actual.swarmerAddress).toBe(expectedAddr);
    expect(actual.runArgs).toEqual(expectedArgs);
    expect(actual.taskName).toBe(expectedName);
    expect(actual.jobId).toBe(expectedId);
});

test('Should have empty args if not set', () => {
    const expectedBase = '/dir';
    const expectedCmd = 'cmd';
    const expectedAddr = 'swarmer';
    const expectedName = 'TheTask';
    const expectedId = 'ABC123';

    process.env.RUN_BASE_DIR = expectedBase;
    process.env.RUN_CMD = expectedCmd;
    process.env.SWARMER_ADDRESS = expectedAddr;
    process.env.TASK_NAME = expectedName;
    process.env.SWARMER_JOB_ID = expectedId;

    const actual = RunnerConfig.fromEnvironment();
    expect(actual.runCmd).toBe(expectedCmd);
    expect(actual.runBase).toBe(expectedBase);
    expect(actual.swarmerAddress).toBe(expectedAddr);
    expect(actual.runArgs).toEqual([]);
    expect(actual.taskName).toBe(expectedName);
    expect(actual.jobId).toBe(expectedId);
});

test('Should gracefully handle runCmd with spaces', () => {
    const originalCmd = 'node command subcommand';
    const expectedCmd = 'node';
    const expectedArgs = ['command', 'subcommand'];

    process.env.RUN_BASE_DIR = '/dir';
    process.env.RUN_CMD = originalCmd;
    process.env.SWARMER_ADDRESS = 'swarmer';
    process.env.TASK_NAME = 'task';
    process.env.SWARMER_JOB_ID = 'abc123';

    const actual = RunnerConfig.fromEnvironment();
    expect(actual.runCmd).toBe(expectedCmd);
    expect(actual.runArgs).toEqual(expectedArgs);
});

test('Should prepend elements after first in runCmd with spaces to args', () => {
    const originalCmd = 'node command subcommand';
    const expectedCmd = 'node';
    const expectedArgs = ['command', 'subcommand', 'argOne', '--something', 'value'];

    process.env.RUN_BASE_DIR = '/dir';
    process.env.RUN_CMD = originalCmd;
    process.env.SWARMER_ADDRESS = 'swarmer';
    process.env.RUN_ARGS = 'argOne,--something,value';
    process.env.TASK_NAME = 'task';
    process.env.SWARMER_JOB_ID = 'abc123';

    const actual = RunnerConfig.fromEnvironment();
    expect(actual.runCmd).toBe(expectedCmd);
    expect(actual.runArgs).toEqual(expectedArgs);
});
