import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import {Button, Header, Segment, TransitionablePortal} from "semantic-ui-react";

const DashboardActions = ({profile: {profile: {education, experience}}}) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);
    let eduStatus, expStatus;
    eduStatus = (
            <Link to="/add-education" className="btn btn-light">
                <i className="fas fa-graduation-cap text-primary"/> Add Education
            </Link>
    )

    expStatus = (
            <Link to="/add-experience" className="btn btn-light">
                <i className="fas fa-graduation-cap text-primary"/> Add Experience
            </Link>
    )
    return (
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

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(DashboardActions);