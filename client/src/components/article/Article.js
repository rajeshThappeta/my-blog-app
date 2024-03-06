import "./Article.css";
import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FcClock } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import { FcComments } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { BiCommentAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdRestore } from "react-icons/md";

function Article() {
  const { state } = useLocation();
  let { currentUser } = useSelector(
    (state) => state.userAuthoruserAuthorLoginReducer
  );
   console.log("state", state);
  let { register, handleSubmit } = useForm();
  let [commentStatus, setCommentStatus] = useState("");
  let [editArticleStatus, setEditArticleStatus] = useState(false);
  let [deleteStatus, setDeleteStatus] = useState(false);
  let navigate = useNavigate();
  //enable edit article
  const enableEdit = () => {
    setEditArticleStatus(true);
  };

  const onSave = async (modifiedArticle) => {
    console.log(modifiedArticle);
    let modifiedArticleWithChanges = { ...state, ...modifiedArticle };
    modifiedArticleWithChanges.dateOfModification = new Date();
    delete modifiedArticleWithChanges._id;
    console.log(modifiedArticleWithChanges);
    let res = await axios.put(
      "http://localhost:4000/author-api/article",
      modifiedArticleWithChanges
    );
    console.log("res", res);
    if (res.data.message === "article modified") {
      setEditArticleStatus((editArticleStatus) => !editArticleStatus);
      navigate(`/author-profile/article/${state.articleId}`, {
        state: res.data.payload,
      });
    }
  };


  useEffect(()=>{
    setDeleteStatus(!state.status)
  },[])
  //convert ISO date to UTC data
  function ISOtoUTC(iso) {
    let date = new Date(iso).getUTCDate();
    let day = new Date(iso).getUTCDay();
    let year = new Date(iso).getUTCFullYear();
    return `${date}/${day}/${year}`;
  }

  const addCommentByUser = async (commentObj) => {
    commentObj.username = currentUser.username;
    console.log(commentObj);
    let res = await axios.post(
      `http://localhost:4000/user-api/comment/${state.articleId}`,
      commentObj
    );
    if (res.status === 201) {
      setCommentStatus(res.data.message);
    }
  };

console.log("is deleted",deleteStatus)
  const deleteArticle=async()=>{
    let artWithoutID={...state}
    delete artWithoutID._id;
    console.log(artWithoutID)
    await axios.put(`http://localhost:4000/author-api/article/${state.articleId}`,artWithoutID)
    setDeleteStatus(true)
  }
  const restoreArticle=async()=>{
    let artWithoutID={...state}
    delete artWithoutID._id;
    await axios.put(`http://localhost:4000/author-api/article/${state.articleId}`,artWithoutID)
  
    setDeleteStatus(false)
  }

  return (
    <div>
      {/* edit form */}
      {editArticleStatus === true ? (
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              defaultValue={state.title}
              {...register("title")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="form-label">
              Select a category
            </label>
            <select
              {...register("category")}
              id="category"
              className="form-select"
              defaultValue={state.category}
            >
              <option value="programming">Programming</option>
              <option value="AI&ML">AI&ML</option>
              <option value="database">Database</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              {...register("content")}
              className="form-control"
              id="content"
              rows="10"
              defaultValue={state.content}
            ></textarea>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="d-flex justify-content-between">
            <div>
              <p className="display-3 me-4">{state.title}</p>
              <span className="py-3">
                <small className=" text-secondary me-4">
                  <FcCalendar className="fs-4" />
                  Created on:{ISOtoUTC(state.dateOfCreation)}
                </small>
                <small className=" text-secondary">
                  <FcClock className="fs-4" />
                  Modified on: {ISOtoUTC(state.dateOfModification)}
                </small>
              </span>
            </div>
            <div>
              {currentUser.userType === "author" && (
                <>
                  {" "}
                  <button className="me-2" onClick={enableEdit}>
                    <CiEdit />
                  </button>
                  {deleteStatus === false  ? (
                    <button className="me-2" onClick={deleteArticle}>
                      <MdDelete />
                    </button>
                  ) : (
                    <button className="me-2" onClick={restoreArticle}>
                      <MdRestore />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="lead mt-3" style={{ whiteSpace: "pre-line" }}>
            {state.content}
          </p>
          {/* user comments */}
          <div>
            <div className="comments my-4">
              {state.comments.length === 0 ? (
                <p className="display-3">No comments yet...</p>
              ) : (
                state.comments.map((commentObj, ind) => {
                  return (
                    <div key={ind} className="bg-light  p-3">
                      <p
                        className="fs-4"
                        style={{
                          color: "dodgerblue",
                          textTransform: "capitalize",
                        }}
                      >
                        <FcPortraitMode className="fs-2 me-2" />
                        {commentObj.username}
                      </p>

                      <p
                        style={{
                          fontFamily: "fantasy",
                          color: "lightseagreen",
                        }}
                        className="ps-4"
                      >
                        <FcComments className="me-2" />
                        {commentObj.comment}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <h2>{commentStatus}</h2>
            {/* write comment by user */}
            {currentUser.userType === "user" && (
              <form onSubmit={handleSubmit(addCommentByUser)}>
                <input
                  type="text"
                  {...register("comment")}
                  className="form-control mb-4 "
                  placeholder="Write comment here...."
                />
                <button type="submit" className="btn btn-success">
                  Add a Comment <BiCommentAdd className="fs-3" />
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Article;
