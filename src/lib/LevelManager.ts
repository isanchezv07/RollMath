import type { LevelConfig } from "../levels/types";

export class LevelManager {
    private levels: LevelConfig[];
    private currentIndex: number = 0;
    private currentProgress: number = 0;

    constructor(levels: LevelConfig[]){
        this.levels = levels;
    }

    public get current(): LevelConfig {
        return this.levels[this.currentIndex];
    }

    public get progress(): number {
        return this.currentProgress;
    }

    public addProgress(){
        this.currentProgress++;
    }

    public resetProgress(){
        this.currentProgress = 0;
    }

    public isLevelComplete(): boolean {
        return this.currentProgress >= this.current.goal;
    }

    public next(): boolean {
        if(this.currentIndex < this.levels.length - 1){
            this.currentIndex++;
            this.resetProgress();
            return true;
        }
        return false;
    }

    public previous(): boolean {
        if(this.currentIndex > 0){
            this.currentIndex--;
            this.resetProgress();
            return true;
        }
        return false;
    }
}