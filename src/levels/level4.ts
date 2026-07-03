import type { LevelConfig } from "./types";

export const level4: LevelConfig = {
    id: 4,
    name: "The Ultimate Calculator",
    description: "Every number and sign! Form a sequence to reach the ultimate answer.",
    goal: 42,
    entities: [
        // Numbers 0-9
        { type: "hole", x: 150, y: 150, options: { value: "0" }},
        { type: "hole", x: 250, y: 150, options: { value: "1" }},
        { type: "hole", x: 350, y: 150, options: { value: "2" }},
        { type: "hole", x: 450, y: 150, options: { value: "3" }},
        { type: "hole", x: 550, y: 150, options: { value: "4" }},
        { type: "hole", x: 150, y: 250, options: { value: "5" }},
        { type: "hole", x: 250, y: 250, options: { value: "6" }},
        { type: "hole", x: 350, y: 250, options: { value: "7" }},
        { type: "hole", x: 450, y: 250, options: { value: "8" }},
        { type: "hole", x: 550, y: 250, options: { value: "9" }},

        // Signs
        { type: "hole", x: 150, y: 400, options: { value: "+" }},
        { type: "hole", x: 250, y: 400, options: { value: "-" }},
        { type: "hole", x: 350, y: 400, options: { value: "*" }},
        { type: "hole", x: 450, y: 400, options: { value: "/" }},

        // Actions
        { type: "hole", x: 300, y: 600, options: { value: "=" }},
        { type: "hole", x: 400, y: 600, options: { value: "C" }},

        // Obstacles
        { type: "spinner", x: 200, y: 500, options: { speed: 0.08, radius: 80 }},
        { type: "spinner", x: 500, y: 500, options: { speed: -0.08, radius: 80 }},
        { type: "fan", x: 350, y: 800, options: { angle: -1.57, speed: 0.1 }},
        { type: "wall", x: 350, y: 325, options: { width: 500, height: 10, angle: 0 }},
    ]
};
