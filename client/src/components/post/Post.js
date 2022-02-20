import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getPost } from "../../actions/post";
import { Link, useParams } from "react-router-dom";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = ({getPost, post: {post, loading}}) => {
    const {id} = useParams();
    useEffect(() => {
        getPost(id);
    }, [getPost, id])
    return (
        loading || post === null ? <Spinner/> :
            <Fragment>
                <Link to='/posts' className='btn'>
                    Back to posts
                </Link>
                <PostItem post={post} showActions={false}/>
                <CommentForm postID={post._id}/>
                <div className='comments'>
                    {post.comments.map(comment=> (
                        <CommentItem comment={comment} postID={post._id} key={comment._id}/>
                        )
                    )}
                </div>
            </Fragment>
    )

}

Post.propTypes = {
    getPost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPost})(Post);