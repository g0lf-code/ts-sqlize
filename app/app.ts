import express from 'express';
import cors from 'cors';
import router from './routes';

export const CORS_OPTIONS = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: false,
};

export class ExpressApp {
  app = express();

  constructor() {
    this.setAppSettings();
    this.setAppRouter();
  }

  setAppSettings = (): void => {
    this.app.use(cors(CORS_OPTIONS));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.set('Access-Control-Allow-Origin', '*');
  };

  setAppRouter = (): void => {
    this.app.use('/api', router);
  };
}
