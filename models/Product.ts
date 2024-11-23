import { ObjectId } from 'mongodb'

export interface Product {
  _id?: ObjectId
  name: string
  description: string
  price: number
  image: string // We'll store the image as a base64 string
}

