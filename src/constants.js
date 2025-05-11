import 'dotenv/config';

const PORT = process.env.PORT || 8000

const WHITELIST = process.env.WHITELIST || ["http://localhost:5175/"]

const MONGO_URL = process.env.MONGO_URL

export { PORT, WHITELIST, MONGO_URL }