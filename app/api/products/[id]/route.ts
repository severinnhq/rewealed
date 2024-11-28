import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("webstore")
    const { id } = params
    const { name, description, price, salePrice, mainImage, category, sizes, galleryImages } = await request.json()

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

