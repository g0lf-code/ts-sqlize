import redis, { createClient, RedisClientType } from 'redis';
import { promisify } from 'util';

const client: RedisClientType = createClient({
  url:
    // process.env.REDIS_HOST + ':' + process.env.REDIS_PORT ||
    'redis://localhost:6379',
  // password: 'password@123',    //** enable this for securing redis also update redis.conf in container */
});

export const getAsync = promisify(client.get).bind(redis);
export const setAsync = promisify(client.set).bind(redis);

// class AsyncRedis {
//   _client = createClient({
//     url: process.env.REDIS_HOST || 'http://localhost:6379',
//     password: process.env.REDIS_PASS || 'password@123',
//   });

//   getAsync = promisify(this._client.get).bind(redis);
//   setAsync = promisify(this._client.set).bind(redis);
// }

// const rdsClient = new AsyncRedis();

client.on('error', (err: any) => {
  console.log(err);
});

export default client;
