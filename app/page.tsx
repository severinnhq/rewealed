import { Suspense } from 'react'
import ProductUploadForm from '../components/ProductUploadForm'
import ProductDisplay from '../components/ProductDisplay'
import { Product } from '../models/Product'

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Clothing Brand Webstore</h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upload New Product</h2>
        <ProductUploadForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductDisplay products={products} />
        </Suspense>
      </div>
    </div>
  )
}

