import ProductList from '../components/ProductList'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Clothing Brand Webstore</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
        <ProductList />
      </div>
    </div>
  )
}

