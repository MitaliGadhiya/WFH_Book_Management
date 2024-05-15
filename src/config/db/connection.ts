import { connect } from 'mongoose'
import { SUCCESS } from '../../utils/constants/handle'
import dotenv from 'dotenv'

dotenv.config()
const url = process.env.URL || ''

export class Connection {
  public async connections(): Promise<void> {
    return connect(url)
      .then(() => {
        console.log(SUCCESS)
      })
      .catch((error: Error) => {
        // throw error;
        console.log(error)
      })
  }
}
