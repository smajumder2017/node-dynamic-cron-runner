import { IConfig, ICronRunnerConfig, ITask } from '../interfaces';
import { schedule } from 'node-cron';

let instance: CronRunner | null = null;

export class CronRunner {
  private tasks: ITask[] = [];
  private config: IConfig = {};
  private statuses: { [jobName: string]: string } = {};
  private schedule: typeof schedule = schedule;

  constructor(runnerConfig: ICronRunnerConfig) {
    if (instance) {
      return instance;
    }
    this.config = runnerConfig.config;
    this.schedule = schedule.bind(this);
    instance = this;
  }

  setJobs = (jobsMap: {
    [jobName: string]: { expression: string; timeZone?: string };
  }) => {
    this.tasks = Object.keys(jobsMap).map((key) => {
      return {
        name: key,
        cronFn: this.schedule(jobsMap[key].expression, this.config[key], {
          timezone: jobsMap[key].timeZone,
          scheduled: false,
        }),
      };
    });
    this.tasks.forEach((task) => {
      this.statuses[task.name] = 'ready';
    });
  };

  startJobs = () => {
    this.tasks.forEach((task) => {
      task.cronFn.start();
      this.statuses[task.name] = 'scheduled';
    });
  };

  getJobStatus = () => {
    return this.statuses;
  };

  stopJobs = () => {
    this.tasks.forEach((task) => {
      task.cronFn.stop();
      this.statuses[task.name] = 'stopped';
    });
  };
}
