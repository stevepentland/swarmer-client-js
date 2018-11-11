export class RunnerConfig {

    /**
     * Retrieve the command to invoke
     */
    public get runCmd(): string {
        return this._runCmd;
    }

    /**
     * Retrieve the base directory to invoke `runCmd` from
     */
    public get runBase(): string {
        return this._runBase;
    }

    /**
     * Retrieve the address that `swarmer` master is listening on
     */
    public get swarmerAddress(): string {
        return this._swarmerAddress;
    }

    /**
     * Retrieve the port that `swarmer` master is listening on
     */
    public get swarmerPort(): string {
        return this._swarmerPort;
    }

    /**
     * Retrieve the args to pass to `runCmd`, if any
     */
    public get runArgs(): string[] {
        return this._runArgs;
    }

    /**
     * Retrieve the name of this individual task
     */
    public get taskName(): string {
        return this._taskName;
    }

    /**
     * Retrieve the unique job identifier that this task belongs to
     */
    public get jobId(): string {
        return this._jobId;
    }

    /**
     * Create a new `RunnerConfig` instance from the currently set environment variables.
     *
     * Requires the following to be set:
     *
     * - TASK_NAME: (required) The name of this task, a `string`
     * - RUN_COMMAND: (required) The command to run, a `string`
     * - RUN_BASE_DIR: (required) The base directory to be in when `RUN_COMMAND` is invoked, a `string`
     * - SWARMER_JOB_ID: (required) The unique job identifier, a `string`
     * - SWARMER_ADDRESS: (required) The address that the master swarmer application is listening on, a `string`
     * - SWARMER_PORT: (required) The port that swarmer is listening on, a `string`
     * - RUN_ARGS: (optional) A collection of arguments to pass to `RUN_COMMAND`, a comma-separated `string`
     *
     * @throws An error if any of the listed variables except for `RUN_ARGS` are missing
     */
    public static fromEnvironment() {
        const runBase = process.env.RUN_BASE_DIR;
        const runCmd = process.env.RUN_CMD;
        const swarmerAddr = process.env.SWARMER_ADDRESS;
        const swarmerPort = process.env.SWARMER_PORT;
        const taskName = process.env.TASK_NAME;
        const swarmerJobId = process.env.SWARMER_JOB_ID;

        if (!runBase) {
            throw new Error('Was expecting RUN_BASE_DIR to be set, but it was not...');
        }

        if (!runCmd) {
            throw new Error('Was expecting RUN_COMMAND to be set, but it was not...');
        }

        if (!swarmerAddr) {
            throw new Error('Was expecting SWARMER_ADDRESS to be set, but it was not...');
        }

        if (!swarmerPort) {
            throw new Error('Was expecting SWARMER_PORT to be set, but it was not...');
        }

        if (!taskName) {
            throw new Error('Was expecting TASK_NAME to be set, but it was not...');
        }

        if (!swarmerJobId) {
            throw new Error('Was expecting SWARMER_JOB_ID to be set, but it was not...');
        }

        const envArgs = process.env.RUN_ARGS;

        const argsArr = envArgs ? envArgs.split(',').map((arg) => arg.trim()) : [];

        return new RunnerConfig(runCmd, runBase, swarmerAddr, swarmerPort, taskName, swarmerJobId, argsArr);
    }

    /**
     * Create a new `RunnerConfig` instance
     *
     * @param _runBase The base directory to run the target application from
     * @param _runCmd The comand to run
     * @param _swarmerAddress The callback address for swarmer
     * @param _swarmerPort The port that swarmer is listening on
     * @param _runArgs Any arguments to pass to the application
     */
    protected constructor(private _runBase: string,
                          private _runCmd: string,
                          private _swarmerAddress: string,
                          private _swarmerPort: string,
                          private _taskName: string,
                          private _jobId: string,
                          private _runArgs: string[] = []) {}
}
