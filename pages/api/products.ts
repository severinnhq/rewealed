import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { Product } from '../../models/Product'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Increased from 10mb to 20mb
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Received POST request to /api/products')
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const { name, description, price, image } = req.body
      
      console.log('Received product data:', { name, description, price, imageSize: image?.length })

      if (!name || !description || typeof price !== 'number' || isNaN(price) || !image) {
        console.error('Invalid product data:', { name, description, price, imagePresent: !!image })
        return res.status(400).json({ message: "Invalid product data" })
      }

      const product: Product = {
        name,
        description,
        price,
        image
      }

      console.log('Attempting to insert product into database')
      const result = await db.collection("products").insertOne(product)
      console.log('Product inserted successfully, ID:', result.insertedId)
      
      res.status(201).json({ message: "Product created successfully", productId: result.insertedId })
    } catch (error: unknown) {
      console.error('Error in product upload:', error)
      res.status(500).json({ 
        message: "Error creating product", 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  } else if (req.method === 'GET') {
    console.log('Received GET request to /api/products')
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const products = await db.collection("products").find({}).toArray()
      
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

