export default class Gyroscope {
    gravityX = 0;
    gravityY = 1;

    sensitivity = 2.2;
    smoothing = 0.12;

    private targetX = 0;
    private targetY = 1;

    private started = false;
    private boundHandler = this.handleOrientation.bind(this);

    private isTouchMode = false;

    async start(){
        if(this.started) return true;
        this.started = true;

        // Register touch fallback immediately
        window.addEventListener("touchmove", (e) => {
            this.isTouchMode = true;
            const touch = e.touches[0];
            if (!touch) return;
            const dx = touch.clientX - window.innerWidth / 2;
            const dy = touch.clientY - window.innerHeight / 2;
            this.targetX = (dx / (window.innerWidth / 2)) * this.sensitivity;
            this.targetY = (dy / (window.innerHeight / 2)) * this.sensitivity;
        }, { passive: true });

        window.addEventListener("touchend", () => {
            this.targetX = 0;
            this.targetY = 1;
            setTimeout(() => { this.isTouchMode = false; }, 500);
        });

        if(
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof (DeviceOrientationEvent as any).requestPermission === "function"
        ){
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if(permission !== "granted") return false;
            } catch (e) {
                console.warn("DeviceOrientation request failed", e);
                return false;
            }
        }

        window.addEventListener("deviceorientation", this.boundHandler);
        return true;
    }
    private handleOrientation(event: DeviceOrientationEvent){
        if (this.isTouchMode) return;
        if (event.beta == null || event.gamma == null) return;    

        const beta = event.beta * Math.PI / 180;
        const gamma = event.gamma * Math.PI / 180;
    
        let tX = Math.sin(gamma) * this.sensitivity;
        let tY = Math.sin(beta) * this.sensitivity;
    
        const curve = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), 1.4);
        tX = curve(tX);
        tY = curve(tY);

        const DEADZONE = 0.015;
        this.targetX = Math.abs(tX) < DEADZONE ? 0 : tX;
        this.targetY = Math.abs(tY) < DEADZONE ? 0 : tY;
    }
    update(){
        const deltaX = this.targetX - this.gravityX;
        const deltaY = this.targetY - this.gravityY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const baseSmoothing = 0.15;
        const dynamicSmoothing = Math.min(baseSmoothing + (distance * 0.35), 0.60);

        this.gravityX += deltaX * dynamicSmoothing;
        this.gravityY += deltaY * dynamicSmoothing;
    }
}