import { useEffect, useRef } from "react";
import "./App.css";
import Phaser from "phaser";
import { BootScene } from "./game/scenes/BootScene";
import { PreloadScene } from "./game/scenes/PreloadScene";
import { GameScene } from "./game/scenes/GameScene";
import { UIScene } from "./game/scenes/UIScene";

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [BootScene, PreloadScene, GameScene, UIScene],
      pixelArt: true,
      roundPixels: true
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-white mb-4">2D RPG Combat Game</h1>
      <div id="game-container" className="border-4 border-gray-700 rounded-lg overflow-hidden"></div>
      <div className="mt-4 text-white text-center">
        <p>Use arrow keys to move</p>
        <p>Press SPACE to attack</p>
      </div>
    </div>
  );
}

export default App;
