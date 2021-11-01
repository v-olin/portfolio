// ----- Variables --------------------
let waypoints = [];
const wp_len = 10;

let planes = [];
const plane_len = 5;

// ----- Funcs ------------------------
function setup() {
    // set canvas
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvas");
    canvas.style("z-index", "-1");
    canvas.position(0, 0);
    fill(0,0,0);

    // set up waypoints
    for (let i = 0; i < wp_len; i++) {
        waypoints.push(new Waypoint());
    }

    // generate airplanes
    for (let i = 0; i < plane_len; i++) {
        planes.push(new Plane());
    }
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
            // p.borders();
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

    return createVector(x,y);
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
        let angle = this.velocity.heading() + radians(90);
        fill(219, 191, 7);
        // push();
        translate(this.x, this.y);
        rotate(angle);
        image(planeImg, this.x, this.y);
        // beginShape();
        // noStroke();
        // vertex(0, -this.r * 2);
        // vertex(-this.r, this.r * 2);
        // vertex(this.r * 2, this.r * 2);
        // endShape(CLOSE);
        // pop();
        fill(255, 255, 255);
    }

    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }
}