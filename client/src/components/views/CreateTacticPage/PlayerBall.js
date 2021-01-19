import React from 'react'
import basketball from './images/basketball-ball.svg'

function PlayerBall({ x , y , color , ball , name , offset }) {
    return ball? 
            <image href = {basketball} x = {x - 13} y = {y - 13 + offset} width = "26px" height = "26px"/> 
                : 
            <React.Fragment> 
                <circle cx = {x} cy = {`${y - 2.5 + offset}`} r = "13" fill = {color} /> 
                <text fontSize = "14" fill = "#000000" className = "player_name" x = {`${x - 5.5}`} y = {`${y + 5}`} >{name}</text>
            </React.Fragment>
}

export default PlayerBall
