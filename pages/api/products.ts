import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { WithId, Document, ObjectId } from 'mongodb'
import { Product, Size } from '../../models/Product'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | Product | { message: string; error?: string }>
) {
  if (req.method === 'GET') {
    console.log('Received GET request to /api/products')
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const rawProducts: WithId<Document>[] = await db.collection("products").find({}).toArray()
      
      const products: Product[] = rawProducts.map(product => ({
        _id: product._id,
        name: product.name as string,
        description: product.description as string,
        price: product.price as number,
        mainImage: product.mainImage as string,
        gallery: product.gallery as string[] || [],
        category: product.category as string | undefined,
        sizes: product.sizes as Size[] || [],
        salePrice: product.salePrice as number | undefined
      }))

      console.log('Fetched products:', products)

      res.status(200).json(products)
    } catch (error: unknown) {
      console.error('Error fetching products:', error)
      res.status(500).json({ 
        message: "Error fetching products", 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  } else if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const product: Omit<Product, '_id'> = req.body
      
      const result = await db.collection("products").insertOne(product)
      
      res.status(201).json({ 
        message: "Product created successfully", 
        _id: result.insertedId,
        ...product
      })
    } catch (error: unknown) {
      console.error('Error creating product:', error)
      res.status(500).json({ 
        message: "Error creating product", 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

