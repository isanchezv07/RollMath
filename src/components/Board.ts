import Hole from "./Hole";

export default class Board {
    holes: Hole[] = [];
    
    constructor(){
        const values = [
            "7", "8", "9", "/",
            "4", "5", "6", "*",
            "1", "2", "3", "-",
            "0", "=", "C", "+"
        ];
        const isMobile = window.innerWidth < 600;
        const gap = isMobile ? Math.min(window.innerWidth / 4.5, 110) : 110;
        const radius = isMobile ? gap / 4 : 24;
        const startX = window.innerWidth / 2 - gap * 1.5;
        const startY = (window.innerHeight / 2) - (gap * 1.5) + (isMobile ? gap * 0.5 : 0);
        values.forEach((value, index)=>{
            const col = index%4;
            const row = Math.floor(index/4);
            this.holes.push(
                new Hole(
                    startX+col*gap,
                    startY+row*gap,
                    radius,
                    value
                )
            );
        });
    }
}