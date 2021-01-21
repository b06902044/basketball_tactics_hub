import axios from 'axios'
import React, { useEffect , useState } from 'react'
import VideoCard from './VideoCard';

function LandingPage() {
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        axios.get('/api/video/getVideos').then(res => {
            if(res.data.success){
                console.log(res.data); 
                setVideos(res.data.videos);
            }
            else{
                alert('Failed to get videos');
            }
        })
    }, [])

    return (
        <div className = "container my-3">
            <h2 className = "display1 mt-5 mb-3"> Recommended </h2>
            <hr className = "mb-3"/>
            <div className = "row">
                {videos.map((video, idx) => {
                    console.log("video", video);
                    return <VideoCard video = {video} key = {idx}/>
                })}
            </div>
        </div>
    )
}

export default LandingPage
