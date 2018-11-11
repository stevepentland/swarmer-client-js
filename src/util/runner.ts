import { spawnSync } from 'child_process';
import { RunnerConfig } from '../models/config';
import { IRunResult } from '../models/results';

export class TaskRunner {
    /**
     * Create the task runner
     *
     * @param config The runner configuration object
     * @param spawner The spawn function matching `child_process.spawn`
     */
    constructor(private config: RunnerConfig) { }

    public start(): IRunResult {
        const proc = spawnSync(
            this.config.runCmd,
            this.config.runArgs,
            { cwd: this.config.runBase, encoding: 'utf8' },
        );

        return {
            task_name: this.config.taskName,
            task_result: {
                stderr: proc.stderr,
                stdout: proc.stdout,
            },
            task_status: proc.status,
        };
    }
}
