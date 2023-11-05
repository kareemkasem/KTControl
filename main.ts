import dotenv from "dotenv"
import express, { Request, Response } from "express"
import helmet from "helmet"
import { connectToDatabase, db } from "./database"
import { ObjectId } from "mongodb"

// config
dotenv.config()
const server = express()

// here I only included websites in which I do NOT want to enforce the CSP which forbids loading resources from outside sources
server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "media2.giphy.com"],
      },
    },
  })
)
server.use(express.json())
server.use(express.static(process.cwd() + "/public"))
server.set("view engine", "ejs")

//temporay, just for testing ****
server.get("/", (req: Request, res: Response) => {
  res.render("index.ejs")
})

server.get("/employees/:id", async (req: Request, res: Response) => {
  const id = req.params.id
  const data = await db
    .collection("employees")
    .findOne({ _id: new ObjectId(id) })
  res.status(200).send(data)
})

//****

server.all("/*", (req: Request, res: Response) => {
  res.status(404).render("not-found.ejs")
})

// database connection
connectToDatabase()

server.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`)
})
