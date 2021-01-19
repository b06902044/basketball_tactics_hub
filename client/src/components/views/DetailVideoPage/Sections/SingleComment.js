import React , { useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import LikeDislikes from './LikeDislikes';

function SingleComment({ comment , refreshComments , postId }) {
    const user = useSelector(state => state.user)
    const [commentValue, setCommentValue] = useState("");
    const [openReply, setOpenReply] = useState(false);

    const handleChange = e => {
        console.log(e.currentTarget.value);
        setCommentValue(e.currentTarget.value);
    }

    const handleOpenReply = () => {
        setOpenReply(!openReply);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const tmp = {
            content: commentValue,
            writer: user.userData._id,
            postId: postId,
            responseTo: comment._id
        }

        axios.post('/api/comment/saveComment', tmp).then(res => {
            if(res.data.success){
                setCommentValue("");
                setOpenReply(!openReply);
                refreshComments(res.data.result);
            }
            else{
                alert('Failed to save comment');
            }
        })
    }

    return (
            <div>
                <div className = "row mb-4 mt-4">
                    <div className = "col-1">
                        <a href = {`/user/${comment.writer._id}`}>
                            <img src = {comment.writer.image} className = "img-fluid" style = {{borderRadius: "50%", width: "3rem", height: "3rem"}} alt = "img"/>
                        </a> 
                    </div>
                    <div className = "col-11 d-flex flex-column"> 
                        <span style = {{color: "gray", fontSize: "1.3rem" , marginBottom: "-1.5rem"}}>{comment.writer.name}</span><br/>
                        <span style = {{color: "#404040", fontSize: "1.5rem", marginBottom: "-1rem"}}>{comment.content}</span> <br />
                        <div className = "d-flex" style = {{marginBottom: "-1rem"}}>
                            <LikeDislikes comment commentId = {comment._id} userId = {localStorage.getItem('userId')} size = "1rem" mar = "mr-2"/>
                            <span className = "align-self-center" onClick = {handleOpenReply}>reply to</span>
                        </div> 
                    </div>
                </div>
                {openReply && 
                <form onSubmit = {onSubmit}>
                    <div className = "input-group">
                        <input type="text" className = "form-control" value = {commentValue} placeholder="write some comments" onChange = {handleChange} aria-label="Recipient's username" aria-describedby="button-addon2" />
                        <div className = "input-group-append">
                            <button className = "btn btn-primary" type="submit" id="button-addon2">Submit</button>
                        </div>
                    </div>
                </form>
                }           
            </div>
    )
}

export default SingleComment
