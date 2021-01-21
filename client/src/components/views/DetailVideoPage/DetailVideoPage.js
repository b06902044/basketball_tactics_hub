import React, { useEffect , useState } from 'react'
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import moment from 'moment';
import Comments from './Sections/Comments';
import LikeDislikes from './Sections/LikeDislikes';

function DetailVideoPage(props) {

    const videoId = props.match.params.videoId;
    const [video, setVideo] = useState([]);
    const [subscribe, setSubscribe] = useState(0);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        console.log(videoId);
        axios.post('/api/video/getVideo', {videoId}).then(res => {
            if(res.data.success){
                console.log(res.data);
                setVideo(res.data.video);
            }
            else{
                alert('Failed to get video');
            }
        })
        axios.post('/api/comment/getComments', {videoId}).then(res => {
            if(res.data.success){
                console.log(res.data);
                setComments(res.data.comments);
            }
            else{
                alert('Failed to get comments');
            }
        })
    }, []);

    const  handleSubscribeNumber = number => {
        setSubscribe(number);
    }

    const handleComments = (newComment) => {
        setComments(comments.concat(newComment));
    }

    if(video.writer){
        return (
            <div className = "container-fluid mt-5 mx-3">
                <div className = "row">
                    <div className="postPage col-lg-9 col-12 mb-3">
                        <video style={{ width: '100%' }} src={`http://140.112.244.57:4000/${video.filePath}`} controls></video>
                        <div className = "my-3" style={{ width: '100%' }}>
                            <h4>{video.title}</h4>
                            <div className = "d-flex justify-content-between">
                                <p>{moment(video.createdAt).format("YYYY-MM-DD")}</p>
                                <LikeDislikes video videoId = {videoId} userId = {localStorage.getItem('userId')} size = "1.5rem" mar = "mr-3"/>
                            </div>
                            <hr />
                        </div> 
                        <div className = "row mt-3 mb-5">
                            <div className = "col-2 col-sm-1">
                                <a href = {`/user/${video.writer._id}`}>
                                <img src = {video.writer && video.writer.image} className = "img-fluid" style = {{borderRadius: "50%"}} alt = "img"/>
                                </a>
                            </div>
                            <div className = "col-6 col-sm-7"> 
                                <h5>{video.writer.name}</h5>
                                <p>訂閱人數 : {subscribe}</p>  
                                <p >{video.description}</p>
                            </div>
                            <div className = "col-4 col-md-3 offset-md-1">
                                <Subscribe videoWriter = {video.writer._id} handleSubscribeNumber = {handleSubscribeNumber}/>
                            </div>
                        </div>
                        <Comments commentList = {comments} postId = {videoId} handleComments = {handleComments}/>
                    </div>
                    <SideVideo videoId = {videoId} />
                </div>
            </div>  
        )
    }
    else    return <div>Loading ... </div>
}

export default DetailVideoPage
