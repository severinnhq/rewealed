import clientPromise from './mongodb';

export async function getProducts() {
  const client = await clientPromise;
  const db = client.db("webstore");
  const products = await db.collection("products").find({}).toArray();
  return JSON.parse(JSON.stringify(products));
}

