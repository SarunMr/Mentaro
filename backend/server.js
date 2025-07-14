import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())


app.listen(PORT,()=>{
  console.log(`Server is running at ${PORT}`)
})

