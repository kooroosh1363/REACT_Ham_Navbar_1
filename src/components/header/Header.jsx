import React from "react"
import styled from "./Header.module.css";
import { Link } from "react-router-dom";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

function Header(){
    return(
        <div className={styled.header}>

            <div className={styled.icon_menu}>
                <BsMenuButtonWideFill className={styled.icon}/>
            </div>

            <nav>
                <ul>
                    
                    <div className={styled.closed}>
                        <BsXLg className={styled.close}/>
                    </div>

                    <li><Link to="/">HOME</Link></li>
                    <li><Link to="/">ABOUT</Link></li>
                    <li><Link to="/">PRODUCT</Link></li>
                    <li><Link to="/">CONTACT</Link></li>
                    <li><Link to="/">BLOG</Link></li>
                    <li><Link to="/">LOG IN</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Header