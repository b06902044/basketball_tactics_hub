import React , { useEffect , useState } from 'react'
import VideoCard from '../LandingPage/VideoCard';
import axios from 'axios';

function SearchPage() {
    const [videos, setVideos] = useState([]);
    const search = localStorage.getItem('search');

    useEffect(() => {
        axios.post('/api/video/search', {search: search} ).then(res => {
            console.log(res.data);
            if(res.data.success){
              console.log("success");
              setVideos(res.data.videos);
            }
            else{
              alert('Failed to search');
            }
        })
    }, [search])

    return (
        <div className = "container my-3">
            <h2 className = "display1 mt-5 mb-3"> {videos.length > 0? "Search Videos" : "Video Not Found"} </h2>
            <hr className = "mb-3"/>
            <div className = "row">
                {videos.map((video, idx) => {
                    return <VideoCard video = {video} key = {idx}/>
                })}
            </div>
        </div>
    )
}

export default SearchPage;