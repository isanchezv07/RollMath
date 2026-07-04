import { Bodies, Body } from "matter-js";

export default class Ball {
    body: Body;
    radius: number;
    mini: boolean;

    constructor(
        x: number,
        y: number,
        radius = 20,
        mini = false
    ){
        this.radius = radius;
        this.mini = mini;

        this.body = Bodies.circle(x, y, radius, {
            restitution: mini ? 0.55 : 0.45,
            friction: 0.01,
            frictionAir: 0.01,
            density: mini ? 0.003 : 0.008,
            label: mini ? "mini-ball" : "ball",
            render: {
                fillStyle: mini ? "#ef4444" : "#3b82f6",
            },
        });
    }
    get x(){
        return this.body.position.x;
    }
    get y(){
        return this.body.position.y;
    }
    get velocity(){
        return this.body.velocity;
    }
}