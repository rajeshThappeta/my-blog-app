//create mini-express app
const exp=require('express')
const userApp=exp.Router()
const {createUserOrAuthor,userOrAuthorLogin}=require('./Util')

//define routes
//user creation
userApp.post('/user',createUserOrAuthor)

//user login
userApp.post('/login',userOrAuthorLogin)

//read articles of all authors
userApp.get('/articles',async(req,res)=>{
    const articlesCollection=req.app.get('articlesCollection')
    const articlesList=await articlesCollection.find({status:true}).toArray()
    res.send({message:"articles",payload:articlesList})
})

//write comment
userApp.post('/comment/:articleId',async(req,res)=>{
    const articlesCollection=req.app.get('articlesCollection')
    //get comment
    const userComment=req.body;
    const articleId=(+req.params.articleId);
    console.log(articleId)
    console.log(req.body)
    //insert user comment into cooments array of article doc by id
    await articlesCollection.updateOne({articleId:articleId},
        {$addToSet:{comments:userComment}})
    let comments=await articlesCollection.find({status:true},{comments:1}).toArray()
    res.status(201).send({message:"Comment posted",payload:comments})
})

//export userApp
module.exports=userApp;