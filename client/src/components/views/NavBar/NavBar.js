import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Drawer } from 'antd';
import './Sections/Navbar.css';
import { AiOutlineMenu , AiOutlineSearch } from 'react-icons/ai';
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

function NavBar(props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit");

      window.localStorage.setItem('search', search);
      setSearch("");
      props.history.push('/search');
  }

  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
      <Drawer
          title=""
          placement="left"
          className="menu_drawer"
          closable={true}
          onClose={onClose}
          visible={visible}
          width = "150"
        >
          <LeftMenu mode="inline" />
          <RightMenu mode = "inline" />
      </Drawer>
      <div className = "d-flex justify-content-between" style = {{width: "100%"}}>
        <div >
            <AiOutlineMenu
              className="menu__mobile-button"
              onClick={showDrawer}
            >
            </AiOutlineMenu>
            <div className="menu__logo">
              <a href="/">Logo</a>
            </div>
        </div>
        <form onSubmit = {onSubmit} className = "form-inline my-2 my-lg-0" style = {{width: "50%"}}>
            <input onChange = {onSearchChange} value = {search} style = {{width: "70%"}} className = "form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button style = {{width: "10%"}} className = "btn my-2 my-sm-0 p-1" type="submit">
              <AiOutlineSearch style = {{width: "100%"}}/>
            </button>
        </form>
        <div className="menu_right" style = {{width: "26%"}}>
            <RightMenu mode="horizontal" />
        </div>  
      </div>
    </nav>
  )
}
        
export default withRouter(NavBar);