import type { LevelConfig } from "../levels/types";

export class LevelManager {
    currentId = 1;
    progress = 0;

    get current() {
        return {
            id: this.currentId
        };
    }

    addProgress() {
        this.progress++;
    }

    isLevelComplete(goal: number) {
        return this.progress >= goal;
    }

    next() {
        this.currentId++;
        this.progress = 0;
        return true;
    }
}