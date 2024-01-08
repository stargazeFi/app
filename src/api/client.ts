import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGO_DB_URL = `mongodb+srv://front:${process.env.MONGO_FRONT_PASSWORD}@serverlessinstance0.6lpoyk5.mongodb.net/?retryWrites=true&w=majority`

export const createDatabaseClient = () =>
  new MongoClient(MONGO_DB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })
