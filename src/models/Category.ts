import { Category1 } from '../interface/cartegoryInterface'
import { Schema, model } from 'mongoose'

const Userschema = new Schema<Category1>({
  name: {
    type: String,
    required: true
  }
})

const CategoryModel = model<Category1>('category', Userschema)

export default CategoryModel