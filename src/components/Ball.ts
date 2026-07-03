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
            restitution: 0.55,
            friction: 0.02,
            frictionAir: 0.015,
            density: mini ? 0.002 : 0.004,
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