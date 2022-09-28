'use strict';

const grid = document.querySelector('#grid');
const gridSize = document.querySelector('#gridSize');
const gridSlide = document.querySelector('#gridSlide');
const hbPencilBtn = document.querySelector('#hbPencilBtn');
const bPencilBtn = document.querySelector('#bPencilBtn');
const pencil6bBtn = document.querySelector('#pencil6bBtn');
const rainbowBtn = document.querySelector('#rainbowBtn');
const shadingBtn = document.querySelector('#shadingBtn');
const eraserBtn = document.querySelector('#eraserBtn');
const clearBtn = document.querySelector('#clearBtn');
const color = document.querySelector('#colorPicker');
const settings = document.querySelector('.settings').childNodes;

const DefaultSize = 16;
const defaultColor = 'rgb(89, 87, 87)';
const defaultMode = 'pencilHB';

const bPencilCLR = 'rgb(55, 55, 55)';
const pencil6bCLR = 'rgb(40, 40, 40)';


let currentGridSize = DefaultSize;
let currentColor = defaultColor;
let currentMode = defaultMode

settings.forEach(selection => selection.addEventListener('click', (e) => {
    let userSelection = e.target.id;
     
    switch(userSelection) {
        case 'hbPencilBtn':
            setNewMode('pencilHB');
            break;
        case 'bPencilBtn':
            setNewMode('pencilB');
            break;
        case 'pencil6bBtn':
            setNewMode('pencil6B');
            break;
        case 'rainbowBtn':
            setNewMode('rainbow');
            break;
        case 'shadingBtn':
            setNewMode('shading');
            break;
        case 'eraserBtn':
            setNewMode('eraser');
            break;
        case 'clearBtn':
            setNewMode('clear')
            reloadGrid();
            break;
    }
}))

function setNewColor(newColor) {
    currentColor = newColor;
}

function setNewMode(newMode) {
    setButtonActive(newMode);
    currentMode = newMode;
}

function setButtonActive(newMode) {
    if(currentMode === 'shading') {
        shadingBtn.classList.remove('active');
    }else if(currentMode === 'clear') {
        clearBtn.classList.remove('active');
    }

    if(newMode === 'shading') {
        shadingBtn.classList.add('active');
    }else if(newMode === 'clear') {
        clearBtn.classList.add('active');
    }
}

function setCurrentSize(newSize) {
    currentGridSize = newSize;
}

color.addEventListener('input', (e) => {
    currentColor = e.target.value;
})

function updateGridSize(value) {
    gridSize.textContent = `${value} x ${value}`;
}

function changeGridSize(value) {
    setCurrentSize(value);
    updateGridSize(value);
    reloadGrid();
}

function reloadGrid() {
    clearGrid();
    createGrid(currentGridSize);
}

function clearGrid() {
    grid.innerHTML = '';
}

gridSlide.addEventListener('input', (e)  =>{
    changeGridSize(e.target.value);
})


let pointerDown = false
document.body.onpointerdown = () => (pointerDown = true)
document.body.onpointerup = () => (pointerDown = false)

/* color.value = defaultColor */

function createGrid() {
    grid.setAttribute('style', `grid-template-columns: repeat(${currentGridSize}, 1fr)`);

    for(let i = 0; i < (currentGridSize * currentGridSize); i++) {
        const gridSquares = document.createElement('div');
        gridSquares.classList.add('grid-squares');
        gridSquares.addEventListener('pointerover', changeBackgroundColor)
        gridSquares.addEventListener('pointerdown', changeBackgroundColor)
        grid.appendChild(gridSquares);
    }

    const rightBorder = document.querySelectorAll(`.grid-squares:nth-child(${currentGridSize}n)`);

    for(let i = 0; i < rightBorder.length; i++) {
        rightBorder[i].classList.toggle('border-right');
    }

    const gridItems = document.querySelectorAll('.grid-squares');
    const lastItems = Array.from(gridItems).slice(-`${currentGridSize}`);
    for (let i = 0; i < lastItems.length; i++) {
      lastItems[i].classList.toggle('border-bottom');
    }

}

color.addEventListener('click', (e) => {
    setNewColor(e.target.value);
    e.target.setAttribute('style', `background-color: ${currentColor}`);
})

function changeBackgroundColor(e) {
    if(e.type === 'pointerover' && !pointerDown) return;
    if(currentMode === 'rainbow') {
        const randomRed = Math.floor(Math.random() * 255);
        const randomGreen = Math.floor(Math.random() * 255);
        const randomBlue = Math.floor(Math.random() * 255);
        e.target.setAttribute('style', `background-color: rgb(${randomRed}, ${randomGreen}, ${randomBlue})`);
    }else if(currentMode === 'pencilHB') {
        e.target.setAttribute('style', `background-color: ${defaultColor}`);
    }else if(currentMode === 'pencilB') {
        e.target.setAttribute('style', `background-color: ${bPencilCLR}`);
    }else if(currentMode === 'pencil6B') {
        e.target.setAttribute('style', `background-color: ${pencil6bCLR}`);
    }else if(currentMode === 'eraser') {
        e.target.setAttribute('style', `background-color: ''`);
    }else if(currentMode === 'shading') {
        e.target.style.backgroundColor = adjust(RGBToHex, e.target.style.backgroundColor, -15);
    }else if(currentMode === 'colorPicker') {
        e.target.setAttribute('style', `background-color: ${currentColor}`);
    }
}

color.addEventListener('input', (e) => {
    setNewMode('colorPicker')
    setNewColor(e.target.value);
    console.log(currentColor)
})


function pointerMoveEvent() {
    grid.addEventListener('pointermove', changeBackgroundColor);
    grid.addEventListener('pointerup', () => {
        grid.removeEventListener('pointermove', changeBackgroundColor);
    })
}


// Shading
function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(')')[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);
  
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    b = (+rgb[2]).toString(16);
  
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    return '#' + r + g + b;
  }
  
  function adjust(RGBToHex, rgb, amount) {
    let color = RGBToHex(rgb);
    return (
      '#' +
      color
        .replace(/^#/, '')
        .replace(/../g, (color) =>
          ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
        )
    );
  }

  const date = document.querySelector('#date');
  const currentYear = new Date().getFullYear();
  date.textContent = currentYear;

window.onload = () => {
    createGrid(currentGridSize);
}
