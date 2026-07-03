import { Bodies, Body} from "matter-js";

export default class Hole {
    body: Body;
    value: string;
    radius: number;

    constructor(
        x: number,
        y: number,
        radius: number,
        value: string
    ){
        this.radius = radius;
        this.value = value;

        this.body = Bodies.circle(
            x,
            y,
            radius,
            {
                isStatic: true,
                isSensor: true,
                label: `hole:${value}`,
                render: {
                    fillStyle: "#18181b",
                    strokeStyle: "#3f3f46",
                    lineWidth: 2
                }
            }
        );
    }
    get x(){
        return this.body.position.x;
    }
    get y(){
        return this.body.position.y;
    }
}