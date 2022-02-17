import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'; 
import  '../css/home.css';

/**
 * Home page sidebar "table of contents"
 */

const homeSidebar = ({elements}) => {
    return (
        <div className='sidebar'>
            {
                elements.map(element => {
                    return ( 
                        <div className='sidebar-row'>
                            <Link to={element.id}>{element.title}</Link>
                        </div>
                    )
                })
            }
        </div>
    )
}
//                             <span onClick={() => scrollTo(element.id)}>{element.title}</span>

const scrollTo = (id) => {
    const target = document.getElementById(id);
    target.scrollIntoView()
}

export default homeSidebar;
