import axios from "axios";
import { setAlert} from "./alert";
import {
    ADD_COMMENT,
    ADD_POST,
    DELETE_POST,
    GET_POST,
    GET_POSTS,
    POST_ERROR,
    REMOVE_COMMENT,
    SET_ALERT,
    UPDATED_LIKES
} from "./types";

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
export const deletePost = (id) => async dispatch =>{
    try {
        await axios.delete(`/api/posts/${id}`);
        dispatch({type: DELETE_POST, payload: id})
        dispatch(setAlert('Post removed', 'success'))
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}

//add post
export const addPost = (formData) => async dispatch =>{
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post('/api/posts', formData, config);
        console.log('add post')
        dispatch({type: ADD_POST, payload: res.data})
        dispatch(setAlert('Post created', 'success'))
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}

//get post
export const getPost = (id) => async dispatch =>{
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({type: GET_POST, payload: res.data})
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}

//add comment
export const addComment = (postID, formData) => async dispatch =>{
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postID}`, formData, config);
        console.log('add post')
        dispatch({type: ADD_COMMENT, payload: res.data})
        dispatch(setAlert('Comment added', 'success'))
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}

//delete comment
export const deleteComment = (postID, commentID) => async dispatch =>{
    try {
        await axios.delete(`/api/posts/comment/${postID}/${commentID}`);
        dispatch({type: REMOVE_COMMENT, payload: commentID})
        dispatch(setAlert('Comment removed', 'success'))
    }catch (err) {
        dispatch({type: POST_ERROR, payload:{msg: err.response.statusText, status: err.response.status}})
    }
}