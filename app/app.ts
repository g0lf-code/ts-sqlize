import express from 'express';

import router from './routes';

export class ExpressApp {
  app = express();

  constructor() {
    this.setAppSettings();
    this.setAppRouter();
  }

  setAppSettings = (): void => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  };

  setAppRouter = (): void => {
    this.app.use('/api', router);
  };
}
