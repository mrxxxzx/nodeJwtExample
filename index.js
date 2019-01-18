/**
 * @file The exapmle of authentication by jwt 
 * @author Terry
 */
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

app.use(verifyToken)

app.post('/api/login',(req,res)=>{
  let user = {
    id:1,
    username: 'Terry',
    email:'terry@mail.com',
    weibo:'weibo.com'
  }
  jwt.sign({user},'secretKey',(err,token)=>{
    res.json({ accessToken:token })
  });
})


app.post('/api/posts',(req,res)=>{
  res.json({
    message:`hello! ${req.userInfo.username}`
    
  })
})


//middleware
function verifyToken(req,res,next){
  let path = req.path;
  let regx = new RegExp("^/api/login");
  if(!regx.test(path)) {
    let bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
      let bearer = bearerHeader.split(' ')
      req.toekn =  bearer[1]
      jwt.verify(bearer[1], 'secretKey',(err,decode)=>{
        if(err){
          console.log(err)
          res.sendStatus(403)
        }else{
          console.log(decode)
          req.userInfo = decode.user
        }
      });  
      next()
    }else{
      //Forbidden
      res.sendStatus(403)
    } 
  }
  next()
}


app.listen(5000,()=>{
  console.log('Server started on port 5000')
})
