import { createDatabaseClient } from '@/api'
import { Strategy } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  const client = createDatabaseClient()
  await client.connect()
  const database = client.db(process.env.DB_ENV)
  const collection = database.collection<Strategy>('strategies')

  try {
    const strategies: Strategy[] = await collection.find().toArray()
    res.status(200).json(strategies)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }

  await client.close()
}
