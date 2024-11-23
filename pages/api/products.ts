import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { Product } from '../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Received product upload request');
      const client = await clientPromise;
      console.log('MongoDB client connected');
      const db = client.db("clothingstore");
      
      const { name, description, price, image } = req.body;
      
      const product: Product = {
        name,
        description,
        price: parseFloat(price),
        image
      };

      console.log('Inserting product into database');
      const result = await db.collection("products").insertOne(product);
      console.log('Product inserted successfully');
      
      res.status(201).json({ message: "Product created successfully", productId: result.insertedId });
    } catch (error: unknown) {
      console.error('Error in product upload:', error);
      res.status(500).json({ message: "Error creating product", error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db("clothingstore")
      
      const products = await db.collection("products").find({}).toArray()
      
      res.status(200).json(products)
    } catch (error: unknown) {
      res.status(500).json({ message: "Error fetching products", error: error instanceof Error ? error.message : 'An unknown error occurred' })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
}

