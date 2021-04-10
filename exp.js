import bcrypt, { hash } from 'bcrypt'
const saltRounds = 10
const pass = bcrypt.hashSync("deshpande", 10)
console.log(pass)