import React from 'react';
import { Menu } from 'antd';
import { useSelector } from "react-redux";

function LeftMenu(props) {
  const user = useSelector(state => state.user)
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">Home</a>
    </Menu.Item>
    <Menu.Item key="myVideo">
        <a href = {`/user/${user.userData && user.userData._id}`}>My Video</a>
    </Menu.Item>
    <Menu.Item key="subscription">
      <a href="/subscription">Subscription</a>
    </Menu.Item>
    <Menu.Item key="upload">
      <a href = "/video/upload">Upload</a>
    </Menu.Item>
  </Menu>
  )
}

export default LeftMenu