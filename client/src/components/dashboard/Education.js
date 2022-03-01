import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import {deleteEducation} from "../../actions/profile";
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import { Header, Segment, TransitionablePortal } from "semantic-ui-react";

const Education = ({education, deleteEducation}) =>{
    const [open, setOpen] = useState(false);
    const educations = education.map(edu =>(
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className='hide-sm'>{edu.degree}</td>
            <td>
                <Moment format='DD/MM/YYYY'>{edu.from}</Moment> - {
                edu.to === undefined? ('Current') : (<Moment format='DD/MM/YYYY'>{edu.to}</Moment>
                )}
            </td>
            <td>
                <TransitionablePortal
                    closeOnTriggerClick
                    onOpen={()=>setOpen(true)}
                    onClose={()=>setOpen(false)}
                    openOnTriggerClick
                    trigger={
                        <button className='btn btn-light' >Edit Education</button>
                    }
                >
                    <Segment style={{ left: '40%', position: 'fixed', top: '50%', zIndex: 1000, background: 'coral' }}>
                        <Header>This is an example portal</Header>
                        <p>Portals have tons of great callback functions to hook into.</p>
                        <p>To close, simply click the close button or click away</p>
                    </Segment>
                </TransitionablePortal>
            </td>
            <td>
                <button className='btn btn-danger' onClick={()=>deleteEducation(edu._id)}>Delete</button>
            </td>
        </tr>
    ));
    return(
        <Fragment>
            <h2 className='my-2'>Education credentials</h2>
            <table className='table'>
                <thead>
                <tr>
                    <th>School</th>
                    <th className='hide-sm'>Degree</th>
                    <th className='hide-sm'>Years</th>
                    <th/>
                    <th/>
                </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired
}

export default connect(null, {deleteEducation})(Education);