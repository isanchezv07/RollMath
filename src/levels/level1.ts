import type { LevelConfig } from "./types";

export const level1: LevelConfig = {
    id: 1,
    name: "Addition Basics",
    description: "Roll the ball into numbers and operators to make a sum that solves the goal!",
    goal: 5,
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

        // Level 1: No obstacles
    ]
};