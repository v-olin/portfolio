// ----- Variables --------------------
let waypoints = [];
let planes = [];
let planeImg;
let planeImgUrl = 'https://alohe.github.io/emojicloud/svg/Airplane.svg';
// let planeImgUrl = 'https://alohe.github.io/emojicloud/svg/Pile%20of%20poo.svg';

// ----- Constants --------------------
const wp_len = 20;
const plane_len = 20;

// ----- Funcs ------------------------
function setup() {
    // set canvas
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvas");
    canvas.style("z-index", "-1");
    canvas.position(0, 0);
    fill(0,0,0);
    angleMode(DEGREES);

    // generate waypoints
    for (let i = 0; i < wp_len; i++) {
        waypoints.push(new Waypoint());
    }

    // generate airplanes
    for (let i = 0; i < plane_len; i++) {
        planes.push(new Plane());
    }
}

// Loads image when accessed
function preload() {
    planeImg = loadImage(planeImgUrl);
}

// Canvas resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Draws planes on screen
function draw() {
    clear();
    if (windowWidth > 420) {
        for (let i = 0; i < plane_len; i++) {
            let p = planes[i];
            p.update();
            if (p.outsideCanvas()){
                p.reset();
            }
            p.draw();
        }
    }
}

// Generates random coords outside of screen for plane to enter from
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

// Normalizes a vector
function normalizeVector(vector) {
    let x = vector.x;
    let y = vector.y;
    let z = Math.sqrt(x*x + y*y);
    x = x / z;
    y = y / z;
    return createVector(x,y);
}

// ----- Objects ----------------------

/*
    Waypoint object
    -------------------------
    Object members:
        - x: Horizontal coordinate for waypoint
        - y: Vertical coordinate for waypoint
*/
class Waypoint {
    constructor() {
        this.x = Math.floor(Math.random() * (windowWidth * 0.85));
        this.y = Math.floor(Math.random() * (windowHeight * 0.85));
    }
}

/*
    Plane object
    -------------------------
    Object members:
        - Entry coordinates for screen
        - Waypoint (not implemented yet)
        - Exit coordinates for screen
        - Velocity (2d vector)
*/
class Plane {
    constructor() {
        this.entry = outsideCoords();
        this.x = this.entry.x;
        this.y = this.entry.y;
        this.exit = outsideCoords();
        this.waypoint = waypoints[Math.floor(Math.random() * wp_len)];
        let dx = this.waypoint.x - this.entry.x;
        let dy = this.waypoint.y - this.entry.y;
        this.velocity = normalizeVector(createVector(dx,dy));
    }

    // Updates plane coordinates according to velocity
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    // Draws a plane emoji in accordance to it's track
    draw() {
        let track = this.velocity.heading();
        push();
        translate(this.x, this.y);
        rotate(45);
        rotate(track);
        imageMode(CENTER);
        image(planeImg, 20, 20);
        pop();
    }

    // Checks whether plane is outside of canvas
    outsideCanvas() {
        if (this.x < -20 || this.x > windowWidth + 20 || this.y < -20 || this.y > windowHeight + 20)
            return true;
        return false;
    }

    // Resets plane properties to enter screen again
    reset() {
        this.entry = outsideCoords();
        this.x = this.entry.x;
        this.y = this.entry.y;
        this.exit = outsideCoords();
        this.waypoint = waypoints[Math.floor(Math.random() * wp_len)];
        let dx = this.waypoint.x - this.entry.x;
        let dy = this.waypoint.y - this.entry.y;
        this.velocity = normalizeVector(createVector(dx,dy));
    }
}