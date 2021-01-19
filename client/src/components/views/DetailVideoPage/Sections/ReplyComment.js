import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment({ commentList , postId , refreshComments , parentCommentId }) {

    const [childCommentNumber, setChildCommentNumber] = useState(0);
    const [openReply, setOpenReply] = useState(false);


    useEffect(() => {
        let commentNumber = commentList.filter(comment => {
            return comment.responseTo === parentCommentId;
        }).length;
        setChildCommentNumber(commentNumber);
        console.log("number", childCommentNumber);
    }, [commentList, parentCommentId])

    const handelOpenReply = () => {
        setOpenReply(!openReply);
    }


    return (
        <div className = "ml-5">
            {childCommentNumber > 0 && 
            <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick = {handelOpenReply}> View {childCommentNumber} more comment(s)</p>
            }

            {openReply && commentList.map((comment, idx) => {
                return (
                    <React.Fragment >
                        {comment.responseTo === parentCommentId && 
                        <div >
                            {
                            <SingleComment comment = {comment} postId = {postId} refreshComments = {refreshComments} key = {idx}/>
                            }
                            <ReplyComment commentList = {commentList} postId = {postId} refreshComments = {refreshComments} parentCommentId = {comment._id}/>
                        </div>}
                    </React.Fragment>
                    
                );
            })}
        </div>
    )
}

export default ReplyComment
