import { Category1 } from '../interface/CartegoryInterface'
import { Schema, model } from 'mongoose'

const Userschema = new Schema<Category1>({
  name: {
    type: String,
    required: true
  }
})

const CategoryModel = model<Category1>('category', Userschema)

export default CategoryModel
