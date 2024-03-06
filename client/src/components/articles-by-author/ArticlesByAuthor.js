import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ArticlesByAuthor.css";
import { useNavigate, redirect, Outlet } from "react-router-dom";
import { FcClock } from "react-icons/fc";
import { BsArrowRightCircle } from "react-icons/bs";

function ArticlesByAuthor() {
  const [articlesList, setArticlesList] = useState([]);
  let navigate = useNavigate();
  let { currentUser } = useSelector(
    (state) => state.userAuthoruserAuthorLoginReducer
  );
  async function getArticlesOfcurrentAuthor() {
    const res = await axios.get(
      `http://localhost:4000/author-api/articles/${currentUser.username}`
    );

    setArticlesList(res.data.payload);
  }

  useEffect(() => {
    getArticlesOfcurrentAuthor();
  }, []);

  //navigate to Article page
  const gotoArticleView = (articleObj) => {
   
    navigate(`../article/${articleObj.articleId}`,{state:articleObj});
  };

  return (
    <div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {articlesList.map((article) => (
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
                  <span>Read More<BsArrowRightCircle /></span>
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
      <Outlet />
    </div>
  );
}

export default ArticlesByAuthor;
