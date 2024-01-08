import { NextApiRequest, NextApiResponse } from 'next'
import { createDatabaseClient } from '@/api'
import { Price } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  const client = createDatabaseClient()
  await client.connect()
  const database = client.db(process.env.DB_ENV === 'production' ? 'prod' : 'dev')
  const collection = database.collection<Price>('prices')

  try {
    const prices = await collection.find().toArray()
    res.status(200).json(prices)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }

  await client.close()
}
