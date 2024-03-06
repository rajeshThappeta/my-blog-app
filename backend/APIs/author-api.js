const exp = require("express");
const authorApp = exp.Router();
const { createUserOrAuthor, userOrAuthorLogin } = require("./Util");
const ObjectID = require("mongodb").ObjectId;
const objid=new ObjectID()
let authorsCollection;
let articlesCollection;
//get collection objects from express app
authorApp.use((req, res, next) => {
  authorsCollection = req.app.get("authorsCollection");
  articlesCollection = req.app.get("articlesCollection");
  next();
});

//define routes
authorApp.post("/user", createUserOrAuthor);
//author login
authorApp.post("/login", userOrAuthorLogin);

//create article
authorApp.post("/new-article", async (req, res) => {
  //get new article from author
  const newAtricle = req.body;
  //console.log(newAtricle)
  //check author identity
  let dbAuthor = await authorsCollection.findOne({
    username: newAtricle.username,
  });
  //if author not found
  if (dbAuthor === null) {
    res.send({ message: "Invalid Author name" });
  } else {
    await articlesCollection.insertOne(newAtricle);
    res.status(201).send({ message: "New article added" });
  }
});

//read articles of author
authorApp.get("/articles/:author", async (req, res) => {
  //get author's username from url
  let authorUsername = req.params.author;
 // console.log(authorUsername);
  //get articles of this author
  let articlesList = await articlesCollection
    .find({ username: authorUsername })
    .toArray();
   // console.log(articlesList)
  res.send({ message: "articles", payload: articlesList });
});

//update article by author
authorApp.put("/article", async (req, res) => {
  let modifiedArticle = req.body;
   //console.log(modifiedArticle)
  let updatedDocument=await articlesCollection.findOneAndUpdate({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}},{returnDocument: "after"})
 // console.log(updatedDocument)
  res.send({message:"article modified",payload:updatedDocument});
});

//delete article(soft delete)
authorApp.put('/article/:articleId',async(req,res)=>{
  let articleObj=req.body;
  console.log(articleObj)
  console.log(req.params.articleId)
  if(articleObj.status===true){
  let r=await articlesCollection.updateOne({articleId:(+req.params.articleId)},{$set:{status:false}})
  console.log("r",r)
   res.send({message:"article removed"})
  }else{
    let r1=await articlesCollection.updateOne({articleId:(+req.params.articleId)},{$set:{status:true}})
    console.log("r1",r1)
     res.send({message:"article restored"})
  }
 
})
//export userApp
module.exports = authorApp;
