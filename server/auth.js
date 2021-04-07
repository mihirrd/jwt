import express from 'express'
import jwt from 'jsonwebtoken'
import path from 'path' 

//server created using express
const authserver = express()
//urlencoded for parsing body of requests 
authserver.use(express.urlencoded({
    extended : true
}))

const PORT = 4000 
const __dirname = path.resolve() //essential for sending html files in res.sendFile 
var currenttoken = null //a variable for keeping track of who logged in the latest

//users database 
const users = [
    {
        id : 15435,
        username : "abc",
        age : 22,
    },
    {
        id : 24245,
        username : "xyz",
        age : 28,
    }
]

//login screen
authserver.get('/login',(req,res) =>{
    res.sendFile('index.html', {root : path.join(__dirname, '/server/')})
})

//here 
authserver.post('/callback', (req,res)=>{
    //token is verified weather its valid and not expired
    //the JWT access key is "secretKey" which is directly provided. 
    jwt.verify(currenttoken, "secretKey", (err,user)=>{
        if(err) currenttoken = null
    })
    // if noone is logged in then redirect to login page
    if(currenttoken == null ){
        res.redirect('http://localhost:4000/login')
    }
    else{
        //if someone is already logged in then redirect to /user endpoint
        res.redirect('http://localhost:4000/user')
    }
})

authserver.get('/callback', (req,res)=>{
    //if someone is already logged in then redirect to /user endpoint
        res.redirect('http://localhost:4000/user')
})


//show currently logged in user 
authserver.get('/user',auth,(req,res)=>{
    res.json(users.filter(u=> u.username === req.user.username))
})

//here users will enter the informatin to login
authserver.post('/login',(req,res)=>{
  
    const username = req.body.username
    const age = req.body.age
    const user = {username : username, age: age}
    const accesstoken = generatetoken(user)
    currenttoken = accesstoken
    res.redirect('http://localhost:4000/callback')

})

//jwt token is generated using the information provied in /login endpoint 
function generatetoken(user){
    return jwt.sign(user, "secretKey",{expiresIn : "5m"}) //expiry if set to 5 minutes
}
//function to authenticate the jwt token
function auth(req,res,next){
    jwt.verify(currenttoken, "secretKey", (err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

//hosting the auth server
authserver.listen(PORT, ()=>{
    console.log(`Authentication server running on http://localhost:${PORT}`)
})