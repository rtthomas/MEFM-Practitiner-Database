/** 
 * Displays the banner at the top of the screen
 */
import React from 'react';
import Radium from 'radium';
import bannerImage from '../images/banner-image.png';

const banner = props => {
    return (
        <div style={bannerContainer}>
            <div style={innerContainer}>
                <div style={bannerTitle}>HealthFinder4ME</div>
                <div><img src={bannerImage} style={image} alt=''></img></div>
            </div>
            <div style={textContainer}>
                <div style={bannerText}>
                    A listing of <span style={red}>ME</span> (myalgic encephalomyelitis) 
                    and <span style={red}>FIBROMYALGIA</span> friendly
                </div>
                <div style={bannerText}>
                    <span style={bold}> HEALTH CARE PROFESSIONALS</span>
                </div>
                <div style={bannerText}>
                    <span style={italic}>Created </span> <span style={italicRed}>by Patients for Patients</span>
                </div>
            </div>
        </div>
    )
}

const bannerContainer = {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingTop: '0.5em',
    paddingLeft: '0.5em',
    '@media (max-width: 768px)': {
        flexDirection: 'column'
    }
}   

const innerContainer = {
    display: 'flex',
    justifyContent: 'space-around',
}

const textContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

const bannerTitle = {
    fontFamily: 'Arial, Helvetica, sans-serif', 
    fontWeight: 'bold',
    fontStretch: 'condensed',
    fontSize: '40px',
    '@media (max-width: 768px)': {
        fontSize: '25px',
    }    
}

const bannerText = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '15px',
    '@media (max-width: 768px)': {
        fontSize: '12px'
    }    
}

const red = {
    color: 'red'
}

const bold = {
    fontWeight: 'bold'
}

const italic = {
    fontStyle: 'italic'
}

// There was an issue with some browsers when having an array of styles. Hence this:
const italicRed = {
    fontStyle: 'italic',
    color: 'red'
}

const image = {
    maxWidth: '118px',
    height: '66px',
    marginLeft: '30%',
    '@media (max-width: 768px)': {
        maxWidth: '55px',
        height: 'auto',
        marginBottom: '0.3em'
    }
}

export default Radium(banner);
