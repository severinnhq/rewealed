import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; error?: string }>
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' })
  }

  if (req.method === 'DELETE') {
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Product not found' })
      }

      res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error: unknown) {
      console.error('Error deleting product:', error)
      res.status(500).json({ 
        message: "Error deleting product", 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const updatedProduct = req.body
      delete updatedProduct._id // Remove _id from the update object

      const result = await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProduct }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Product not found' })
      }

      res.status(200).json({ message: 'Product updated successfully' })
    } catch (error: unknown) {
      console.error('Error updating product:', error)
      res.status(500).json({ 
        message: "Error updating product", 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

