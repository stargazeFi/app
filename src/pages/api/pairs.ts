import { NextApiRequest, NextApiResponse } from 'next'
import { createDatabaseClient } from '@/api'
import { Pair } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  const client = createDatabaseClient()
  await client.connect()
  const database = client.db(process.env.NODE_ENV === 'production' ? 'prod' : 'dev')

  try {
    const pairs = await database
      .collection<Pair>('sithswap')
      .aggregate<Pair>([
        ...['ekubo', 'jediswap'].map((coll) => ({
          $unionWith: { coll }
        })),
        {
          $match: { _id: { $ne: 'cursor' } }
        }
      ])
      .toArray()
    res.status(200).json(pairs)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }

  await client.close()
}
