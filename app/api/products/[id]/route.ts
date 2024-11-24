import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { Product } from '../../../../models/Product'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const client = await clientPromise
    const db = client.db("clothingstore")
    
    const body = await request.json()
    const { name, description, price, salePrice, sizes, category, image, gallery } = body
    
    if (!name || !description || !price || !sizes || !category || !image) {
      return NextResponse.json({ message: "Invalid product data" }, { status: 400 })
    }

    const updatedProduct: Partial<Product> = {
      name,
      description,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      sizes,
      category,
      image,
      gallery: gallery || []
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product updated successfully", productId: id })
  } catch (error: unknown) {
    console.error('Error in product update:', error)
    return NextResponse.json(
      { 
        message: "Error updating product", 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const client = await clientPromise
    const db = client.db("clothingstore")
    
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error: unknown) {
    console.error('Error in product deletion:', error)
    return NextResponse.json(
      { 
        message: "Error deleting product", 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }, 
      { status: 500 }
    )
  }
}

