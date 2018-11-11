import { spawnSync } from 'child_process';
import { request } from 'http';
import { RequestOptions } from 'https';
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
    const runner: TaskRunner = new TaskRunner(cfg, spawnSync);

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
    const reqData = JSON.stringify(result);
    const opts: RequestOptions = {
        headers: {
            'Content-Length': Buffer.byteLength(JSON.stringify(reqData)),
            'Content-Type': 'application/json',
        },
        host: cfg.swarmerAddress,
        method: 'POST',
        path: `/result/${cfg.jobId}`,
        port: cfg.swarmerPort,
    };
    const req = request(opts);
    req.write(reqData);
    req.end();
}

run();
