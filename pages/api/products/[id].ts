import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const client = await clientPromise
  const db = client.db("clothingstore")

  switch (req.method) {
    case 'GET':
      try {
        const product = await db.collection("products").findOne({ _id: new ObjectId(id as string) })
        if (!product) {
          return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json(product)
      } catch (error) {
        res.status(500).json({ message: "Error fetching product", error })
      }
      break

    case 'PUT':
      try {
        const { name, description, price, mainImage, gallery, category, sizes, salePrice } = req.body
        const result = await db.collection("products").updateOne(
          { _id: new ObjectId(id as string) },
          { $set: { name, description, price, mainImage, gallery, category, sizes, salePrice } }
        )
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ message: "Product updated successfully" })
      } catch (error) {
        res.status(500).json({ message: "Error updating product", error })
      }
      break

    case 'DELETE':
      try {
        const result = await db.collection("products").deleteOne({ _id: new ObjectId(id as string) })
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ message: "Product deleted successfully" })
      } catch (error) {
        res.status(500).json({ message: "Error deleting product", error })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

