export class Particle {
    constructor(p5) {
        this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.maxspeed = 2;
        this.scl = 20;
        this.cols = p5.floor(p5.width / this.scl);

        this.prevPos = this.pos.copy();

        this.update = function () {
            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        };

        this.applyForce = function (force) {
            this.acc.add(force);
        };

        this.show = function () {
            p5.strokeWeight(7);
            p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
            this.updatePrev();
        };

        this.inverseConstrain = function (pos, key, f, t) {
            if (pos[key] < f) {
                pos[key] = t;
                this.updatePrev();
            }
            if (pos[key] > t) {
                pos[key] = f;
                this.updatePrev();
            }
        };

        this.updatePrev = function () {
            this.prevPos.x = this.pos.x;
            this.prevPos.y = this.pos.y;
        };

        this.edges = function () {
            this.inverseConstrain(this.pos, 'x', 0, p5.width);
            this.inverseConstrain(this.pos, 'y', 0, p5.height);
        };

        this.follow = function (vectors) {
            let x = p5.floor(this.pos.x / this.scl);
            let y = p5.floor(this.pos.y / this.scl);
            let index = x + y * this.cols;
            let force = vectors[index];
            this.applyForce(force);
            p5.stroke(p5.color(150, 150, 255, 240)); //150,150,255,140
        };
    }
}