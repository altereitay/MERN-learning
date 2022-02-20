import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import auth from "../../reducers/auth";
import { deleteComment } from "../../actions/post";

const CommentItem = ({comment: {_id, text, name, avatar, user, date}, postID, deleteComment, auth}) => {
    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img className="round-img" src={avatar} alt=""/>
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">{text}</p>
                <p className="post-date">Posted on <Moment format='DD/MM/YYYY'>{date}</Moment></p>
                {!auth.loading && user === auth.user._id && (
                    <button onClick={() => deleteComment(postID, _id)} type='button' className='btn btn-danger'>
                        <i className='fas fa-times'/>
                    </button>
                )}
            </div>
        </div>
    )
}

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    postID: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired

}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {deleteComment})(CommentItem);