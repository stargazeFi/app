import { createDatabaseClient } from '@/api'
import { Strategy } from '@/types'
import { Collection } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  const client = createDatabaseClient()
  await client.connect()
  const database = client.db(process.env.NODE_ENV === 'production' ? 'prod' : 'dev')
  const collection: Collection<Strategy> = database.collection<Strategy>('strategies')

  try {
    const strategies = await collection.find().toArray()
    res.status(200).json(strategies)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }

  await client.close()
}