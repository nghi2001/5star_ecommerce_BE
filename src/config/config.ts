import * as dotenv from 'dotenv';
dotenv.config();

const env = (key, parse: any = String) => {
    return parse(process.env[key])
}
export default env