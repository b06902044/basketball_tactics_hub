import React from 'react'

function ControlPoint( { x , y , color , onMouseDown , onMouseMove, onMouseUp } ) {
    return (
            <g className = "control_btn" data-draggable = "1" data-long-touchable = "1" data-on-top-when-touched = "1">
                <circle cx = { x } cy = { y } r = "6" fill = {color} onMouseDown = {onMouseDown} onMouseMove = {onMouseMove} onMouseUp = {onMouseUp} /> 
            </g>
    )
}

export default ControlPoint
