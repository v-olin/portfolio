let flock;
const color = [255, 255, 255];

function setup() {
    
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("background");
    canvas.style("z-index", "-1");
    canvas.position(0, 0);
    fill(0, 102, 153);

    flock = new Flock();

    for (let i = 0; i < 50; i++) {
        let b = new Boid(0, 0, color);
        flock.addBoid(b);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
}

function draw() {
    background(0,0,0);
    if (windowWidth > 600) {
        flock.run();
    }
}

// Add a new boid into the System
function mouseDragged() {
    flock.boids.shift();
    flock.addBoid(new Boid(mouseX, mouseY, color));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

class Flock {
    constructor() {
        this.boids = []
    }

    run() {
        for (let i = 0; i < this.boids.length; i++) {
            this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
        }
    }

    addBoid(boid) {
        this.boids.push(boid);
    }
}


// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

class Boid {
    constructor(x, y, color) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.position = createVector(x, y);
        this.r = 3.0;
        this.maxspeed = 3;    // Maximum speed
        this.maxforce = 0.05; // Maximum steering force
        this.color = color;
    }

    run(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.draw();
    }

    applyForce(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    // the important part
    // We accumulate a new acceleration each time based on three rules
    flock(boids) {
        let sep = this.separate(boids);   // Separation
        let ali = this.align(boids);      // Alignment
        let coh = this.cohesion(boids);   // Cohesion
        // Arbitrarily weight these forces
        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    // Method to update location
    update() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        let desired = p5.Vector.sub(target, this.position);  // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);  // Limit to maximum steering force
        return steer;
    }

    draw() {
        // Draw a triangle rotated in the direction of velocity
        let angle = this.velocity.heading() + radians(90);
        fill(this.color[0], this.color[1], this.color[2]);
        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        beginShape();
        noStroke();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r * 2, this.r * 2);
        endShape(CLOSE);
        pop();
        fill(4, 105, 159);

    }

    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

    // Separation
    // Method checks for nearby boids and steers away   
    separate(boids) {
        let desiredseparation = 25.0;
        let steer = createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, boids[i].position);
                diff.normalize();
                diff.div(d);        // Weight by distance
                steer.add(diff);
                count++;            // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.velocity);
            steer.limit(this.maxforce);
        }
        return steer;
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boids) {
        let neighbordist = 50;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(boids[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohesion(boids) {
        let neighbordist = 50;
        let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(boids[i].position); // Add location
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum);  // Steer towards the location
        } else {
            return createVector(0, 0);
        }
    }
}



