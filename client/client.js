import express from 'express'
import path from 'path'

const client = express()
client.use(express.json())

const PORT = 8000 
const __dirname = path.resolve()

//client enters here first
client.get('/client', (req,res)=>{
    res.sendFile("index.html", {root : path.join(__dirname, '/client/')})
})

client.listen(PORT, ()=>{
    console.log(`Client app running on http://localhost:${PORT}/client`)
})  