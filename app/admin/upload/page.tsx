import ProductUploadForm from '../../../components/ProductUploadForm'

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload New Product</h1>
      <ProductUploadForm />
    </div>
  )
}

