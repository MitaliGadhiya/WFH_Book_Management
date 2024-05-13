import 'reflect-metadata'
import express, { Request, Response } from 'express'
import { Connection } from './db/connection'
import cookieParser from 'cookie-parser'
import { InversifyExpressServer } from 'inversify-express-utils'
import container from './inversify.config'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT || 8000

const db = new Connection()
db.connections()

const server = new InversifyExpressServer(container)
server.setConfig(app => {
  app.use(express.json())
  app.use(cookieParser())
})

const app = server.build()

app.listen(port, (): void => {
  console.log('server is running at port 3000')
})
