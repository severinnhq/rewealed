import { ObjectId } from 'mongodb'

export interface Product {
  _id?: ObjectId
  name: string
  description: string
  price: number
  image: string
  category?: string
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
  salePrice?: number
}

