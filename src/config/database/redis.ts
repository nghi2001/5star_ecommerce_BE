import Redis from 'ioredis';
import env from '../config';

const redis = new Redis({
    host: env("REDIS_HOST"),
    port: env("REDIS_PORT", Number),
    password: env("REDIS_PASSWORD"),
    username: env("REDIS_USERNAME")
})

export default redis;