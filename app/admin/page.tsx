import AdminProductList from '../../components/AdminProductList'

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
        <AdminProductList />
      </div>
    </div>
  )
}

