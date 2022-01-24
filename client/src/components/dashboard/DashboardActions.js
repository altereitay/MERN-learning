import React, { useEffect } from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getCurrentProfile} from "../../actions/profile";

const DashboardActions = ({profile: {profile: {education, experience}}}) => {
    useEffect(()=>{
        getCurrentProfile();
    }, []);
    let eduStatus, expStatus;
    if (education.length === 0 || true){
        eduStatus = (
        <Link to="/add-education" className="btn btn-light">
            <i className="fas fa-graduation-cap text-primary"/> Add Education
        </Link>
        )
    }else{
         eduStatus = (
            <Link to="/edit-education" className="btn btn-light">
                <i className="fas fa-graduation-cap text-primary"/> Edit Education
            </Link>
        )}
    if ( true || experience.length === 0){
        expStatus = (
            <Link to="/add-experience" className="btn btn-light">
                <i className="fas fa-graduation-cap text-primary"/> Add Experience
            </Link>
    )
    }else{
         expStatus = (
            <Link to="/edit-experience" className="btn btn-light">
                <i className="fas fa-graduation-cap text-primary"/> Edit Experience
            </Link>
    )}
    return(
        <div className="dash-buttons">
            <Link to="/edit-profile" className="btn btn-light">
                <i className="fas fa-user-circle text-primary"/> Edit Profile
            </Link>
            {expStatus}
            {eduStatus}
        </div>
    )
}
DashboardActions.propTypes = {
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(DashboardActions);