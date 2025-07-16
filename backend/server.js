import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { db } from './config/database'
import userRoutes from './routes/userRoute'

dotenv.config()
const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())
db();
app.use('/api/auth',userRoutes)



app.listen(PORT,()=>{
  console.log(`Server is running at ${PORT}`)
})

