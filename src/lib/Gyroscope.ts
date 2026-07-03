export default class Gyroscope {
    gravityX = 0;
    gravityY = 1;

    sensitivity = 1.8;
    smoothing = 0.15;

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
        });

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

        window.addEventListener(
            "deviceorientation",
            this.boundHandler
        );

        return true;
    }
    private handleOrientation(event: DeviceOrientationEvent){
        if (this.isTouchMode) return;
        if (event.gamma === null || event.beta === null) return;
        
        this.targetX = (event.gamma / 45) * this.sensitivity;
        this.targetY = (event.beta / 45) * this.sensitivity;
    }
    update(){
        this.gravityX +=
            (this.targetX - this.gravityX) * this.smoothing;
        
        this.gravityY +=
            (this.targetY - this.gravityY) * this.smoothing;
    }
}