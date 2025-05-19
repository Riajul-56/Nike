import 'dotenv/config';

const PORT = process.env.PORT || 8000

const NODE_ENV=process.env.NODE_ENV

const WHITELIST = process.env.WHITELIST || ["http://localhost:5175/"]

const MONGO_URL = process.env.MONGO_URL

export { PORT, WHITELIST, MONGO_URL, NODE_ENV }