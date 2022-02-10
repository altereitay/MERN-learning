import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {getPosts} from "../../actions/post";
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";

const Posts = ({getPosts, post:{ posts, loading}}) => {
  useEffect(()=>{
    getPosts();
  }, [getPosts]);
    return(
      loading? <Spinner/>:
          <Fragment>
            <h1 className='large text-primary'>Posts</h1>
            <p className='lead'>
              <i className='fas fa-user'/>Welcome to the community
            </p>
            {/*PostForm*/}
              {console.log('posts', typeof(posts[0]), Array.isArray(posts[0].likes), posts[0].likes)}
            {posts.map(post=>(
              <PostItem key={post._id} post={post}/>
            ))}
          </Fragment>
  )
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  post: state.post
})

export default connect(mapStateToProps, {getPosts})(Posts);