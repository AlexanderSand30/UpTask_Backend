import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db"
import projectRoutes from "./routes/projectRoutes"
import { corsConfig } from "./config/cors"
import morgan from "morgan"
import authRouter from "./routes/authRoutes"

dotenv.config()

connectDB()

const app = express()

app.use(cors(corsConfig))

//Login
app.use(morgan('dev'))

app.use(express.json())

//Routes
app.use('/api/auth', authRouter)
app.use('/api/projects', projectRoutes)

export default app