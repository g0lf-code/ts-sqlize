import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import redisClient, { setAsync } from './redis';
import server from './server';

const socketAuth = require('socketio-auth');

const io = new Server();

// io.attach(server.httpServer);
io.adapter(createAdapter(redisClient, redisClient.duplicate()));

// dummy user verification
async function verifyUser(token: any) {
  return new Promise((resolve, reject) => {
    // setTimeout to mock a cache or database call
    setTimeout(() => {
      // this information should come from your cache or database
      const users = [
        {
          id: 1,
          name: 'mariotacke',
          token: 'secret token',
        },
      ];

      const user = users.find((user) => user.token === token);

      if (!user) {
        return reject('USER_NOT_FOUND');
      }

      return resolve(user);
    }, 200);
  });
}

socketAuth(io, {
  authenticate: async (socket: any, data: any, callback: any) => {
    const { token } = data;

    try {
      const user: any = await verifyUser(token);
      const canConnect = await setAsync(
        `users:${user.id}`,
        socket.id,
        'NX',
        'EX',
        30
      );

      if (!canConnect) {
        return callback({ message: 'ALREADY_LOGGED_IN' });
      }

      socket.user = user;

      return callback(null, true);
    } catch (e) {
      console.log(`Socket ${socket.id} unauthorized.`);
      return callback({ message: 'UNAUTHORIZED' });
    }
  },
  postAuthenticate: async (socket: any) => {
    console.log(`Socket ${socket.id} authenticated.`);

    socket.conn.on('packet', async (packet: any) => {
      if (socket.auth && packet.type === 'ping') {
        await setAsync(
          `users:${socket.user.id}`,
          socket.id,
          // 'XX',
          'EX',
          30
        );
      }
    });
  },
  disconnect: async (socket: any) => {
    console.log(`Socket ${socket.id} disconnected.`);

    if (socket.user) {
      await redisClient.del(`users:${socket.user.id}`);
    }
  },
});

io.on('connect', (socket: any) => {
  console.log(socket);
  console.log('INCOMING SOCKET DATA');
  // console.log(data);
});

export default io;
