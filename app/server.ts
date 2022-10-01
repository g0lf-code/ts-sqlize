import { ExpressApp } from './app';
import Http from 'http';
import { Database } from './models';
import dotenv from 'dotenv';
import * as config from './config';
dotenv.config();
export class Server {
  expressApp = new ExpressApp();
  httpServer: Http.Server;

  constructor() {
    this.httpServer = new Http.Server(this.expressApp.app);
  }

  runServer = () => {
    console.log('running server..........');
    return this.databaseConnection()
      .then(this.serverListen)
      .catch(this.serverErrorHandler);
  };

  databaseConnection = () => {
    console.log('connecting database...........');
    return this.sequelizeAuthenticate().then(() => this.sequelizeSync());
  };

  sequelizeAuthenticate = () => {
    console.log('authenticating database............. ');
    return Database.authenticate();
  };

  sequelizeSync = () => {
    console.log('syncing db state');
    return Database.sync({ force: false });
  };

  serverListen = (): Http.Server => {
    console.log('making server listen to requests');
    const { PORT: port, HOST: host } = config;
    console.log({ port, host });
    return this.httpServer.listen(port, (): void => {
      console.log(`Server is running on: http://${host}:${port}`);
    });
  };

  serverErrorHandler = (error: Error): void => {
    console.log('Server run error: ', error.message);
    process.exit(1);
  };
}

const server = new Server();
server.runServer();
