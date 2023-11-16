import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import { connectToDatabase } from "./database";

import employeeRoutes from "./routes/Employee";
import incentiveRoutes from "./routes/Incentive";

// config
dotenv.config();
const server = express();
server.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				"img-src": ["'self'", "media2.giphy.com"],
				// here I only included websites in which I do NOT want to enforce the CSP which forbids loading resources from outside sources
			},
		},
	})
);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(process.cwd() + "/public"));
server.set("view engine", "ejs");

// Routing
server.get("/", (req: Request, res: Response) => {
	//temporary, just for testing ****
	res.render("index.ejs");
});
server.use("/employee", employeeRoutes);
server.use("/incentive", incentiveRoutes)
server.all("/*", (req: Request, res: Response) => {
	res.status(404).render("not-found.ejs");
});

// Establish the connection
connectToDatabase();

server.listen(process.env.PORT, () => {
	console.log(` Server started on port ${process.env.PORT} \n Database started on ${process.env.MONGO_URI}`);
});
