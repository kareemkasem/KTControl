import dotenv from "dotenv"
import express, { Request, Response } from "express"
import helmet from "helmet"

dotenv.config()

const server = express()

server.use(helmet())
server.use(express.json())
server.use(express.static("./static"))
server.set("view engine", "ejs")

//temporay, just for testing
server.get("/", (req: Request, res: Response) => {
  res.render("index.ejs")
})

server.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`)
})
