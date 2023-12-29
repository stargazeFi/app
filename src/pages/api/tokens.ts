import { NextApiRequest, NextApiResponse } from 'next'
import { Collection } from 'mongodb'
import { createDatabaseClient } from '@/api'
import { TokenInfo } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  const client = createDatabaseClient()
  await client.connect()
  const database = client.db(process.env.NODE_ENV === 'production' ? 'prod' : 'dev')
  const collection: Collection<TokenInfo> = database.collection<TokenInfo>('tokens')

  let tokens
  try {
    tokens = await collection.find().toArray()
  } catch (e) {
    console.error(e)
  }

  await client.close()
  res.status(200).json(tokens)
}
