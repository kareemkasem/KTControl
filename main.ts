import dotenv from "dotenv";
import express, {Request, Response} from "express";
import helmet from "helmet";
import {connectToDatabase} from "./database";

// Route Imports
import employeeRoutes from "./routes/Employee";
import incentiveRoutes from "./routes/Incentive";
import bonusesRoutes from "./routes/bonuses";
import payrollRoutes from "./routes/Payroll";
import attendanceRoutes from "./routes/attendance";

// config
dotenv.config();

const server = express();
server.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "img-src": ["'self'", "media2.giphy.com"],
                // here I only included websites which I do NOT want to enforce the CSP which forbids loading
                // from outside sources
            },
        },
    })
);
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(express.static(process.cwd() + "/public"));
server.set("view engine", "ejs");

// Routing
server.get("/", (req: Request, res: Response) => {
    res.render("index.ejs");
});
server.use("/employee", employeeRoutes);
server.use("/incentive", incentiveRoutes);
server.use("/bonuses", bonusesRoutes);
server.use("/payroll", payrollRoutes);
server.use("/attendance", attendanceRoutes);
server.all("/*", (req: Request, res: Response) => {
    res.status(404).render("not-found.ejs");
});

// Establish the connection
connectToDatabase().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(
            ` Server started on port ${process.env.PORT} \n Database started on ${process.env.MONGO_URI}`
        );
    });
});
