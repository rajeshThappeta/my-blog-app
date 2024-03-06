import "./Articles.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios'
import {Outlet, useNavigate} from 'react-router-dom'
import { FcClock } from "react-icons/fc";
import { BsArrowRightCircle } from "react-icons/bs";

function Articles() {
 
  let { currentUser } = useSelector(
    (state) => state.userAuthoruserAuthorLoginReducer
  );
  let navigate=useNavigate()
  //navigate to Article page
  const gotoArticleView = (articleObj) => {
    navigate(`../article/${articleObj.articleId}`, { state: articleObj });
  };

  let [articles,setArticles]=useState([])

  const getAllArticlesOfAllAuthors=async()=>{
   let res= await axios.get('http://localhost:4000/user-api/articles')
    setArticles(res.data.payload)
  }
  useEffect(()=>{
    getAllArticlesOfAllAuthors()
  },[])
    
  console.log(articles)
  return (
   <div>
    <p className="display-3">All Articles</p>
    <div>
     
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {articles.map((article) => (
          <div className="col" key={article.articleId}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.content.substring(0, 80) + "...."}
                </p>
                <button
                  className="custom-btn btn-4"
                  onClick={() => gotoArticleView(article)}
                >
                  <span>Read More <BsArrowRightCircle /></span>
                </button>
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">
                <FcClock  className="fs-4 me-2"/>Last updated on {article.dateOfModification}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
   
   </div>
  );
}

export default Articles;
