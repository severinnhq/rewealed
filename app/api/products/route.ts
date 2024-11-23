import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { Product } from '../../../models/Product'

export async function POST(request: Request) {
  try {
    console.log('Received product upload request');
    const client = await clientPromise;
    console.log('MongoDB client connected');
    const db = client.db("clothingstore");
    
    const body = await request.json();
    const { name, description, price, image } = body;
    
    const product: Product = {
      name,
      description,
      price: parseFloat(price),
      image
    };

    console.log('Inserting product into database');
    const result = await db.collection("products").insertOne(product);
    console.log('Product inserted successfully');
    
    return NextResponse.json({ 
      message: "Product created successfully", 
      productId: result.insertedId 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error in product upload:', error);
    return NextResponse.json(
      { message: "Error creating product", error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("clothingstore");
    
    const products = await db.collection("products").find({}).toArray();
    
    return NextResponse.json(products);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Error fetching products", error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

