import { createClient } from 'redis';

const client = createClient();
client.on('error', (err) => console.log(err))

client.connect()
    .then(() => console.log('redis connected'))
    .catch(err => console.log(err))

export default client