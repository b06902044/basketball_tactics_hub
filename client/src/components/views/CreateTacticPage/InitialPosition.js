const color = ["#CC0000", "#FFFF00", "#00CC00", "#4BABE4", "#4353E4", "#7928B6", "#FF9933"]

export const all = [];
for(let i = 0; i < 7; i++){
    const team = [];
    for(let j = 15; j > 0; j--){
        const player = {
            dragging: false,
            x : (i === 6)? 350 : 0 + 50 * i,
            y : 50,
            color: color[i],
            name: (i === 6)? "" : `${j}`,
            hasMoved: false,
            team: i,
            idx: 15 - j,
            ball: (i === 6),
        }
        team.push(player);
    }
    all.push(team);
}

export const hasAnimation = [];
for(let i = 0; i < 7; i++){
    const team = [];
    for(let j = 15; j > 0; j--){
        team.push({
            exist: false,
            x : 0,
            y : 0,
            path: null,
            ctrl_pt1: {x: 0, y: 0, dragging: false},
            ctrl_pt2: {x: 0, y: 0, dragging: false}, 
            color: color[i],
            team: i,
            idx: 15 - j,
            ball: (i === 6),
            name: (i === 6)? "" : `${j}`
        });
    }
    hasAnimation.push(team);
}