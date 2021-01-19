import React, { useEffect , useState } from 'react'
import SideVideoCard from './SideVideoCard';
import axios from 'axios';

function SideVideo({ videoId }) {

    const [sideVideos, setSideVideos] = useState([]);

    useEffect(() => {
        axios.get('/api/video/getVideos').then(res => {
            if(res.data.success){
                console.log(res.data); 
                setSideVideos(res.data.videos);
            }
            else{
                alert('Failed to get videos');
            }
        })
    }, [videoId])

    return (
        <div className = "col-lg-3 col-12 ">
            <div className = "row">
                {sideVideos.filter(video => {
                    return video._id != videoId;
                }).map((video, idx) => {
                    return <SideVideoCard video = {video} key = {idx} />
                })}
            </div>
        </div>
    )
}

export default SideVideo
