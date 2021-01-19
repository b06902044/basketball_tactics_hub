import React , { useEffect , useState } from 'react'
import VideoCard from '../LandingPage/VideoCard';
import axios from 'axios';

function SubscriptionPage() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.post('/api/video/getSubscriptionVideos', {user: localStorage.getItem('userId')}).then(res => {
            if(res.data.success){
                console.log(res.data); 
                setVideos(res.data.videos);
            }
            else{
                alert('Failed to get subscription videos');
            }
        })
    })

    return (
        <div className = "container my-3">
            <h2 className = "display1 mt-5 mb-3"> Subscribed Videos </h2>
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
