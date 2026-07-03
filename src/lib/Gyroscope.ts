export default class Gyroscope {
    gravityX = 0;
    gravityY = 1;

    sensitivity = 1.8;
    smoothing = 0.15;

    private targetX = 0;
    private targetY = 1;

    async start(){
        if(
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof (DeviceOrientationEvent as any).requestPermission === "function"
        ){
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if(permission !== "granted") return false;
        }

        window.addEventListener(
            "deviceorientation",
            this.handleOrientation.bind(this)
        );
        return true;
    }
    private handleOrientation(event: DeviceOrientationEvent){
        const gamma = event.gamma ?? 0;
        const beta = event.beta ?? 0;
        
        this.targetX = (gamma / 45) * this.sensitivity;
        this.targetY = (beta / 45) * this.sensitivity;
    }
    update(){
        this.gravityX +=
            (this.targetX - this.gravityX) * this.smoothing;
        
        this.gravityY +=
            (this.targetY - this.gravityY) * this.smoothing;
    }
}