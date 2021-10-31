// ----- Variables --------------------
let waypoints = [];
const wp_len = 10;

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
        airways.push(new Waypoint());
    }

    // generate airplanes
}

// ----- Objects ----------------------
class Waypoint {
    constructor() {
        this.x = Math.floor(Math.random() * windowWidth);
        this.y = Math.floor(Math.random() * windowHeight);
    }
}

class Plane {
    constructor() {
        this.x = 0;
        this.y = 0;

        let x = Math.floor(Math.random() * 4);
        // 0, top
        // 1, right
        // 2, bottom
        // 3, left
        switch (x) {
            case 0:
                
                break;
        
            default:
                break;
        }

        // generate waypoint

        // generate exit
        //      - side
        //      - coord
    }
}