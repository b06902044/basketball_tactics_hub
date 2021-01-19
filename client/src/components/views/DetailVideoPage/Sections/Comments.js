import Axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ReplyComment from './ReplyComment';
import SingleComment from './SingleComment';

function Comments({ postId , handleComments , commentList }) {
    const [comment, setComment] = useState("");
    const user = useSelector(state => state.user);

    const handleChange = e => {
        console.log(e.currentTarget.value);
        setComment(e.currentTarget.value);
    }

    const onSubmit = e => {
        e.preventDefault();

        const tmp = {
            content: comment,
            writer: user.userData._id,
            postId: postId
        }

        Axios.post('/api/comment/saveComment', tmp).then(res => {
            if(res.data.success){
                setComment("");
                handleComments(res.data.result);
            }
            else{
                alert('Failed to save comment');
            }
        })
    }

    return (
        <div>
            <p> replies </p>
            <hr />

            {commentList.map((comment, idx) => {
                return (!comment.responseTo && 
                    <React.Fragment>
                        <SingleComment comment = {comment} postId = {postId} refreshComments = {handleComments} key = {idx}/>
                        {
                        <ReplyComment commentList = {commentList} postId = {postId} refreshComments = {handleComments} parentCommentId = {comment._id}/>
                        }
                    </React.Fragment>
                );
            })}

            <form onSubmit = {onSubmit}>
                <div className = "input-group">
                    <input type="text" className = "form-control" value = {comment} placeholder="write some comments" onChange = {handleChange} aria-label="Recipient's username" aria-describedby="button-addon2" />
                    <div className = "input-group-append">
                        <button className = "btn btn-primary" type="submit" id="button-addon2" style = {{width: "100%"}}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Comments
