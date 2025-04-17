import 'dotenv/config';

const PORT = process.env.PORT || 8000
const WHITELIST = process.env.WHITELIST || ["http://localhost:3000/"]

export { PORT,WHITELIST }