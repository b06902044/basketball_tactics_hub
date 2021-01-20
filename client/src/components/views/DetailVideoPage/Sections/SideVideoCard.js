import React from 'react'

function SideVideoCard({ video }) {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
        <div className = "col-12 d-flex mb-5">
            <div style={{ width:'60%', marginRight:'1rem' }}>
                <a href={`/video/${video._id}`}  style={{ color:'gray' }}>
                    <img style={{ width: '100%' }} src={`http://localhost/${video.thumbnail}`} alt="thumbnail" />
                </a>
            </div>

            <div style={{ width:'30%' }}>
                <a href={`/video/${video._id}`} style={{ color:'gray' }}>
                    <span style={{ fontSize: '1rem', color: 'black' }}>{video.title}  </span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views} views</span><br />
                    <span>{minutes}:{seconds}</span><br />
                </a>
            </div>
        </div>
    )
}


export default SideVideoCard
