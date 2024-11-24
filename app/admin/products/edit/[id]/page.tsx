import { ObjectId } from 'mongodb'
import clientPromise from '../../../../../lib/mongodb'
import EditProductForm from './EditProductForm'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  mainImage: string
  gallery?: string[]
  category?: string
  sizes?: string[]
  salePrice?: number
}

async function getProduct(id: string): Promise<Product | null> {
  const client = await clientPromise
  const db = client.db("clothingstore")
  const product = await db.collection("products").findOne({ _id: new ObjectId(id) })
  
  if (product) {
    return {
      ...product,
      _id: product._id.toString()
    } as Product
  }
  
  return null
}

export interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function EditProductPage({ params }: PageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    return <div>Product not found</div>
  }

  return <EditProductForm initialProduct={product} />
}

