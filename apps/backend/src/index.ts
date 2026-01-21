import 'dotenv/config';
import session from "express-session";
import express from "express"
import passport from 'passport';
import cors from "cors"
import auth from "./router/auth"
import doc from "./router/doc"
import cookieParser from "cookie-parser"

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,                
  })
);


app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth)
app.use("/doc", doc)

app.listen(port, () => console.log(`Server running on port ${port}`));