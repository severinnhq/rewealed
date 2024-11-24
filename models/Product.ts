import { ObjectId } from 'mongodb'

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface Product {
  _id?: ObjectId
  name: string
  description: string
  price: number
  mainImage: string
  gallery: string[]
  category?: string
  sizes: Size[]
  salePrice?: number
}

