import express from 'express';

import router from './routes';
import { PORT } from './utils';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use('/api', router);
    //  (error: Error, request: Request, response: Response, next: NextFunction) => {
    //     response.status(400).json({
    //         success: false,
    //         error: error.message,
    //     });
    // });
  };
}

// server.listen(PORT, () => {
//   console.log('server started sunnessdully....');
// });
