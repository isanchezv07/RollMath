const Matter = require('matter-js');
const engine = Matter.Engine.create();
const ball = Matter.Bodies.circle(0, 0, 20, { density: 0.008 });
Matter.World.add(engine.world, ball);
Matter.Body.applyForce(ball, ball.position, { x: 0.10, y: 0 });
Matter.Engine.update(engine, 16.666);
console.log("Velocity after 1 tick:", ball.velocity);
console.log("Position after 1 tick:", ball.position);
