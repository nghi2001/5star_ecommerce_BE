import { createClient } from 'redis';
import env from '../config'

const client = createClient({
    url: env('REDIS_URL')
});
client.on('error', (err) => console.log(err))

client.connect()
    .then(() => console.log('redis connected'))
    .catch(err => console.log(err))

export default client