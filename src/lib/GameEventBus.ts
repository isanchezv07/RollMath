export type GameEvents = {
    "ui:updateDisplay": { text: string };
    "ui:updateProgress": { current: number; goal: number; name: string; description?: string };
    "ui:levelComplete": void;
    "game:next-level": void;
  };
  
  type Callback<T> = (data: T) => void;
  
  class GameEventBus {
    private listeners: { [K in keyof GameEvents]?: Callback<GameEvents[K]>[] } = {};
  
    on<K extends keyof GameEvents>(event: K, cb: Callback<GameEvents[K]>) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event]!.push(cb);
    }
  
    emit<K extends keyof GameEvents>(event: K, data: GameEvents[K]) {
      this.listeners[event]?.forEach((cb) => cb(data));
    }
}
  
export const gameBus = new GameEventBus();