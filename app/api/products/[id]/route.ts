import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("webstore")
    const { id } = params
    const body = await request.json()

    const { name, description, price, salePrice, mainImage, category, sizes, galleryImages } = body

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          price,
          salePrice,
          mainImage,
          category,
          sizes,
          galleryImages,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product updated successfully' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("webstore")
    const { id } = params

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) })

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("webstore")
    const { id } = params

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 })
  }
}

