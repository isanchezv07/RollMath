import { Bodies, type Body } from "matter-js";
import type { EntityBlueprint } from "../levels/types";
import Hole from "./Hole";

export interface ConfiguredObstacle {
    type: string;
    body: Body;
}

export default class Board {
    public holes: Hole[] = [];
    public obstacles: Body[] = [];
    public spinners: { body: Body, speed: number }[] = [];
    public fans: { body: Body, angle: number, speed: number }[] = [];
    
    constructor(entities: EntityBlueprint[]){
        for(const blueprint of entities){
            switch (blueprint.type){
                case "hole": {
                    const value = blueprint.options?.value || "0";
                    const radius = blueprint.options?.radius || 25;

                    const hole = new Hole(blueprint.x, blueprint.y, radius, value);
                    this.holes.push(hole);
                    break;
                }
                case "wall": {
                    const w = blueprint.options?.width || 100;
                    const h = blueprint.options?.height || 20;
                    const angle = blueprint.options?.angle || 0;

                    const wallBody = Bodies.rectangle(blueprint.x, blueprint.y, w, h, {
                        isStatic: true,
                        label: "obstacle:wall",
                        angle: angle,
                        render: { fillStyle: "#64748b" }
                    });
                    this.obstacles.push(wallBody);
                    break;
                }
                case "ramp": {
                    // A ramp is essentially a polygon (triangle)
                    const radius = blueprint.options?.radius || 50;
                    const angle = blueprint.options?.angle || 0;
                    
                    const rampBody = Bodies.polygon(blueprint.x, blueprint.y, 3, radius, {
                        isStatic: true,
                        angle: angle,
                        label: "obstacle:ramp",
                        render: { fillStyle: "#8b5cf6" }
                    });
                    this.obstacles.push(rampBody);
                    break;
                }
                case "spinner": {
                    // A spinner can be a long rectangle
                    const w = (blueprint.options?.radius || 50) * 2;
                    const h = 15;
                    const speed = blueprint.options?.speed || 0.05;
                    
                    const spinnerBody = Bodies.rectangle(blueprint.x, blueprint.y, w, h, {
                        isStatic: true,
                        label: "obstacle:spinner",
                        render: { fillStyle: "#f59e0b" }
                    });
                    this.spinners.push({ body: spinnerBody, speed });
                    this.obstacles.push(spinnerBody);
                    break;
                }
                case "fan": {
                    const angle = blueprint.options?.angle || 0;
                    const speed = blueprint.options?.speed || 0.1;
                    
                    // Render the fan as a small circle source
                    const fanBody = Bodies.circle(blueprint.x, blueprint.y, 20, {
                        isStatic: true,
                        isSensor: true,
                        label: "obstacle:fan",
                        render: { fillStyle: "#0ea5e9" }
                    });
                    this.fans.push({ body: fanBody, angle, speed });
                    this.obstacles.push(fanBody);
                    break;
                }
            }
        }
    }
}