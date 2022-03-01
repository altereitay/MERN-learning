import React, { useState } from "react";
import { Segment, TransitionablePortal } from "semantic-ui-react";
import PropTypes from "prop-types";

const EditExperience = ({exp}) =>{
    const [open, setOpen] = useState(false);
    const [formData, setDormData] = useState({
        company: exp.company,
        title: exp.title,
        location: exp.location,
        from: exp.from,
        to: exp.to,
        current: exp.current,
        description: exp.description
    });
    const { company,
        title,
        location,
        from,
        to,
        current,
        description} = formData;
    const temp = from.split('T')[0];
    console.log(temp)
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
            trigger={<button className='btn btn-light'>Edit Experience</button>}>
            <Segment  style={{ left: '40%', position: 'fixed', top: '20%', zIndex: 1000, background:'lightblue' }}>
                <h4>Edit An Experience</h4>
                <small>* = required field</small>
                <form className="form" onSubmit={e => {
                    e.preventDefault();
                    //addExperience(formData);
                }}>
                    <div className="form-group">
                        <input type="text" placeholder="* Job Title" name="title" value={title}
                               onChange={e => onChange(e)} required/>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="* Company" name="company" value={company}
                               onChange={e => onChange(e)} required/>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Location" name="location" value={location}
                               onChange={e => onChange(e)}/>
                    </div>
                    <div className="form-group">
                        <h5>From Date</h5>
                        <input type="date" name="from" value={temp} onChange={e => onChange(e)}/>
                    </div>
                    <div className="form-group">
                        <p><input type="checkbox" name="current" checked={current} value={current}
                                  onChange={e => {
                                      setDormData({...formData, current: !current});
                                      toggleDisabled(!toDateDisabled);
                                  }}/> {' '}Current Job</p>
                    </div>
                    <div className="form-group">
                        <h6>To Date</h6>
                        <input type="date" name="to" value={to} onChange={e => onChange(e)}
                               disabled={toDateDisabled ? 'disabled' : ''}/>
                    </div>
                    <div className="form-group">
          <textarea
              name="description"
              cols="5"
              rows="5"
              placeholder="Job Description"
              value={description} onChange={e => onChange(e)}/>
                    </div>
                    <input type="submit" className="btn btn-primary my-1"/>
                </form>
            </Segment>
        </TransitionablePortal>
    )
}

EditExperience.propTypes = {
    exp: PropTypes.object.isRequired
}

export default EditExperience;