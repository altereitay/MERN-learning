import axios from "axios";
import {setAlert} from "./alert";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

//get current users profile
export const getCurrentProfile = () => async dispatch =>{
  try {
      const res = await axios.get('/api/profile/me');
      dispatch({
          type: GET_PROFILE,
          payload: res.data
      })
  }catch (err) {
      dispatch({
          type: PROFILE_ERROR,
          payload: {msg: err.response.statusText, status: err.response.status}
      })
  }
}

//create or update profile
export const createProfile = (formData, navigate, edit = false) => async dispatch =>{
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch(setAlert(edit ? 'profile updated' : 'profile created', 'success'));
        if(!edit){
          navigate('/dashboard');
        }
    }catch (err) {
        const errors = err.response.data.errors;
        if (errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//add experience
export const addExperience = (formData, navigate) => async dispatch =>{
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('added experience', 'success'));
        navigate('/dashboard');
    }catch (err) {
        const errors = err.response.data.errors;
        if (errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}
//add education
export const addEducation = (formData, navigate) => async dispatch =>{
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('added education', 'success'));
        navigate('/dashboard');
    }catch (err) {
        const errors = err.response.data.errors;
        if (errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}
