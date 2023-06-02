require('dotenv').config()

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    GITHUB_AUTH: process.env.GITHUB_AUTH,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
}
