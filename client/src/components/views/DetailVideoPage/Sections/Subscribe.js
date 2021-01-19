import React, { useEffect , useState } from 'react'
import axios from 'axios';


function Subscribe({ videoWriter , handleSubscribeNumber }) {

    const [subscribeNumber, setSubscribeNumber] = useState(0);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const sub = {userTo: videoWriter, userFrom: localStorage.getItem('userId')};
        axios.post('/api/subscribe/subscribeNumber', sub).then(res => {
            if(res.data.success){
                console.log(res.data.subscribeNumber);
                setSubscribeNumber(res.data.subscribeNumber);
                handleSubscribeNumber(res.data.subscribeNumber);
            }
            else{
                alert("Failed to get the subscribe number");
            }
        })

        axios.post('/api/subscribe/subscribed', sub).then(res => {
            if(res.data.success){
                console.log(res.data.subscribed);
                setSubscribed(res.data.subscribed);
            }
            else{
                alert("Failed to get the subscribed information");
            }
        })
    });

    const handleSubscribe = () => {
        const sub = {userTo: videoWriter, userFrom: localStorage.getItem('userId')};
        if(subscribed){
            axios.post('/api/subscribe/unsubscribe', sub).then(res => {
                if(res.data.success){
                    setSubscribeNumber(subscribeNumber - 1);
                    handleSubscribeNumber(subscribeNumber - 1);
                    setSubscribed(!subscribed);
                }
                else{
                    alert('Failed to unsubscribe');
                }
            })
        }
        else{
            axios.post('/api/subscribe/subscribe', sub).then(res => {
                if(res.data.success){
                    setSubscribeNumber(subscribeNumber + 1);
                    handleSubscribeNumber(subscribeNumber + 1);
                    setSubscribed(!subscribed);
                }
                else{
                    alert('Failed to subscribe');
                }
            })
        }
    }

    return (
        <div>
            <button type="button" className = {subscribed ? "btn btn-primary" : "btn btn-danger" } onClick = {handleSubscribe} style = {{
                    width: "80%", "minWidth": "100px"}}> 
                {subscribed ? "取消訂閱" : "訂閱"}
            </button>
        </div>
    )
}

export default Subscribe
