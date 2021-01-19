import React from 'react'
import basketball from './images/basketball-ball.svg'

function OpacityPlayer( { x , y , color , name , ball } ) {
    return (
        <g className = "fixed_player_btn" >
            {ball? 
            <image href = {basketball} x = {x - 13} y = {y - 13} width = "26px" height = "26px"/>
                :  
            <circle cx = {x} cy = {`${y - 2.5}`} r = "13" fill = {color} /> }
            <text fontSize = "14" fill = "#000000" className = "player_name"
                x = {`${x - 6}`} 
                y = {`${y + 2.5}`} >
                {name}
            </text>
        </g>
    )
}

export default OpacityPlayer
