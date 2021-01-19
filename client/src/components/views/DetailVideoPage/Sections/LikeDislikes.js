import React , { useEffect , useState } from 'react'
import { AiTwotoneLike , AiTwotoneDislike , AiOutlineLike , AiOutlineDislike } from 'react-icons/ai';
import axios from 'axios';

function LikeDislikes(props) {

    const [likesNumber, setLikesNumber] = useState(0);
    const [dislikesNumber, setDislikesNumber] = useState(0);
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    let variable = {};

    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        axios.post('/api/like/getLikes', variable).then(res => {
                console.log('getLikes',res.data);
                if (res.data.success) {
                    setLikesNumber(res.data.likesNumber);
                    setLike(res.data.likes);
                } 
                else {
                    alert('Failed to get likes')
                }
        })

        axios.post('/api/like/getDislikes', variable).then(res => {
            console.log('getDislikes',res.data);
            if (res.data.success) {
                setDislikesNumber(res.data.dislikesNumber);
                setDislike(res.data.dislikes);
            } 
            else {
                alert('Failed to get dislikes');
            }
        })

    } , [props])

    const onLike = () => {
            axios.post('/api/like/upLike', variable).then(res => {
                    if (res.data.success) {

                        setLikesNumber(likesNumber + 1);
                        setLike(true);

                        //If dislike button is already clicked
                        if (dislike) {
                            setDislike(false);
                            setDislikesNumber(dislikesNumber - 1);
                        }
                    } 
                    else {
                        alert('Failed to increase the like')
                    }
            })
    }

    const clearLike = () => {
        axios.post('/api/like/unLike', variable).then(res => {
                    if (res.data.success) {
                        setLikesNumber(likesNumber - 1);
                        setLike(false);
                    } 
                    else {
                        alert('Failed to decrease the like')
                    }
        })
    }

    const onDislike = () => {
            axios.post('/api/like/upDisLike', variable).then(res => {
                    if (res.data.success) {
                        setDislikesNumber(dislikesNumber + 1);
                        setDislike(true);

                        //If dislike button is already clicked
                        if(like) {
                            setLike(false);
                            setLikesNumber(likesNumber - 1);
                        }
                    }
                    else {
                        alert('Failed to increase dislike')
                    }
            })
    }

    const clearDislike = () => {
            axios.post('/api/like/unDisLike', variable).then(res => {
                    if (res.data.success) {
                        setDislikesNumber(dislikesNumber - 1);
                        setDislike(false);
                    } 
                    else {
                        alert('Failed to decrease dislike')
                    }
            })
    }

    return (
        <div className = "d-flex">
                {like ? <AiTwotoneLike onClick = {clearLike} className = "align-self-start" style = {{width: props.size, height: props.size}}/>
                      : <AiOutlineLike onClick = {onLike} className = "align-self-start" style = {{width: props.size, height: props.size}}/>}
                <span className = {`align-self-start ${props.mar}`} style={{ paddingLeft: '8px', cursor: 'auto' }}>{likesNumber}</span>
                {dislike ? <AiTwotoneDislike onClick = {clearDislike} className = "align-self-start" style = {{width: props.size, height: props.size}}/>
                         : <AiOutlineDislike onClick = {onDislike} className = "align-self-start" style = {{width: props.size, height: props.size}}/>}
                <span className = {`align-self-start ${props.mar}`} style={{ paddingLeft: '8px', cursor: 'auto' }}>{dislikesNumber}</span>
        </div>
    )
}

export default LikeDislikes
