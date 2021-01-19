import React , { useState, useLayoutEffect } from 'react'
import court from './images/court.jpg';
import { all , hasAnimation } from './InitialPosition';
import './CreateTacticPage.css';
import { AiOutlinePlus , AiOutlinePause } from 'react-icons/ai';
import OpacityPlayer from './OpacityPlayer';
import ControlPoint from './ControlPoint';
import PlayerBall from './PlayerBall';
import { FaPlay , FaStop , FaPause , FaPlus } from 'react-icons/fa';

const defaultFrameRate = 3;

function CreateTacticPage() {
    const [viewSize, setViewSize] = useState({ courtWidth: 0, courtHeight: 0, windowWidth: 0, windowHeight: 0 });
    const [totalFrame, setTotalFrame] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [position, setPosition] = useState(all);
    const [animation, setAnimation] = useState(hasAnimation);
    const [previousPosition, setPreviousPosition] = useState([]);
    const [play, setPlay] = useState(false);
    const [end, setEnd] = useState(true);
    const [videoInfo, setVideoInfo] = useState([]);
    const [video, setVideo] = useState([]);
    const [frameRate, setFrameRate] = useState(defaultFrameRate);
    const [timer , setTimer] = useState(null);

    useLayoutEffect(() => {
        function updateSize() {
            let w, h;
            if(window.innerWidth  * 15 / 28 < (window.innerHeight - 90)){
                console.log("width base");
                w = window.innerWidth;
                h = window.innerWidth * 15 / 28;
            }
            else{
                console.log("height base");
                w = (window.innerHeight - 90) * 0.8 * 28 / 15;
                h = (window.innerHeight - 90) * 0.8;
            }
            setViewSize({ courtWidth: w, courtHeight: h, windowWidth: window.innerWidth, windowHeight: window.innerHeight });

            let pos = [...position];
            pos = pos.map((team, team_id) => {
                return team.map((player, player_id) => {
                    if(player.hasMoved)     return player;
                    player.x = window.innerWidth * 0.15 + 10 + team_id * 35 + ((team_id === 6)? 50  : 0);
                    player.y = (h > 300)? 0.85 * h : 0.85 * h - 0.1 * (h - 300);
                    return player;
                })
            });
            setPosition(pos);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
      }, []);

    function handlePointerDown(event, team, player){
        event.preventDefault();
        const pos = [...position];
        pos[team][player].dragging = true;
        setPosition(pos);
    }

    function handlePointerMove(event, team, player){
        event.preventDefault();
        if(!position[team][player].dragging)    return;

        console.log("mousemove")
        const pos = [...position];
        const CTM = document.getElementById("svg").getScreenCTM();
        pos[team][player].x = (event.clientX - CTM.e) / CTM.a;
        pos[team][player].y = (event.clientY - CTM.f) / CTM.d;
        pos[team][player].hasMoved = true;
        setPosition(pos);
        
        if(animation[team][player].exist){
            const ani = [...animation];
            const point = {x1: animation[team][player].x, y1: animation[team][player].y, x2: pos[team][player].x, y2: pos[team][player].y};
            ani[team][player].ctrl_pt1 = { x : point.x1 + (point.x2 - point.x1) / 3, y : point.y1 + (point.y2 - point.y1) / 3};
            ani[team][player].ctrl_pt2 = { x : point.x1 + (point.x2 - point.x1) * 2 / 3, y : point.y1 + (point.y2 - point.y1) * 2 / 3};
            ani[team][player].path = <path d = {`M${animation[team][player].x} ${animation[team][player].y} C ${ani[team][player].ctrl_pt1.x} ${ani[team][player].ctrl_pt1.y}, ${ani[team][player].ctrl_pt2.x} ${ani[team][player].ctrl_pt2.y}, ${pos[team][player].x} ${pos[team][player].y}`}
                                           className = "path" style = {{stroke: pos[team][player].color}} />
            setAnimation(ani);
        }
    }

    function handlePointerUp(event, team, player){
        event.preventDefault();
        console.log("mouseup")
        const pos = [...position];
        pos[team][player].dragging = false;
        setPosition(pos);
    }

    const increaseCurrentFrame = () => {
        let ani = [...animation];
        const videoFrame = [];
        ani.forEach(team => {
            team.forEach(player => {
                if(position[player.team][player.idx].hasMoved){
                    const move = {
                        idx: player.idx,
                        color: player.color,
                        path: player.path? player.path.props.d : `M${position[player.team][player.idx].x} ${position[player.team][player.idx].y}`,
                        ball: player.ball,
                        name: player.name
                    }
                    videoFrame.push(move);
                    player.path = null;
                }
            })
        })
        setVideoInfo([...videoInfo, videoFrame]);

        const fixed_section = position.map(team => {
            return team.filter(player => { return (player.hasMoved); }).map(player  => {
                ani[player.team][player.idx].exist = true;
                ani[player.team][player.idx].x = position[player.team][player.idx].x;
                ani[player.team][player.idx].y = position[player.team][player.idx].y;
                return <OpacityPlayer x = {position[player.team][player.idx].x} y = {position[player.team][player.idx].y} color = { player.color } name = {player.name} ball = {player.ball}/>
            })
        });

        setTotalFrame(totalFrame + 1);
        setAnimation(ani);
        setPreviousPosition(fixed_section);
    }

    const player_section = position.map((team, team_id) => {
        return team.map((player , player_id) => {
            return (
                <g className = "player_btn" data-draggable = "1" data-long-touchable = "1" data-on-top-when-touched = "1" onMouseDown = {e => handlePointerDown(e, team_id, player_id)}  onMouseMove = {e => handlePointerMove(e, team_id, player_id)} onMouseUp = {e => handlePointerUp(e, team_id, player_id)} >
                    <PlayerBall x = {`${position[team_id][player_id].x}`} y = {`${position[team_id][player_id].y}`} color = {player.color} name = {player.name} ball = {player.ball} offset = {0}/>
                </g>
            )
        })
    })

    const animation_path = animation.map(team => {
        return team.filter(player => { return (player.path);}).map(player => {
            return player.path;
        })
    })

    function handleControlPointDown(event, team, player, point){
        event.preventDefault();
        console.log("ctrlmousedown");
        const ani = [...animation];
        ani[team][player][point].dragging = true;
        setAnimation(ani);
    }

    function handleControlPointMove(event, team, player, point){
        event.preventDefault();
        if(!animation[team][player][point].dragging)    return;

        console.log("ctrlmousemove")
        const ani = [...animation];
        const CTM = document.getElementById("svg").getScreenCTM();
        ani[team][player][point].x = (event.clientX - CTM.e) / CTM.a;
        ani[team][player][point].y = (event.clientY - CTM.f) / CTM.d;
        
        ani[team][player].path = <path d = {`M${ani[team][player].x} ${ani[team][player].y} C${ani[team][player].ctrl_pt1.x} ${ani[team][player].ctrl_pt1.y},${ani[team][player].ctrl_pt2.x} ${ani[team][player].ctrl_pt2.y}, ${position[team][player].x} ${position[team][player].y}`}
                                           className = "path" style = {{stroke: ani[team][player].color}} />
        
        setAnimation(ani);
    }

    function handleControlPointUp(event, team, player, point){
        event.preventDefault();
        console.log("ctrlmouseup")
        const ani = [...animation];
        ani[team][player][point].dragging = false;
        setAnimation(ani);
    }


    const control_point = animation.map(team => {
        return team.filter(player => { return (player.path);}).map(player => {
            return (
                <React.Fragment>
                    <ControlPoint x = {player.ctrl_pt1.x} y = {player.ctrl_pt1.y} color = {player.color} onMouseDown = {e => handleControlPointDown(e, player.team, player.idx, "ctrl_pt1")}  onMouseMove = {e => handleControlPointMove(e, player.team, player.idx, "ctrl_pt1")} onMouseUp = {e => handleControlPointUp(e, player.team, player.idx, "ctrl_pt1")}/>
                    <ControlPoint x = {player.ctrl_pt2.x} y = {player.ctrl_pt2.y} color = {player.color} onMouseDown = {e => handleControlPointDown(e, player.team, player.idx, "ctrl_pt2")}  onMouseMove = {e => handleControlPointMove(e, player.team, player.idx, "ctrl_pt2")} onMouseUp = {e => handleControlPointUp(e, player.team, player.idx, "ctrl_pt2")}/>
                </React.Fragment> 
            )
        })
    })

    const handlePlay = () => {
        if(end){
            setCurrentFrame(0);
            document.getElementById("svg").setCurrentTime(0);
            document.getElementById("svg").pauseAnimations();
            setVideo(videoInfo.map((frame, frame_id) => {
                return frame.map((player, player_id) => {
                    return (
                        <g>
                            <PlayerBall x = {0} y = {0} color = {player.color} ball = {player.ball} name = {player.name} offset = {2.5}/>
                            
                            <animate attributeName="visibility" to="hidden" begin = "0s" fill = "freeze"/>
                            <animate id = {`vis${frame_id}p${player_id}`} dur={`1ms`} attributeName="visibility" from="hidden" to="visible" begin = {`${(frame_id) * frameRate}s`} repeatCount="0" fill="freeze" />
                            <animateMotion id = {`move${frame_id}p${player_id}`} path = {player.path} dur = {`${frameRate}s`} begin = {`vis${frame_id}p${player_id}.end`} fill = "freeze"/>
                            {(frame_id === totalFrame - 1)? null : <animate attributeName="visibility" to="hidden" begin={`move${frame_id}p${player_id}.end`}  fill="freeze" />}
                        </g>
                    )
                })
            }));
            setEnd(false);
        }
        setPlay(true);
        document.getElementById("svg").unpauseAnimations();
        if(timer === null){
            //const t = setInterval(interval, frameRate * 1000);
            //console.log("settimer", t);
            //setTimer(t);
        }
    }

    function interval(){
        const t = document.getElementById("svg").getCurrentTime();
        console.log(timer);
        console.log(t);
        const frame = Math.min(totalFrame, Math.round(t / frameRate));
        setCurrentFrame(frame);
        if(frame === totalFrame){
            handleStop();
        }
    }

    const handlePause = () => {
        setPlay(false);
        document.getElementById("svg").pauseAnimations();
        console.log(timer);
        //clearInterval(timer);
        setTimer(null);
        console.log("cleartimer");
    }
    
    function handleStop() {
        console.log("stop");
        console.log(timer);
        if(timer){
            //clearInterval(timer);
            setTimer(null);
            console.log("cleartimer");
        }
        setEnd(true);
        setPlay(false);
    }

    return (
        <div className = "" style = {{width: "100%", height: `${viewSize.windowHeight}px`}}>
                <div id = "control-btn-section" className = "d-flex" style = {{padding: `0 ${viewSize.windowWidth * 0.15}px`, margin: "0 0"}}>
                    {end?   <h3 className = "align-self-center">{totalFrame}</h3>
                                :
                            <h3 className = "align-self-center">{`${currentFrame} /  ${totalFrame}`}</h3>         
                    }
                    {play? 
                    <FaPause className = "control-btn align-self-center" size = {25 * viewSize.courtHeight / 500} onClick = {handlePause}/>
                        :
                    <FaPlay className = "control-btn align-self-center" size = {25 * viewSize.courtHeight / 500} onClick = {handlePlay}/>
                    }
                    <FaStop className = "control-btn align-self-center" size = {25 * viewSize.courtHeight / 500} onClick = {handleStop} />
                    <FaPlus className = "control-btn align-self-center" size = {25 * viewSize.courtHeight / 500} onClick = {increaseCurrentFrame}/>
                </div>
                <svg viewBox = {`0 0 ${viewSize.courtWidth} ${viewSize.courtHeight}`} id = "svg" >
                    <image href = {court} x = "0" y = "0" width = {`${viewSize.courtWidth}px`} height = {`${viewSize.courtHeight * 0.8}px`} />
                    
                    {   end?    <React.Fragment>
                                    {animation_path}
                                    {previousPosition}
                                    {player_section}
                                    {control_point}
                                </React.Fragment> 
                                    :
                                video        
                    } 
                </svg>
        </div>
    )
}

export default CreateTacticPage
