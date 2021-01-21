import React, { useState } from 'react'
import Dropzone from 'react-dropzone';
import { AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';
import { useSelector } from 'react-redux';

function UploadVideoPage(props) {
    const user = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState(true);
    const [filePath, setFilePath] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [duration, setDuration] = useState('');

    const handleChangeTitle = ( event ) => {
        setTitle(event.currentTarget.value);
    }

    const handleChangeDecsription = (event) => {
        console.log(event.currentTarget.value);
        setDescription(event.currentTarget.value);
    }

    const handleChangePrivacy = (event) => {
        console.log(event.currentTarget.value);
        setPrivacy(event.currentTarget.value === 'public');
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if(user.userData && !user.userData.isAuth){
            return alert('Please log in first');
        }

        if(title === ""){
            return alert('Please fill in the title');
        }

        if(filePath === "" || duration === "" || thumbnail === ""){
            return alert('Please wait for the file upload completely');
        }

        const info = {
            writer: user.userData._id,
            title,
            description,
            privacy,
            filePath,
            duration,
            thumbnail
        }

        axios.post('/api/video/uploadVideo', info).then(res => {
            if(res.data.success){
                alert('Video Uploaded Successfully');
                props.history.push('/');
            }
            else{
                alert('Failed to upload video');
            }
        })
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        console.log(files);
        formData.append('file', files[0]);
        axios.post('/api/video/uploadfiles', formData, config).then(res => {
            console.log(res);

            if(res.data.success){
                setFilePath(res.data.filePath);
                let tmp = {
                    filePath: res.data.filePath,
                    fileName: res.data.fileName
                }
                axios.post('/api/video/thumbnail', tmp).then(res => {
                    if(res.data.success){
                        console.log("receive thumbnail", res.data);
                        setDuration(res.data.fileDuration);
                        setThumbnail(res.data.thumbFilePath);
                    }
                    else    alert('failed to make the thumbnail');
                })
            }
            else    alert('fail to save video to the server');

        })
    }

    return (
        <div className = "container" >
            <h2 className = "display1 text-center my-5">Upload Video!!!</h2>
            <form className = "d-flex flex-column" onSubmit = {handleSubmit}>
                <div className = "row justify-content-between form-group mb-3">
                    <Dropzone 
                        onDrop = {onDrop}
                        multiple={false}
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div className = "col-sm-5 col-xs-8" style={{height: "30vw" , border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <AiOutlinePlus style = {{width : "50%", height : "50%"}}/>
                            </div>
                        )}
                    </Dropzone>
                   {(thumbnail !== "")? 
                        <div className = "col-sm-5 col-xs-10" style = {{height: "30vw"}}>
                            <img src = {`http://140.112.244.57:4000/${thumbnail}`} className = "img-fluid" alt = "hi" style = {{height: "100%", width: "100%"}}/>
                        </div> : null} 
                </div>
                <div className = "form-group my-3">
                    <label htmlFor = "title">Title</label>
                    <input type="text" className = "form-control" id = "title" placeholder = "Title" onChange = {handleChangeTitle}/>
                </div>
                <div className = "form-group my-3">
                    <label htmlfor = "description">Description</label>
                    <input type = "text" className = "form-control" id = "description" placeholder = "Description" onChange = {handleChangeDecsription} />
                </div>
                <div className = "form-group my-3" style = {{width: "20%"}}>
                    <select className = "form-control" onChange = {handleChangePrivacy} >
                        <option>public</option>
                        <option>private</option>
                    </select>
                </div>
                
                <button type="submit" className = "btn btn-primary my-3" style = {{width: "20%"}}>Submit</button>
            </form>
        </div>
    )
}

export default UploadVideoPage;
