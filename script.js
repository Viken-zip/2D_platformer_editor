const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const tile = innerHeight / 32;

const maptxt = document.getElementById('maptxt');
const copyBtn = document.getElementById('copyBtn');
const canvasContainer = document.getElementById('canvasContainer')

canvas.width = tile * 500
canvas.height = tile * 16

let map = [];

const mouse = {
    x: 0,
    y: 0
}

//makes the background grid
let gridImg = new Image()
gridImg.src = "img/grid.png"
gridImg.onload = function () {
    for(let i = 0; i < 500; i++){
        for(let j = 0; j < 16; j++){
            console.log('TF')
            context.drawImage(gridImg, i * tile, j * tile, tile, tile)
        }
    }
}
//function that returs from x and y to what postition in the grid it is on
function getTilePos(x, y){
    let xPos = Math.ceil(y / tile) - 1, yPos = Math.ceil(x / tile) - 1
    return [xPos, yPos]
}

//button click checker
addEventListener('keyup', (e)=>{
    if(e.key == 'z'){
        addPlatform('Brick')
    }
    if(e.key == 'x'){
        addPlatform('Lava')
    }
    if(e.key == 'c'){
        addPlatform('RoofChain')
    }
    if(e.key == 'v'){
        addPlatform('FloorChain')
    }
    if(e.key == 'b'){
        addPlatform('Chain')
    }
    if(e.key == 'n'){
        addPlatform('FloorChainFade')
    }
    if(e.key == 'm'){
        addPlatform('RoofChainFade')
    }
    if(e.key == 'a'){
        addPlatform('ChainFadeIn')
    }
    if(e.key == 's'){
        addPlatform('ChainFadeOut')
    }
    if(e.key == 'd'){
        let exist = false;
        for(let i = 0; i < map.length; i++){
            if( map[i + 2] == 'Start' ){
                exist = true;
            }
        }
        if(!exist){
            addPlatform('Start')
        }
    }
    if(e.key == 'f'){
        let exist = false;
        for(let i = 0; i < map.length; i++){
            if( map[i + 2] == 'Goal' ){
                exist = true;
            }
        }
        if(!exist){
            addPlatform('Goal')
        }
    }
    if(e.key == 'r'){
        removePlatform();
    }
})

//checks mouse position
canvas.addEventListener('mousemove', (e)=>{
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
})

//fucntion that checks and places platforms
function addPlatform(type){

    //get the mouse position
    let PlatformPos = getTilePos(mouse.x, mouse.y)

    // checks if the place is free
    let taken = false;
    for(let i = 0; i < map.length; i += 3){
        if( (map[i] == PlatformPos[1] && map[i + 1] == PlatformPos[0]) ){
            taken = true
            break;
        }
    }

    //if place is free place the platofrm
    if(!taken){

        //draws it on the map
        let platformImg = new Image();
        platformImg.onload = function () {
            context.drawImage(platformImg, PlatformPos[1] * tile, PlatformPos[0] * tile, tile, tile)
        }
        platformImg.src = 'img/' + type + '.png';

        //pushes it to the map array
        map.push(PlatformPos[1], PlatformPos[0], type)
    }
    
    updateMapCodeBox();
}

//function for removing platform
function removePlatform(){
    //get the mouse position
    let PlatformPos = getTilePos(mouse.x, mouse.y)

    //if there is a platform delet it and clear it from map
    for(let i = 0; i < map.length; i += 3){
        if( (map[i] == PlatformPos[1] && map[i + 1] == PlatformPos[0]) ){
            context.clearRect(map[i] * tile, map[i + 1] * tile, tile, tile);
            context.drawImage(gridImg, map[i] * tile, map[i + 1] * tile, tile, tile)
            map.splice(i, 3)
        }
    }
    updateMapCodeBox();
}

//updates the textarea with code
function updateMapCodeBox(){
    let send = [];
        for(let i = 0; i < map.length; i += 3){
            //console.log( 'new' + map[i + 2] + '(tile * ' + map[i] + ', tile * ' + map[i + 1] + ', tile, tile);' )
            send.push('new' + map[i + 2] + '(tile * ' + map[i] + ', tile * ' + map[i + 1] + ', tile, tile);');
        }
     maptxt.innerHTML = send.join("\n");
}

//Copy button event
copyBtn.addEventListener('click', ()=>{
    maptxt.select();
    navigator.clipboard.writeText(maptxt.innerHTML);
});

//scroll wheel scrolls on the y-axis overflow
canvasContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    canvasContainer.scrollLeft += e.deltaY;
});