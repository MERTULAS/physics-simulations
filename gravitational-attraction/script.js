let canvas = document.getElementById("canvas1");
let getBoundingRect = canvas.getBoundingClientRect();
canvas.width = getBoundingRect.width;
canvas.height = getBoundingRect.height;
let ctx = canvas.getContext("2d");

class Planet{
    constructor(x, y, r, mass, velocity){
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.vel = {
            x: velocity,
            y: 0
        };
        this.radius = r;
    }

    setColor(){
        ctx.fillStyle = "white";
    }

    draw(){
        this.setColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class BlackHole extends Planet{
    constructor(x, y, r, mass){
        super(x, y, r, mass)
        this.x = x;
        this.y = y;
        this.radius = r;
        this.mass = mass;
        this.G = 800;
        this.angular = 0;
    }

    setColor(){
        ctx.fillStyle = "yellow";
    }

    orbitalMovement(){
        this.angular++;
        this.angular %= 360;
        this.x += Math.cos(this.angular * Math.PI / 180) * 2;
        this.y += Math.sin(this.angular * Math.PI / 180) * 2;
    }

    draw(){
        this.orbitalMovement();
        super.draw();
    }

    gravitationalForce(planet){
        let distance = Math.pow(this.x - planet.x, 2) + Math.pow(this.y - planet.y, 2);
        let multiplicationOfMasses = this.mass * planet.mass;
        let multiplicationWithG = multiplicationOfMasses * this.G;
        let force = multiplicationWithG / distance;
        return [force, distance];
    }

    attraction(planet){
        let [force, distance] = this.gravitationalForce(planet);
        let directionX = (this.x - planet.x) / Math.sqrt(distance);
        let directionY = (this.y - planet.y) / Math.sqrt(distance);
        let forceX = force * directionX;
        let forceY = force * directionY;
        planet.vel.x += forceX;
        planet.vel.y += forceY;
        planet.x += planet.vel.x;
        planet.y += planet.vel.y;
    }

}

let galaxy = [];
let blackHoles = [];

function draws(...celestials) {
    celestials.forEach(celestial => celestial.draw());
}

canvas.addEventListener("click", (e) => {
    galaxy.push(new Planet(e.offsetX, e.offsetY, 20, 5, 8.2));
});

canvas.addEventListener("contextmenu", (e) => {
    blackHoles.push(new BlackHole(e.offsetX, e.offsetY, 20, 10));
});

function simulation(){
    ctx.fillStyle = "rgba(43, 42, 41, 0.7)";
    ctx.fillRect(0, 0, 930, 930);
    galaxy.forEach((planet) => {
        blackHoles.forEach((blackHole) => {
            blackHole.attraction(planet);
        })
    });
    draws(...blackHoles, ...galaxy);
    requestAnimationFrame(simulation);
}

simulation();
