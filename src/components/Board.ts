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
    public fans: { body: Body, angle: number, speed: number; length: number; width: number; }[] = [];
    
    constructor(entities: EntityBlueprint[]){
        const BASE_WIDTH = 700;
        const BASE_HEIGHT = 1000;
        
        const scaleX = typeof window !== "undefined" ? window.innerWidth / BASE_WIDTH : 1;
        const scaleY = typeof window !== "undefined" ? window.innerHeight / BASE_HEIGHT : 1;
        const scaleMin = Math.min(scaleX, scaleY);

        for(const blueprint of entities){
            const x = blueprint.x * scaleX;
            const y = blueprint.y * scaleY;

            switch (blueprint.type){
                case "hole": {
                    const value = blueprint.options?.value || "0";
                    const radius = (blueprint.options?.radius || 25) * scaleMin;

                    const hole = new Hole(x, y, radius, value);
                    this.holes.push(hole);
                    break;
                }
                case "wall": {
                    const w = (blueprint.options?.width || 100) * scaleX;
                    const h = (blueprint.options?.height || 20) * scaleY;
                    const angle = blueprint.options?.angle || 0;

                    const wallBody = Bodies.rectangle(x, y, w, h, {
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
                    const radius = (blueprint.options?.radius || 50) * scaleMin;
                    const angle = blueprint.options?.angle || 0;
                    
                    const rampBody = Bodies.polygon(x, y, 3, radius, {
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
                    const w = (blueprint.options?.radius || 50) * 2 * scaleMin;
                    const h = 15 * scaleMin;
                    const speed = blueprint.options?.speed || 0.05;
                    
                    const spinnerBody = Bodies.rectangle(x, y, w, h, {
                        isStatic: true,
                        label: "obstacle:spinner",
                        render: { fillStyle: "#f59e0b" }
                    });
                    this.spinners.push({ body: spinnerBody, speed });
                    this.obstacles.push(spinnerBody);
                    break;
                }
                case "fan": {
                    const angle = blueprint.options?.angle ?? 0;
                    const speed = blueprint.options?.speed  ?? 0.00005;
                    const length = (blueprint.options?.length ?? 250) * scaleMin;
                    const width = (blueprint.options?.width ?? 80) * scaleMin;

                    const fanRadius = 20 * scaleMin;

                    const fanBody = Bodies.circle(x, y, fanRadius, {
                        isStatic: true,
                        isSensor: true,
                        label: "obstacle:fan",
                        render: {
                            visible: false
                        }
                    });

                    this.fans.push({
                        body: fanBody,
                        angle,
                        speed,
                        length,
                        width
                    });
                    this.obstacles.push(fanBody);
                    break;
                }
            }
        }
    }
}