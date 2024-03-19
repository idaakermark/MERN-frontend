import { ActionFunctionArgs, Form, redirect } from 'react-router-dom'
import { Comment } from '../types'
import classes from './Comment.module.css'
import auth from '../lib/auth'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { postid } = params 
  const formData = await request.formData()
  const commentid = formData.get('commentid')
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postid}/comments/${commentid}`, {
      headers: {Authorization: 'Bearer ' + auth.getJWT()}, 
      method: 'DELETE'
    })
    if (!response.ok) {
      const{message} = await response.json() 
      throw new Error(message)
    }

    return redirect('/posts/' + postid)

  } catch (error) {
    console.log(error)
  }
}

const CommentComponent = ({comment, postid}: {comment: Comment, postid: string}) => {
  return (
    <div className={classes.comment}>
      <p className={classes.commentAuthor}>{comment.author.userName}</p>
      <p>{comment.body}</p>
      <Form method='delete' action={`/posts/${postid}/comments/${comment._id}`}>
        <input type='hidden' value={comment._id} name='commentid'></input>
        <button>Delete</button>
      </Form>
    </div>
  )
}

export default CommentComponent;