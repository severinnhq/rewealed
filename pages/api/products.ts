import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { Product } from '../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    console.log('Received GET request to /api/products')
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const products = await db.collection("products").find({}).toArray()
      
      console.log('Fetched products:', products) // Log the fetched products

      res.status(200).json(products)
    } catch (error: unknown) {
      console.error('Error fetching products:', error)
      res.status(500).json({ 
        message: "Error fetching products", 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

