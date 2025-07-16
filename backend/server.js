import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoute'

dotenv.config()
const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())
app.use('/api/auth',userRoutes)



app.listen(PORT,()=>{
  console.log(`Server is running at ${PORT}`)
})

