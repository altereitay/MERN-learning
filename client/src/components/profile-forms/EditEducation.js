import React, { useEffect, useState } from "react";
import { Segment, TransitionablePortal } from "semantic-ui-react";
import PropTypes from "prop-types";
import {editEducation} from "../../actions/profile";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

const EditEducation = ({edu, editEducation}) =>{
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [formData, setDormData] = useState({
        school: edu.school,
        degree: edu.degree,
        fieldofstudy: edu.fieldofstudy,
        from: edu.from,
        to: edu.to,
        current: edu.current,
        description: edu.description
    });

    const { school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description} = formData;
    const fromDateToShow = from.split('T')[0];
    const toDateToShow = to?.split('T')[0];
    const onChange = e =>{
        setDormData({...formData, [e.target.name]: e.target.value});
    }
    const [toDateDisabled, toggleDisabled] = useState(current);
    return(
        <TransitionablePortal
            closeOnTriggerClick
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            openOnTriggerClick
            trigger={<button className='btn btn-light'>Edit Education</button>}>
            <Segment  style={{ left: '40%', position: 'fixed', top: '20%', zIndex: 1000, background:'lightblue' }}>
                <h4 >Edit an education</h4>
                <small>* = required field</small>
                <form className="form" onSubmit={e=> {
                    e.preventDefault();
                    editEducation(formData, edu._id, navigate);
                }}>
                    <div className="form-group">
                        <input type="text" placeholder="* Diploma" name="degree" value={degree} onChange={e=>onChange(e)} required/>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="* School, Bootcamp or course name" name="school" value={school} onChange={e=>onChange(e)} required/>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Field of Study" name="fieldofstudy" value={fieldofstudy} onChange={e=>onChange(e)}/>
                    </div>
                    <div className="form-group">
                        <h6>From Date</h6>
                        <input type="date" name="from" value={fromDateToShow} onChange={e=>onChange(e)}/>
                    </div>
                    <div className="form-group">
                        <p><input type="checkbox" name="current" checked={current} value={current} onChange={e=>{
                            setDormData({...formData, current: !current});
                            toggleDisabled(!toDateDisabled);
                        }}/> {' '}Currently Studying?</p>
                    </div>
                    <div className="form-group">
                        <h6>To Date</h6>
                        <input type="date" name="to" value={toDateToShow} onChange={e=>onChange(e)} disabled={toDateDisabled ? 'disabled' :''}/>
                    </div>
                    <div className="form-group">
          <textarea
              name="description"
              cols="5"
              rows="5"
              placeholder="Program Description"
              value={description} onChange={e=>onChange(e)}/>
                    </div>
                    <input type="submit" className="btn btn-primary my-1"/>
                </form>
            </Segment>
        </TransitionablePortal>
    )
}

EditEducation.propTypes = {
    edu: PropTypes.object.isRequired,
    editEducation: PropTypes.func.isRequired
}

export default connect(null, {editEducation})(EditEducation);