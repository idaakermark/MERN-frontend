import { ActionFunctionArgs, Form, redirect, useLoaderData } from "react-router-dom"
import classes from './CreatePost.module.css'
import { Post } from "../types"
import auth from "../lib/auth"

export const action = async (args: ActionFunctionArgs) => {
    const formData = await args.request.formData()
    const { id } = args.params 
    try {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + id + '/edit', {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.getJWT()
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
    }) 
    console.log(response)
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

const EditPost = () => {
    const post = useLoaderData() as Post | null
    if (!post) return <p>cant find post</p>
    return (
        <Form method="put">

        <div className={classes.formGroup}>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" required defaultValue={post.title} />
        </div>
        <div className={classes.formGroup}>
            <label htmlFor="link">Link (optional)</label>
            <input type="text" name="link" id="link" defaultValue={post.link}/>
        </div>
        <div className={classes.formGroup}>
            <label htmlFor="body">Body (optional)</label>
            <textarea name="body" id="body" defaultValue={post.body}/>
        </div>
        <div>
            <button type="submit">Edit Post</button>
        </div>
    </Form>
    )
}

export default EditPost