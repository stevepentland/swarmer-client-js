import { spawnSync } from 'child_process';
import { request } from 'http';
import { RequestOptions } from 'https';
import { RunnerConfig } from './models/config';
import { IRunResult } from './models/results';
import { TaskRunner } from './util/runner';

function run() {
    const cfg = RunnerConfig.fromEnvironment();
    const runner: TaskRunner = new TaskRunner(cfg, spawnSync);
    const result = runner.start();
    sendResult(cfg, result);
}

function sendResult(cfg: RunnerConfig, result: IRunResult): void {
    const opts: RequestOptions = {
        headers: {
            'Content-Length': Buffer.byteLength(JSON.stringify(result)),
            'Content-Type': 'application/json',
        },
        host: cfg.swarmerAddress,
        method: 'POST',
        path: `/result/${cfg.jobId}`,
        port: cfg.swarmerPort,
    };
    const req = request(opts);
    req.write(result);
    req.end();
}

run();
