import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { Product } from '../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const { name, description, price, image } = req.body
      
      const product: Product = {
        name,
        description,
        price: parseFloat(price),
        image
      }

      const result = await db.collection("products").insertOne(product)
      
      res.status(201).json({ message: "Product created successfully", productId: result.insertedId })
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error })
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const products = await db.collection("products").find({}).toArray()
      
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

