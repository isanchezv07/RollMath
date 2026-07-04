import type { LevelConfig, EntityBlueprint } from "./types";

const NUMBERS = ["0","1","2","3","4","5","6","7","8","9"];
const SIGNS = ["+","-","*","/","=","C"];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

interface PlacedEntity {
    x: number;
    y: number;
    r: number;
}

function hasOverlap(x: number, y: number, r: number, placed: PlacedEntity[]): boolean {
    for (const p of placed) {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < p.r + r) {
            return true;
        }
    }
    return false;
}

export function generateLevel(id: number): LevelConfig {
    const entities: EntityBlueprint[] = [];
    const placed: PlacedEntity[] = [];
    
    // Use the base coordinate system that Board.ts expects (700 x 1000)
    const w = 700;
    const h = 1000;

    const findValidPosition = (r: number, maxAttempts = 100): {x: number, y: number} | null => {
        for (let i = 0; i < maxAttempts; i++) {
            const x = rand(r + 20, w - r - 20);
            // Leaving 150px at the top for UI, 80px at bottom
            const y = rand(150 + r, h - r - 80);
            if (!hasOverlap(x, y, r, placed)) {
                placed.push({ x, y, r });
                return { x, y };
            }
        }
        return null;
    };

    // Obligatorio todos los números y signos con posición aleatoria y sin encimarse
    [...NUMBERS, ...SIGNS].forEach((val) => {
        const pos = findValidPosition(40);
        if (pos) {
            entities.push({
                type: "hole",
                x: pos.x,
                y: pos.y,
                options: { value: val }
            });
        } else {
            // Fallback en caso extremadamente raro de que no encuentre hueco en 100 intentos
            entities.push({
                type: "hole",
                x: rand(50, w - 50),
                y: rand(150, h - 100),
                options: { value: val }
            });
        }
    });

    const difficulty = Math.min(id, 10);
    
    // Todo lo demás aleatorio (número de entidades y sus opciones)
    
    // Walls
    const numWalls = Math.floor(rand(0, 3 + difficulty));
    for(let i = 0; i < numWalls; i++){
        const width = rand(100, w * 0.6);
        const height = rand(10, 30);
        // El radio efectivo para evitar colisiones se basa en la diagonal
        const r = Math.sqrt((width/2)**2 + (height/2)**2) + 10;

        const pos = findValidPosition(r, 50);
        if (pos) {
            entities.push({
                type: "wall",
                x: pos.x,
                y: pos.y,
                options: {
                    width,
                    height,
                    angle: rand(-Math.PI, Math.PI)
                }
            });
        }
    }

    // Spinners
    const numSpinners = Math.floor(rand(0, 2 + difficulty));
    for(let i = 0; i < numSpinners; i++){
        const radius = rand(40, 100);
        const r = radius + 20;

        const pos = findValidPosition(r, 50);
        if (pos) {
            entities.push({
                type: "spinner",
                x: pos.x,
                y: pos.y,
                options: {
                    speed: rand(0.01, 0.05 + difficulty * 0.005) * (Math.random() > 0.5 ? 1 : -1),
                    radius
                }
            });
        }
    }

    // Fans
    const numFans = Math.floor(rand(0, 2 + difficulty));
    for(let i = 0; i < numFans; i++){
        const r = 40; // El cuerpo base del ventilador
        const pos = findValidPosition(r, 50);
        if (pos) {
            entities.push({
                type: "fan",
                x: pos.x,
                y: pos.y,
                options: {
                    angle: rand(-Math.PI, Math.PI),
                    speed: rand(0.00002, 0.00008 + difficulty * 0.00002),
                    length: rand(150, 400),
                    width: rand(80, 200)
                }
            });
        }
    }

    return {
        id,
        name: `Level ${id}`,
        description: "Survive the chaos and solve the expression.",
        goal: Math.floor(rand(1, 3 + Math.floor(difficulty / 2))),
        entities
    };
}