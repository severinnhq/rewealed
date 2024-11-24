import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const { imageUrl, isMainImage } = body

    if (!imageUrl) {
      return NextResponse.json({ message: "Image URL is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("clothingstore")
    
    let updateOperation
    if (isMainImage) {
      updateOperation = { $set: { image: '' } }
    } else {
      updateOperation = { $pull: { gallery: imageUrl } }
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      updateOperation
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { 
        message: "Error deleting image", 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }, 
      { status: 500 }
    )
  }
}

