"use strict";

const RADIUS = 20;

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;
const center_x = width / 2;
const center_y = height / 2;

context.moveTo(center_x, center_y);

// VARIABLES
let spiral_type = "archemedian";
let a = 3;
let b = 1;
let points = 500;
let theta = 1;
let REFRESH_RATE = 70;

/*
    Spirals are represented better with polar coordinates. 
    Unlike carthesian coordinaes, where for a point on a 2d place we have two components, x and y,
    for polar coordinats a point is defined by:
        1. r = radius
            This is the distance of the points from the reference point(for the sake of example it can be origin (0, 0))
        2. theta = angle
            The angle, an imaginary line drawn from the reference point to the current point would make.

    We can convert from polar coordinates to carthesian coordinates by applying the following formulas:
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
    
*/

/*
    The Archemedian Spiral is defined by:
        r = theta
*/
class ArchimedianSpiral {
    constructor(resolution, a, theta) {
        this.points = [];

        for (let i = 0; i < resolution; i++) {
            // polar coordinats
            // the angle must be given by a monothonic increasing function
            let angle = theta * i;
            let r = a * angle;

            // convert polar coordinats to carthesian coordinas
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);

            // adjust to reference point (center of the canvas)
            x += center_x;
            y += center_y;

            this.points.push(new Point(x, y, RADIUS));
        }
    }

    draw(context) {
        for (let point of this.points) {
            point.draw(context);
        }
    }

    rotate(angle) {
        this.points = this.points.map(point => point.rotate(angle));
    }
}

/*
    The Hyperbolic Spiral is defined by:
        r = a/theta
*/
class HyperbolicSpiral {
    constructor(resolution, a, theta) {
        this.points = [];

        for (let i = 0; i < resolution; i++) {
            // polar coordinats
            let angle = theta * i;
            let r = a / angle;

            // convert polar coordinats to carthesian coordinas
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);

            // adjust to reference point (center of the canvas)
            x += center_x;
            y += center_y;

            this.points.push(new Point(x, y, RADIUS));
        }
    }

    draw(context) {
        for (let point of this.points) {
            point.draw(context);
        }
    }

    rotate(angle) {
        this.points = this.points.map(point => point.rotate(angle));
    }
}

/*
    The Hyperbolic Spiral is defined by:
        r = a * exp(b * theta)
*/
class LogarithmicSpiral {
    constructor(resolution, a, theta) {
        this.points = [];

        for (let i = 0; i < resolution; i++) {
            // polar coordinats
            let angle = Math.exp(theta * i);
            let r = a * angle;

            // convert polar coordinats to carthesian coordinas
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);

            // adjust to reference point (center of the canvas)
            x += center_x;
            y += center_y;

            this.points.push(new Point(x, y, RADIUS));
        }
    }

    draw(context) {
        for (let point of this.points) {
            point.draw(context);
        }
    }

    rotate(angle) {
        this.points = this.points.map(point => point.rotate(angle));
    }
}

class Point {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    equals(other_point) {
        return Math.abs(this.x - other_point.x) < 0.00000001 &&
            Math.abs(this.y - other_point.y) < 0.00000001;
    }

    toString() {
        return `Point(${this.x}, ${this.y})`;
    }

    rotate(angle) {
        const radians = (Math.PI / 180) * angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const new_x = (cos * (this.x - center_x)) + (sin * (this.y - center_y)) + center_x;
        const new_y = (cos * (this.y - center_y)) - (sin * (this.x - center_x)) + center_y;
        return new Point(new_x, new_y, RADIUS);
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.closePath();
        context.fill();
    }
}

const archimedianSpiral = new ArchimedianSpiral(points, a, b);
archimedianSpiral.draw(context);

// set callbacks
document.getElementById("a").oninput = function () {
    a = this.value;
    refresh();
}

document.getElementById("b").oninput = function () {
    b = this.value;
    refresh();
}

document.getElementById("points").oninput = function () {
    points = this.value;
    refresh();
}

document.getElementById("theta").oninput = function () {
    console.log(`theta ${theta}`);
    theta = this.value;
    refresh();
}

document.getElementById("spiral").oninput = function () {
    spiral_type = this.value;
    refresh();
}

function clear_canvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

let intervalId;

function refresh() {
    clear_canvas();
    let spiral;
    switch (spiral_type) {
        case "archemedian":
            document.getElementById("b").disabled = true;
            console.log(`instatiating archemedian with ${a} and ${points} points and ${theta}`);
            spiral = new ArchimedianSpiral(points, a, theta);
            break;
        case "hyperbolic":
            document.getElementById("b").disabled = true;
            console.log(`instatiating hyperbolic with ${a} and ${points} points and ${theta}`);
            spiral = new HyperbolicSpiral(points, a, theta);
            break;
        case "logarithmic":
            document.getElementById("b").disabled = true;
            console.log(`instatiating logarithmic with ${a} and ${points} points and ${theta}`);
            spiral = new LogarithmicSpiral(points, a, theta);
            break;
    }
    spiral.draw(context);

    clearInterval(intervalId);
    intervalId = setInterval(function () {
        clear_canvas();
        spiral.rotate(Math.PI / 2);
        spiral.draw(context);
    }, REFRESH_RATE);
}

refresh();