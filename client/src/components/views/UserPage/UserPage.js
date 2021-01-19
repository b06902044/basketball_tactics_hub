import React , { useEffect , useState } from 'react'
import VideoCard from '../LandingPage/VideoCard';
import axios from 'axios';

function SubscriptionPage(props) {
    const userId = props.match.params.userId;
    const [videos, setVideos] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        axios.post('/api/users/userGetVideos', {userId: userId}).then(res => {
            if(res.data.success){
                console.log(res.data); 
                setVideos(res.data.videos);
                setUserName(res.data.name);
            }
            else{
                alert('Failed to get user videos');
            }
        })
    })

    return (
        <div className = "container my-3">
            <h2 className = "display1 mt-5 mb-3"> {userName} </h2>
            <hr className = "mb-3"/>
            <div className = "row">
                {videos.map((video, idx) => {
                    return <VideoCard video = {video} key = {idx}/>
                })}
            </div>
        </div>
    )
}

export default SubscriptionPage