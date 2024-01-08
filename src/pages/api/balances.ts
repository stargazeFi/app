import { NextApiRequest, NextApiResponse } from 'next'
import { createDatabaseClient } from '@/api'
import { Balances } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  const { address } = req.query
  if (!address) {
    return res.status(200).json({})
  }

  const client = createDatabaseClient()
  await client.connect()
  const database = client.db(process.env.NODE_ENV === 'production' ? 'prod' : 'dev')
  const collection = database.collection<Balances>('balances')

  try {
    const balances = (await collection.findOne({ address })) || { balances: {} }
    res.status(200).json(balances.balances)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }

  await client.close()
}
