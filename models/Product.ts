import { ObjectId } from 'mongodb'

export interface Product {
  _id?: ObjectId
  name: string
  description: string
  price: number
  salePrice?: number
  sizes: string[]
  category: string
  image: string
  gallery: string[]
}

