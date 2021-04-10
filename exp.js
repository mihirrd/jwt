import bcrypt, { hash } from 'bcrypt'
const saltRounds = 10
const pass = bcrypt.hashSync("mihir", 10)
console.log(pass)