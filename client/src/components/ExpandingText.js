import React from 'react';

/**
 * Implements an HTML textarea element which will expand as the number of lines of text
 * increases. This overrides the default behaviour of adding a vertical scroll bar
 */
const expandingText = (props) => {
    return <textarea 
        autoFocus
        className={props.className} 
        onKeyDown = {(event) => autosize(event)} 
        defaultValue={props.value}
        onChange={props.onChange}
        />
}

const autosize = event => {
    var el = event.target;
    setTimeout(function(){
      el.style.cssText = 'height:auto; padding:0';
      // for box-sizing other than "content-box" use:
      // el.style.cssText = '-moz-box-sizing:content-box';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
}

export default expandingText;