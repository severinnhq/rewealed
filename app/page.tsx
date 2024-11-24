import ProductUploadForm from '../components/ProductUploadForm'
import ProductDisplay from '../components/ProductDisplay'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Clothing Brand Webstore</h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upload New Product</h2>
        <ProductUploadForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
        <ProductDisplay />
      </div>
    </div>
  )
}

