import express from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'

const authserver = express()
authserver.use(express.json())

const PORT = 4000 
const __dirname = path.resolve()
const posts = [
    {
        id : 1,
        username : "mihir"
    },
    {
        id : 2,
        username : "apoorv"
    },
    {
        id : 3,
        username : "shardul"
    }
]

authserver.get('/posts',(req,res) =>{
    res.sendFile('index.html', {root : path.join(__dirname, '/server/')})
})

authserver.get('/callback',authenticateuser, (req,res)=>{
    res.send("User who logged in :", req.user.username)
})
authserver.post('/login',(req,res)=>{
    const username = req.body.username
    const user = {username : username}
    const accesstoken = generatetoken(user)
    res.json({accesstoken : accesstoken})
})
function generatetoken(user){
    return jwt.sign(user, "secretKey",{expiresIn : "5m"})
}
function authenticateuser(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, "secretKey", (err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

authserver.listen(PORT, ()=>{
    console.log(`Authentication server running on http://localhost:${PORT}`)
})