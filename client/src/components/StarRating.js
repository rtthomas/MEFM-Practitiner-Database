/**
 * A "Star" rating widget to display average rsult for a single choice question
 */
import React from 'react';
import Ratings from 'react-ratings-declarative';

const starRating = (props) => {
    return (
        <div className={props.className} style={{display: 'inline'}}>
            <Ratings 
                rating={props.value} 
                widgetDimensions="20px" 
                widgetSpacings="1px"  
                widgetRatedColors="orange">
                <Ratings.Widget/>
                <Ratings.Widget/>
                <Ratings.Widget/>
                <Ratings.Widget/>
                <Ratings.Widget/>
            </Ratings>
        </div>
    );
}

export default starRating