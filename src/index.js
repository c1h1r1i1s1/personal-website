import React from 'react';
import ReactDOM from 'react-dom/client';
import Sketch from "react-p5";
import {Particle} from "./particle.js";
import './index.css';

class App extends React.Component {

  stepSizes = {
    x: 0.01,
    y: 0.01,
    z: 0.005,
    m: 0.0005
  };
  zoff = 0;
  magOff = 0;
  rows;
  cols;
  angle;
  m;
  start = 0;
  scl = 20;

  updated = false;

  numParticles = 400;
  particles = [];
  flowfield;

  constructor(props){
    super(props); 
    this.state = {
        height: window.innerHeight,
        width: window.innerWidth,
    }
    this.updateDimensions = this.updateDimensions.bind(this);
    this.resizeMethod = this.resizeMethod.bind(this);
  };

  componentDidMount(){
    window.addEventListener('resize', this.resizeMethod);
  };

  updateDimensions() {
    this.setState({
       height: window.innerHeight,
       width: window.innerWidth
     });
  };

  resizeMethod(){
    this.updateDimensions();
    this.updated = true;
  };

  draw = (p5) => {
    if (this.updated) {
      this.updated = false;
      p5.resizeCanvas(this.state.width, this.state.height);
    }
    p5.background(p5.color(0, 0, 0, 100));

    // loop over grid to calculate noise
    let yoff = this.start;
    for (let y = 0; y < this.rows; y++) {
        let xoff = this.start;
        for (let x = 0; x < this.cols; x++) {
            let index = x + y * this.cols;
            let angle = p5.noise(xoff, yoff, this.zoff) * p5.TWO_PI;
            let xBit = Math.cos(angle);
            let yBit = Math.sin(angle);
            let v = p5.createVector(xBit, yBit);
            let m = p5.map(p5.noise(xoff, yoff, this.magOff), 0, 1, -5, 5);
            v.setMag(m);

            p5.push();
            p5.stroke(255);
            p5.translate(x * this.scl, y * this.scl);
            p5.rotate(v.heading());
            // let endpoint = p5.abs(m) * this.scl;
            // p5.line(0, 0, endpoint, 0);
            // if (m < 0) {
            //   p5.stroke('red');
            // } else {
            //   p5.stroke('green');
            // }
            // p5.line(endpoint - 2, 0, endpoint, 0);
            p5.pop();

            this.flowfield[index] = v;

            xoff += this.stepSizes.x;
        }
        yoff += this.stepSizes.y;
    }
    this.magOff += this.stepSizes.m;
    this.zoff += this.stepSizes.z;
    this.start -= this.stepSizes.m;

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].follow(this.flowfield);
      this.particles[i].update();
      this.particles[i].edges();
      this.particles[i].show();
    }

    if (p5.random(10) > 5 && this.particles.length < 500) {
      let rnd = p5.floor(p5.noise(this.zoff) * 20);
      for (let i = 0; i < rnd; i++) {
        this.particles.push(new Particle(p5));
      }
    } else if (this.particles.length > 400) {
      let rnd = p5.floor(p5.random(10));
      for (let i = 0; i < rnd; i++) {
        this.particles.shift();
      }
    }
  }

	setup = (p5, parentRef) => {
		// p5.createCanvas(window.innerWidth, window.innerHeight).parent(parentRef);
    p5.createCanvas(this.state.width, this.state.height).parent(parentRef);
		p5.background(0);
    
    p5.pixelDensity(1);
    this.cols = p5.floor(p5.width / this.scl);
    this.rows = p5.floor(p5.height / this.scl);
    this.flowfield = new Array(this.rows * this.cols);
    this.particles = new Array(this.numParticles);
    for (let i = 0; i < this.numParticles; i++) {
      this.particles[i] = new Particle(p5);
    }

    this.flowfield = new Array(this.rows * this.cols);
	};

	render() {
		return (
			<div className="App">
				<Sketch setup={this.setup} draw={this.draw} />
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);