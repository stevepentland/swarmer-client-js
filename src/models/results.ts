/**
 * The `IRunResultOutput` is the expected object for the
 * standard out and standard error stream output
 */
export interface IRunResultOutput {
    /** The output passed to the standard output stream, if any */
    stdout: string | null;

    /** The output passed to the standard error stream, if any */
    stderr: string | null;
}

/**
 * The `IRunResult` is basically the data bucket that is
 * returned to the swarmer master to report on the outcome
 * of the task.
 */
export interface IRunResult {
    /** The name of this particular task */
    task_name: string;

    /** The exit status of the task */
    task_status: number;

    /** The output from the task run */
    task_result: IRunResultOutput;
}
