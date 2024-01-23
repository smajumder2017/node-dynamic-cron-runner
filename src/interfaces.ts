import { ScheduledTask } from 'node-cron';

export interface ICronRunnerConfig {
  config: IConfig;
}

export interface ITask {
  name: string;
  cronFn: ScheduledTask;
}

export interface IConfig {
  [jobName: string]: () => void;
}
