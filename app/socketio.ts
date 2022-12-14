import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import redisClient, { setAsync } from './redis';
import server from './server';
import { CORS_OPTIONS } from './app';

const socketAuth = require('socketio-auth');

const io = new Server({
  cors: CORS_OPTIONS,
  // transports: ['websocket'],
});

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
          token: 'secret',
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
    console.log('TRING TO AUTH THE SOCKET.......');
    console.log(data);
    const { token } = data;

    try {
      const user: any = await verifyUser(token);
      const canConnect = await redisClient.setEx(
        `users:${user.id}`,
        30,
        socket.id
      );

      if (!canConnect) {
        // return callback({ message: 'ALREADY_LOGGED_IN' });
        const retry = await redisClient.set(`users:${user.id}`, socket.id);
        if (!retry) {
          return callback({ message: 'ALREADY_LOGGED_IN' });
        }
      }

      socket.data.user = user;

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
        await redisClient.set(`users:${socket.user.id}`, socket.id, { EX: 30 });
      }
    });
  },
  disconnect: async (socket: any) => {
    console.log(`Socket ${socket.id} disconnected.`);
    console.log(socket.data);
    if (socket.user) {
      console.log(
        'deleting user key ==>> ',
        socket.user.id,
        `users:${socket.user.id}`
      );
      await redisClient.del(`users:${socket.user.id}`);
    }
  },
});

io.on('connect', (socket: any) => {
  console.log(socket.id);
  console.log('INCOMING SOCKET DATA');

  socket.on('disconnect', (reason: any) => {
    console.log(`Disconnected Internal: ${reason}`);
  });

  // console.log(data);
});

export default io;
