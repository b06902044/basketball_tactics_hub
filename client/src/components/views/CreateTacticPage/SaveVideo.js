
import axios from 'axios';
    export const saveVideo = (video, user) => {
        let filePath = "", duration = "", thumbnail = "";
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        console.log(video);
        formData.append('file', video);
        axios.post('/api/video/uploadfiles', formData, config).then(res => {
            console.log(res);

            if(res.data.success){
                filePath = res.data.filePath;
                let tmp = {
                    filePath: res.data.filePath,
                    fileName: res.data.fileName
                }
                axios.post('/api/video/thumbnail', tmp).then(res => {
                    if(res.data.success){
                        duration = res.data.fileDuration;
                        thumbnail = res.data.thumbFilePath;
                        const info = {
                            writer: user,
                            title: "title",
                            description: "description",
                            privacy: true,
                            filePath,
                            duration,
                            thumbnail
                        }
                        axios.post('/api/video/uploadVideo', info).then(res => {
                            if(res.data.success){
                                alert('Video Uploaded Successfully');
                            }
                            else{
                                alert('Failed to upload video');
                            }
                        })
                    }
                    else    alert('failed to make the thumbnail');
                })
            }
            else    alert('fail to save video to the server');
        })
    }