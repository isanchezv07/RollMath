export interface EntityBlueprint {
    type: "hole" | "wall" | "ramp" | "spinner" | "fan";
    x: number;
    y: number;
    options?: {
        value?: string;
        width?: number;
        height?: number;
        angle?: number;
        speed?: number;
        radius?: number;
        length?: number;
    };
}

export interface LevelConfig {
    id: number;
    name: string;
    description: string;
    goal: number;
    entities: EntityBlueprint[];
}