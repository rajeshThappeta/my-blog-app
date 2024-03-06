//create express app
const exp=require('express');
const app=exp();
const path=require('path')
const cors=require('cors')
require('dotenv').config() 

app.use(exp.static(path.join(__dirname,'../client/build')))
//connet react build
//app.use(exp.static(path.join(__dirname,'../client/build')))
//add body parser middleware
app.use(exp.json())
//app.use(exp.urlencoded({extended:true}))

app.use(cors({
    "origin": "my-blog-app-frontend.vercel.app",
    "methods": ["GET","HEAD","PUT","PATCH","POST","DELETE"],
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }))

const mongoClient=require('mongodb').MongoClient;

//connect tp mongodb server
mongoClient.connect(process.env.MONGO_ATLAS_DBURL)
.then(client=>{
    //get database object
    const blogDBobj=client.db('myblogdb')
    //create collection objects
    const usersCollection=blogDBobj.collection('users')
    const authorsCollection=blogDBobj.collection('authors')
    const articlesCollection=blogDBobj.collection('articles')
    //share collection objs with APIs
    app.set('usersCollection',usersCollection)
    app.set('authorsCollection',authorsCollection)
    app.set('articlesCollection',articlesCollection)
    console.log("DB connection success")
})
.catch(err=>{
    console.log("Err in DB connect",err)
})

//import apis
const userApp=require('./APIs/user-api')
const authorApp=require('./APIs/author-api')
const adminApp=require('./APIs/admin-api')

//handover req to specific route based on starting of path
app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)

//refrsh
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})

//error handling middeware
app.use((err,req,res,next)=>{
    res.send({status:"error",message:err.message})
})

//get port number from env
//const port=process.env.PORT || 4000;
const port=4000;
//assign port number to http server
app.listen(port,()=>console.log(`http server on port ${port}`))