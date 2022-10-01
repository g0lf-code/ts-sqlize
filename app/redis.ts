import redis, { createClient, RedisClientType } from 'redis';
import { promisify } from 'util';

const client: RedisClientType = createClient({
  url:
    // process.env.REDIS_HOST + ':' + process.env.REDIS_PORT ||
    'redis://localhost:6379',
  password: process.env.REDIS_PASS || 'password@123',
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

export default client;
