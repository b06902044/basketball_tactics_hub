import React from 'react';
import moment from 'moment';

function VideoCard({video}) {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
        <div className = "col-lg-4 col-md-6 col-sm-12">
            <div className = "card" style = {{border: "none"}}>
                <a href = {`/video/${video._id}`}>
                    <div style={{ position: 'relative' }}>
                        <img class="card-img-top img-fluid" src = {`http://localhost:5000/${video.thumbnail}`} alt = "img" />
                        <div className=" duration"
                            style={{ bottom: 0, right: 0, position: 'absolute', margin: '4px', 
                            color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8, 
                            padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                            fontWeight:'bolder', lineHeight:'12px' }}>
                            <span>{minutes}:{seconds}</span>
                        </div>
                    </div>
                </a>
                <div className = "card-block d-flex">
                    <a href = {`/user/${video.writer._id}`} className = "mt-3" style = {{width: "40px", height: "40px"}}>
                        <img className = "img-fluid maxwidth"  style = {{width: "100%", height: "100%",borderRadius: "50%"}} src={video.writer.image} alt = "img"/>
                    </a>
                    <div className = "ml-3 mt-2">
                        <h4 className = "card-title"> {video.title} </h4>
                        <h6 className = "font-weight-lighter">{video.writer.name} </h6>
                        <span className = "font-weight-lighter"> views : {video.views}</span><br />
                        <span className = "font-weight-lighter"> {moment(video.createdAt).format("YYYY-MM-DD")} </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard;

