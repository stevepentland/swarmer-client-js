import { RunnerConfig } from '../models/config';
import { TaskRunner } from './runner';

jest.mock('child_process');

class MockConfig extends RunnerConfig {
    constructor(runBase: string,
                runCmd: string,
                swarmerAddress: string,
                taskName: string,
                jobId: string,
                runArgs: string[]) {
        super(runBase,
            runCmd,
            swarmerAddress,
            taskName,
            jobId,
            runArgs);
    }
}

test.skip('TaskRunner extracted properties as expected', () => {
    const cfg: RunnerConfig = new MockConfig('/app',
        'command',
        'swarmer',
        'TestTask1',
        'IDENTIFIER',
        ['-a', '--something']);

    const subject: TaskRunner = new TaskRunner(cfg);
    const result = subject.start();
    expect(result.task_name).toBe(cfg.taskName);
    expect(result.task_status).toBe(0);
    expect(result.task_result.stderr).toBeUndefined();
    expect(result.task_result.stdout).toBe('The standard output');
});
