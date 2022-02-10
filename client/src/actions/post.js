import axios from "axios";
import { setAlert} from "./alert";
import { DELETE_POST, GET_POSTS, POST_ERROR, SET_ALERT, UPDATED_LIKES } from "./types";

//get posts
export const getPosts = () => async dispatch =>{
    try {
        const res = await axios.get('/api/posts');
        dispatch({type: GET_POSTS, payload: res.data})
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}

//add Like
export const addLike = (postId) => async dispatch =>{
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch({type: UPDATED_LIKES, payload: {id: postId, likes: res.data}})
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}

//remove like
export const removeLike = (postId) => async dispatch =>{
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({type: UPDATED_LIKES, payload: {id: postId, likes: res.data}})
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}

//delete post
export const deletePost = (postId) => async dispatch =>{
    try {
        await axios.delete(`/api/posts/${postId}`);
        dispatch({type: DELETE_POST, payload: {id: postId}})
        dispatch(SET_ALERT('Post removed', 'success'))
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}