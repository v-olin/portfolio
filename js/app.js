// ----- Variables --------------------
let waypoints = [];
const wp_len = 20;

let planes = [];
const plane_len = 20;
let planeImg;
let planeImgUrl = 'https://alohe.github.io/emojicloud/svg/Airplane.svg';

// ----- Funcs ------------------------
function setup() {
    // set canvas
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvas");
    canvas.style("z-index", "-1");
    canvas.position(0, 0);
    fill(0,0,0);
    // angleMode(DEGREES);

    // set up waypoints
    for (let i = 0; i < wp_len; i++) {
        waypoints.push(new Waypoint());
    }

    // generate airplanes
    for (let i = 0; i < plane_len; i++) {
        planes.push(new Plane());
    }
}

function preload() {
    planeImg = loadImage(planeImgUrl);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    clear();
    if (windowWidth > 420) {
        for (let i = 0; i < plane_len; i++) {
            let p = planes[i];
            p.update();
            if (p.outsideCanvas() === true){
                p.reset();
            }
            p.draw();
        }
    }
}

function outsideCoords() {
    let side = Math.floor(Math.random() * 4);
    let dx = Math.floor(Math.random() * windowWidth);
    let dy = Math.floor(Math.random() * windowHeight);
    let x = 0;
    let y = 0;

    switch(side){
        case 0:
            x = dx;
            y = -20;
            break;
        case 1:
            x = windowWidth + 20;
            y = dy;
            break;
        case 2:
            x = dx;
            y = windowHeight + 20;
            break;
        case 3:
            x = -20;
            y = dy;
            break;
    }

    return createVector(x, y);
}

function normalizeVector(vector) {
    let x = vector.x;
    let y = vector.y;
    let z = Math.sqrt(x*x + y*y);
    x = x / z;
    y = y / z;
    let nVector = createVector(x,y)
    // console.log(`V: ${vector}, N: ${nVector}`);


    return nVector;
}

// ----- Objects ----------------------
class Waypoint {
    constructor() {
        this.x = Math.floor(Math.random() * (windowWidth * 0.85));
        this.y = Math.floor(Math.random() * (windowHeight * 0.85));
    }
}

class Plane {
    constructor() {
        this.entry = outsideCoords();
        this.x = this.entry.x;
        this.y = this.entry.y;
        this.exit = outsideCoords();
        this.waypoint = waypoints[Math.floor(Math.random() * wp_len)];
        let dx = this.waypoint.x - this.entry.x;
        let dy = this.waypoint.y - this.entry.y;
        let vec = createVector(dx,dy);
        this.velocity = normalizeVector(vec);
        this.r = 3.0;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw() {
        let track = (this.velocity.heading() + radians(45)) % TWO_PI;
        push();
        rotate(track);
        translate(this.x, this.y);
        image(planeImg, this.x, this.y);
        pop();
        fill(255, 255, 255);
    }

    outsideCanvas() {
        if ((this.x < -20 || this.x > windowWidth + 20)
            && (this.y < -20 || this.y > windowHeight + 20)){
                return true;
            }
        return false;
    }

    reset() {
        this.entry = outsideCoords();
        this.x = this.entry.x;
        this.y = this.entry.y;
        this.exit = outsideCoords();
        this.waypoint = waypoints[Math.floor(Math.random() * wp_len)];
        let dx = this.waypoint.x - this.entry.x;
        let dy = this.waypoint.y - this.entry.y;
        let vec = createVector(dx,dy);
        this.velocity = normalizeVector(vec);
        // let trackRad = this.velocity.heading()
        // let trackDeg = degrees(trackRad);
        // console.log(`R: ${trackRad}, D: ${trackDeg % 360}`);
    }
}