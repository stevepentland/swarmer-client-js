import axios from 'axios';
import { RunnerConfig } from './models/config';
import { IRunResult } from './models/results';
import { TaskRunner } from './util/runner';

/**
 * The main entrypoint for the runner, gets the configuration
 * from the currently set environment and runs the specified
 * task, reporting back the outcome to the swarm coordinator.
 */
function run() {
    // Get the configuration
    const cfg = RunnerConfig.fromEnvironment();

    // Instantiate the runner
    const runner: TaskRunner = new TaskRunner(cfg);

    // Instruct the runner to start the task
    const result = runner.start();

    // Report back on the results
    sendResult(cfg, result);
}

/**
 * Return the result of the task run to the swarmer master
 *
 * @param cfg The `RunnerConfig` instance
 * @param result The result of the run operation
 */
function sendResult(cfg: RunnerConfig, result: IRunResult): void {
    process.stdout.write('Sending results to swarmer master\n');
    axios.post(cfg.swarmerAddress, result)
        .then((resp) => process.stdout.write(`Result sent, status ${resp.status}`))
        .catch((err) => process.stderr.write(`Error on result update:\n${err}`));
}

run();
