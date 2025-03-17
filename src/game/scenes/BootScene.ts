import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Load minimal assets needed for the loading screen
    this.load.setPath("assets");
    
    // Create loading bar assets programmatically
    this.createLoadingBarGraphics();
  }

  create() {
    this.scene.start("PreloadScene");
  }

  private createLoadingBarGraphics() {
    // Create a loading bar background
    const loadingBarBg = this.make.graphics();
    loadingBarBg.fillStyle(0x222222, 0.8);
    loadingBarBg.fillRect(240, 270, 320, 50);
    loadingBarBg.generateTexture("loading-bar-bg", 320, 50);
    loadingBarBg.destroy();

    // Create a loading bar fill
    const loadingBar = this.make.graphics();
    loadingBar.fillStyle(0x4285F4, 1);
    loadingBar.fillRect(0, 0, 300, 30);
    loadingBar.generateTexture("loading-bar", 300, 30);
    loadingBar.destroy();
  }
}
