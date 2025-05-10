import 'dotenv/config';

const PORT = process.env.PORT || 8000
const WHITELIST = process.env.WHITELIST || ["http://localhost:5175/"]

export { PORT,WHITELIST }