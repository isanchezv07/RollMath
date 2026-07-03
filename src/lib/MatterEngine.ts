import {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Composite,
    Events,
    type Engine as MatterEngineType,
    type Render as MatterRender,
    type Runner as MatterRunner,
    Body as MatterBody,
  } from "matter-js";
  
  import Ball from "../components/Ball";
  import Hole from "../components/Hole";
  import Board from "../components/Board";
  import Gyroscope from "./Gyroscope";
  import Calculator from "./Calculator";
  import { type LevelManager } from "./LevelManager";
  import { gameBus } from "./GameEventBus";
  
  export default class MatterEngine {
    engine: MatterEngineType;
    world: Matter.World;
    render: MatterRender;
    runner: MatterRunner;
  
    canvas: HTMLCanvasElement;
  
    board!: Board;
    gyro: Gyroscope;
    calculator: Calculator;
    levelManager: LevelManager;
  
    balls: Ball[] = [];
    holes: Hole[] = [];
  
    constructor(canvas: HTMLCanvasElement, levelManager: LevelManager) {
      this.canvas = canvas;
      this.levelManager = levelManager;
  
      this.engine = Engine.create();
  
      this.world = this.engine.world;
  
      this.runner = Runner.create();
  
      this.render = Render.create({
        canvas,
        engine: this.engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: false,
          background: "transparent",
        },
      });
  
      this.gyro = new Gyroscope();
  
      this.calculator = new Calculator();
    }
  
    async start() {
      this.createWalls();
  
      this.loadLevel();
  
      Render.run(this.render);
  
      Runner.run(this.runner, this.engine);
  
      this.loop();
  
      Events.on(this.engine, "beforeUpdate", () => {
        if (!this.board) return;
        
        for (const spinner of this.board.spinners) {
            MatterBody.setAngle(spinner.body, spinner.body.angle + spinner.speed);
        }
        
        for (const fan of this.board.fans) {
            for (const ball of this.balls) {
                const dx = ball.body.position.x - fan.body.position.x;
                const dy = ball.body.position.y - fan.body.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const forceX = Math.cos(fan.angle) * fan.speed * 0.005;
                    const forceY = Math.sin(fan.angle) * fan.speed * 0.005;
                    MatterBody.applyForce(ball.body, ball.body.position, { x: forceX, y: forceY });
                }
            }
        }
      });

      Events.on(this.engine, "collisionStart", (event) => {
        this.handleCollision(event.pairs);
      });

      Events.on(this.render, "afterRender", () => {
        const ctx = this.render.context;
        const isMobile = window.innerWidth < 600;
        const fontSize = isMobile ? "16px monospace" : "20px monospace";
        const yOffset = isMobile ? 30 : 40;
        
        ctx.font = fontSize;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const hole of this.holes) {
          ctx.fillText(hole.value, hole.x, hole.y - yOffset);
        }
      });

      document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target && target.closest("#next-level-btn")) {
            try {
                document.getElementById("level-complete-modal")?.classList.add("hidden");
                if(this.levelManager.next()) {
                    this.loadLevel();
                } else {
                    alert("Game Complete!");
                }
            } catch (err: any) {
                alert("Error loading next level: " + err.message);
            }
        }
      });
    }
  
    private loop = () => {
      this.gyro.update();
  
      this.engine.gravity.x = this.gyro.gravityX;
  
      this.engine.gravity.y = this.gyro.gravityY;
  
      requestAnimationFrame(this.loop);
    };
  
    spawnBall() {
      const ball = new Ball(
        window.innerWidth / 2,
        80,
        20,
        false
      );

      World.add(this.world, ball.body);
      this.balls.push(ball);
    }
  
    spawnMiniBall() {
      const ball = new Ball(
        window.innerWidth / 2,
        80,
        10,
        true
      );
  
      World.add(this.world, ball.body);
      this.balls.push(ball);
    }

    private createWalls() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = 80;
  
      const walls = [
        Bodies.rectangle(w / 2, -t / 2, w, t, { isStatic: true }),
        Bodies.rectangle(w / 2, h + t / 2, w, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, h / 2, t, h, { isStatic: true }),
        Bodies.rectangle(w + t / 2, h / 2, t, h, { isStatic: true }),
      ];

      World.add(this.world, walls);
    }

    public loadLevel() {
      if (this.board) {
        World.remove(this.world, this.holes.map(h => h.body));
        World.remove(this.world, this.board.obstacles);
      }
      
      this.calculator.clear();
      this.updateDisplay();

      const currentLevel = this.levelManager.current;
      this.board = new Board(currentLevel.entities);

      this.holes = this.board.holes;
      World.add(this.world, this.holes.map(hole => hole.body));
      World.add(this.world, this.board.obstacles);

      this.updateProgressUI();
    }

    private updateProgressUI() {
      const currentLevel = this.levelManager.current;
      gameBus.emit("ui:updateProgress", {
        current: this.levelManager.progress,
        goal: currentLevel.goal,
        name: currentLevel.name,
        description: currentLevel.description
      });
    }

    private updateDisplay(){
      const display = document.getElementById("calculator-display");

      if(!display) return;
      
      display.textContent = this.calculator.getDisplay();
    }
  
    private processed = new Set<string>();

    private handleCollision(pairs: any[]) {
      for (const pair of pairs) {
        const a = pair.bodyA.label;
        const b = pair.bodyB.label;
  
        if (a.startsWith("hole:") && b.endsWith("ball")) {
          this.ballIntoHole(pair.bodyB, pair.bodyA);
        }
  
        if (b.startsWith("hole:") && a.endsWith("ball")) {
          this.ballIntoHole(pair.bodyA, pair.bodyB);
        }

        const id = pair.bodyA.id + "-" + pair.bodyB.id;
        if(this.processed.has(id)) continue;

        this.processed.add(id);
        setTimeout(() => this.processed.delete(id), 100);
      }
    }
  
    private ballIntoHole(ballBody: MatterBody, holeBody: MatterBody) {
      const value = holeBody.label.replace("hole:", "");
      const isMiniBall = ballBody.label === "mini-ball";

      if (isMiniBall && value !== "C") {
          return;
      }
      
      if (!isMiniBall && value === "C") {
          return;
      }

      switch(value){
        case "=":
          const res = this.calculator.solve();
          if (res !== "Error" && res !== "") {
            this.levelManager.addProgress();
            this.updateProgressUI();
            if (this.levelManager.isLevelComplete()) {
              gameBus.emit("ui:levelComplete", undefined as void);
            }
          }
          break;
        case "C":
          this.calculator.clear();
          break;
        default:
          this.calculator.append(value);
          break;
      }
      this.updateDisplay();
      Composite.remove(this.world, ballBody);

      this.balls = this.balls.filter(
        (ball) => ball. body.id !== ballBody.id
      );
    }
  
    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
  
      this.render.canvas.width = w;
      this.render.canvas.height = h;
  
      this.render.options.width = w;
      this.render.options.height = h;

      Render.setPixelRatio(this.render, window.devicePixelRatio);
    }
  }