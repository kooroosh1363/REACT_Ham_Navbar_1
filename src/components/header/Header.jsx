import React, { useState } from "react"
import  "./Header.css";
import { Link } from "react-router-dom";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

function Header(){

    const[active , setActive]= useState(false)

    const openMenu = ()=>{
        setActive(!active);
    }

    return(
        <div className="header">

            <div className="icon_menu">
                <BsMenuButtonWideFill className="icon" onClick={openMenu}/>
            </div>

            <nav className={active ? 'slide active' : 'slide'}>
                <ul>
                    
                    <div className="closed">
                        <BsXLg className="close" onClick={openMenu}/>
                    </div>

                    <li><Link to="/home">HOME</Link></li>
                    <li><Link to="/">ABOUT</Link></li>
                    <li><Link to="/">PRODUCT</Link></li>
                    <li><Link to="/">CONTACT</Link></li>
                    <li><Link to="/">BLOG</Link></li>
                    <li className="btn"><Link to="/">LOG IN</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Header