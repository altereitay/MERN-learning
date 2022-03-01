import React, { Fragment} from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteEducation,  } from "../../actions/profile";
import {connect} from "react-redux";
import EditEducation from "../profile-forms/EditEducation";

const Education = ({education, deleteEducation}) =>{
    const educations = education.map(edu =>(
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className='hide-sm'>{edu.degree}</td>
            <td>
                <Moment format='DD/MM/YYYY'>{edu.from}</Moment> - {
                edu.current || edu.to === undefined? ('Current') : (<Moment format='DD/MM/YYYY'>{edu.to}</Moment>
                )}
            </td>
            <td>
               <EditEducation edu={edu} />
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