let canvas = document.getElementById("canvas1");
let getBoundingRect = canvas.getBoundingClientRect();
canvas.width = getBoundingRect.width;
canvas.height = getBoundingRect.height;
let ctx = canvas.getContext("2d");

class Particle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 5;
        this.velocityX = Math.random() * 5 - 2.5;
        this.velocityY = Math.random() * 5 - 2.5;
        this.visibility = true;
        this.brightness = 1;
    }

    particles(target){
        let distance = Math.sqrt(Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2));
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityX += (target.x - this.x) / distance;
        this.velocityY += (target.y - this.y) / distance;
        this.draw();
    }

    draw(){
        ctx.fillStyle = `rgba(0, 0, 0, ${this.brightness})`
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        this.brightness -= 0.05;
        this.visibility = this.brightness <= 0 ? 0 : 1;
    }
}

let particle = new Particle(500, 500);

let mouse = {
    x: 450,
    y: 450
}

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

let particles = [];

function createParticles(numberOfParticles){
    for(let i = 0; i < numberOfParticles; i++){
        particles.push(new Particle(500, 500));
    }
} 

function simulation(){
    ctx.fillStyle = "rgba(43, 42, 41, 0.7)";
    ctx.fillRect(0, 0, 930, 930);
    particles.forEach((particle, index) => {
        particle.particles(mouse);
        if (!particle.visibility) {
            particles.splice(index, 1)
            particles.push(new Particle(500, 500))
        };
    })
    requestAnimationFrame(simulation);
}

createParticles(1000);
simulation();
