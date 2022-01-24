import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {getCurrentProfile, deleteAccount} from "../../actions/profile";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({getCurrentProfile, auth: {user}, profile: {profile, loading}, deleteAccount}) => {
    useEffect(()=>{
        getCurrentProfile();
    }, [])

  return(
      loading && profile === null ?<Spinner/> :
      <Fragment>
          <h1 className='large text-primary'>Dashboard</h1>
          <p className='lead'>
              <i className='fas fa-user'>Welcome {user && user.name}</i>
          </p>
          {profile !== null ?
              <Fragment>
                  <DashboardActions/>
                  <Experience experience={profile.experience}/>
                  <Education education={profile.education}/>

              </Fragment>
              :
              <Fragment>
                  <p>You didnt setup your profile, please consider to do so.</p>
                  <Link className='btn btn-primary my-1' to='/create-profile' >Create profile</Link>
              </Fragment>
          }
          <div className='my-2'>
              <button className='btn btn-danger' onClick={()=>deleteAccount()}>
                  <i className='fas fa-user-minus'>Delete My Account</i>
              </button>
          </div>
      </Fragment>
  )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = state =>({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard);