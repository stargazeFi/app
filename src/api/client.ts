import { MongoClient, ServerApiVersion } from 'mongodb'

const mongoDbAuth = () =>
  process.env.NODE_ENV === 'production'
    ? `prod:${process.env.MONGO_DB_PASSWORD}`
    : `dev:${process.env.MONGO_DB_DEV_PASSWORD}`

const MONGO_DB_URL = `mongodb+srv://${mongoDbAuth()}@cluster0.j5m3jr1.mongodb.net/?retryWrites=true&w=majority`

export const createDatabaseClient = () =>
  new MongoClient(MONGO_DB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })
