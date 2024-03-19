import { ActionFunctionArgs, Form, Link, LoaderFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { Post } from "../types";
import classes from "./ShowPost.module.css";
import CommentForm from "../components/CommentForm";
import CommentComponent from "../components/Comment";
import VoteComponent from "../components/Vote";
import auth from "../lib/auth";

export const action = async (args: ActionFunctionArgs) => {
  const { postid } = args.params
  console.log(postid)
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + '/posts/' + postid, 
      {
        headers: {Authorization: 'Bearer ' + auth.getJWT()}, 
        method: 'DELETE'
      }
    )
    if (!response.ok) {
      const { message } = await response.json()
      throw new Error (message)
    }

    return redirect ('/')
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const loader = async (args: LoaderFunctionArgs) => {
  const { id } = args.params;

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/posts/" + id,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const posts = await response.json();

  return posts;
};

const ShowPost = () => {
  const post = useLoaderData() as Post;

  return (
    <>
      <div className={classes.post}>
        <VoteComponent post={post} />
        <div className={classes.postInfo}>
          {post.link ? (
            <Link to={post.link}>
              <h2>
                {post.title}
                <span className={classes.postUrl}>({post.link})</span>
              </h2>
            </Link>
          ) : (
            <h2>{post.title}</h2>
          )}
          <p>by {post.author.userName}</p>
          {post.body && (
            <div className={classes.postBody}>
              <p>{post.body}</p>
            </div>
          )}
              {post.image && (
                <img
                className={classes.postImage}
                src={`${import.meta.env.VITE_BACKEND_URL}/files/${
                  post.image.id
                }`}
                />
                )}
        </div>
          <Form method='delete' action={`/posts/delete/${post._id}`}>
              <button>Delete</button>
          </Form>
          <Link to={`/posts/${post._id}/edit`}>Edit</Link>
      </div>
      <CommentForm postId={post._id} />
      {post.comments?.map((comment) => (
        <CommentComponent key={comment._id} comment={comment} postid={post._id} />
      ))}
    </>
  );
};

export default ShowPost;