import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Image;
  private loadingBarContainer: Phaser.GameObjects.Image;

  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.createLoadingBar();
    this.loadAssets();
    this.setupLoadingEvents();
  }

  create() {
    this.createGameAssets();
    this.scene.start("GameScene");
  }

  private createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.loadingBarContainer = this.add.image(width / 2, height / 2, "loading-bar-bg");
    this.loadingBar = this.add.image(width / 2 - 150, height / 2, "loading-bar");
    this.loadingBar.setOrigin(0, 0.5);
    this.loadingBar.setScale(0, 1);
  }

  private setupLoadingEvents() {
    this.load.on("progress", (value: number) => {
      this.loadingBar.setScale(value, 1);
    });
  }

  private loadAssets() {
    // Generate all game assets programmatically
    // We'll create them in the createGameAssets method
  }

  private createGameAssets() {
    // Create player sprite
    this.createPlayerSprite();
    
    // Create enemy sprite
    this.createEnemySprite();
    
    // Create weapon sprite
    this.createWeaponSprite();
    
    // Create health bar
    this.createHealthBar();
    
    // Create tile sprites
    this.createTileSprites();
    
    // Create effect sprites
    this.createEffectSprites();
  }

  private createPlayerSprite() {
    const graphics = this.make.graphics();
    
    // Body
    graphics.fillStyle(0x3498db, 1);
    graphics.fillRect(8, 8, 16, 24);
    
    // Head
    graphics.fillStyle(0xecf0f1, 1);
    graphics.fillRect(10, 0, 12, 10);
    
    // Eyes
    graphics.fillStyle(0x2c3e50, 1);
    graphics.fillRect(12, 3, 2, 2);
    graphics.fillRect(18, 3, 2, 2);
    
    // Arms
    graphics.fillStyle(0x2980b9, 1);
    graphics.fillRect(4, 10, 4, 12);
    graphics.fillRect(24, 10, 4, 12);
    
    // Legs
    graphics.fillStyle(0x34495e, 1);
    graphics.fillRect(10, 32, 6, 8);
    graphics.fillRect(16, 32, 6, 8);
    
    graphics.generateTexture("player", 32, 40);
    graphics.destroy();
    
    // Create player walking animation frames
    this.createPlayerAnimationFrames();
  }

  private createPlayerAnimationFrames() {
    // Down animation
    const downFrames = this.make.graphics();
    downFrames.fillStyle(0x3498db, 1);
    downFrames.fillRect(8, 8, 16, 24);
    downFrames.fillStyle(0xecf0f1, 1);
    downFrames.fillRect(10, 0, 12, 10);
    downFrames.fillStyle(0x2c3e50, 1);
    downFrames.fillRect(12, 3, 2, 2);
    downFrames.fillRect(18, 3, 2, 2);
    downFrames.fillStyle(0x2980b9, 1);
    downFrames.fillRect(4, 10, 4, 12);
    downFrames.fillRect(24, 10, 4, 12);
    downFrames.fillStyle(0x34495e, 1);
    downFrames.fillRect(10, 32, 6, 8);
    downFrames.fillRect(16, 32, 6, 8);
    downFrames.generateTexture("player-down-1", 32, 40);
    
    const downFrames2 = this.make.graphics();
    downFrames2.fillStyle(0x3498db, 1);
    downFrames2.fillRect(8, 8, 16, 24);
    downFrames2.fillStyle(0xecf0f1, 1);
    downFrames2.fillRect(10, 0, 12, 10);
    downFrames2.fillStyle(0x2c3e50, 1);
    downFrames2.fillRect(12, 3, 2, 2);
    downFrames2.fillRect(18, 3, 2, 2);
    downFrames2.fillStyle(0x2980b9, 1);
    downFrames2.fillRect(4, 10, 4, 12);
    downFrames2.fillRect(24, 10, 4, 12);
    downFrames2.fillStyle(0x34495e, 1);
    downFrames2.fillRect(12, 32, 6, 8);
    downFrames2.fillRect(14, 32, 6, 8);
    downFrames2.generateTexture("player-down-2", 32, 40);
    
    // Up animation
    const upFrames = this.make.graphics();
    upFrames.fillStyle(0x3498db, 1);
    upFrames.fillRect(8, 8, 16, 24);
    upFrames.fillStyle(0xecf0f1, 1);
    upFrames.fillRect(10, 0, 12, 10);
    upFrames.fillStyle(0x2c3e50, 1);
    upFrames.fillRect(12, 3, 2, 2);
    upFrames.fillRect(18, 3, 2, 2);
    upFrames.fillStyle(0x2980b9, 1);
    upFrames.fillRect(4, 10, 4, 12);
    upFrames.fillRect(24, 10, 4, 12);
    upFrames.fillStyle(0x34495e, 1);
    upFrames.fillRect(10, 32, 6, 8);
    upFrames.fillRect(16, 32, 6, 8);
    upFrames.generateTexture("player-up-1", 32, 40);
    
    const upFrames2 = this.make.graphics();
    upFrames2.fillStyle(0x3498db, 1);
    upFrames2.fillRect(8, 8, 16, 24);
    upFrames2.fillStyle(0xecf0f1, 1);
    upFrames2.fillRect(10, 0, 12, 10);
    upFrames2.fillStyle(0x2c3e50, 1);
    upFrames2.fillRect(12, 3, 2, 2);
    upFrames2.fillRect(18, 3, 2, 2);
    upFrames2.fillStyle(0x2980b9, 1);
    upFrames2.fillRect(4, 10, 4, 12);
    upFrames2.fillRect(24, 10, 4, 12);
    upFrames2.fillStyle(0x34495e, 1);
    upFrames2.fillRect(12, 32, 6, 8);
    upFrames2.fillRect(14, 32, 6, 8);
    upFrames2.generateTexture("player-up-2", 32, 40);
    
    // Left animation
    const leftFrames = this.make.graphics();
    leftFrames.fillStyle(0x3498db, 1);
    leftFrames.fillRect(8, 8, 16, 24);
    leftFrames.fillStyle(0xecf0f1, 1);
    leftFrames.fillRect(10, 0, 12, 10);
    leftFrames.fillStyle(0x2c3e50, 1);
    leftFrames.fillRect(12, 3, 2, 2);
    leftFrames.fillRect(16, 3, 2, 2);
    leftFrames.fillStyle(0x2980b9, 1);
    leftFrames.fillRect(4, 10, 4, 12);
    leftFrames.fillRect(24, 10, 4, 12);
    leftFrames.fillStyle(0x34495e, 1);
    leftFrames.fillRect(10, 32, 6, 8);
    leftFrames.fillRect(16, 32, 6, 8);
    leftFrames.generateTexture("player-left-1", 32, 40);
    
    const leftFrames2 = this.make.graphics();
    leftFrames2.fillStyle(0x3498db, 1);
    leftFrames2.fillRect(8, 8, 16, 24);
    leftFrames2.fillStyle(0xecf0f1, 1);
    leftFrames2.fillRect(10, 0, 12, 10);
    leftFrames2.fillStyle(0x2c3e50, 1);
    leftFrames2.fillRect(12, 3, 2, 2);
    leftFrames2.fillRect(16, 3, 2, 2);
    leftFrames2.fillStyle(0x2980b9, 1);
    leftFrames2.fillRect(4, 10, 4, 12);
    leftFrames2.fillRect(24, 10, 4, 12);
    leftFrames2.fillStyle(0x34495e, 1);
    leftFrames2.fillRect(8, 32, 6, 8);
    leftFrames2.fillRect(14, 32, 6, 8);
    leftFrames2.generateTexture("player-left-2", 32, 40);
    
    // Right animation
    const rightFrames = this.make.graphics();
    rightFrames.fillStyle(0x3498db, 1);
    rightFrames.fillRect(8, 8, 16, 24);
    rightFrames.fillStyle(0xecf0f1, 1);
    rightFrames.fillRect(10, 0, 12, 10);
    rightFrames.fillStyle(0x2c3e50, 1);
    rightFrames.fillRect(14, 3, 2, 2);
    rightFrames.fillRect(18, 3, 2, 2);
    rightFrames.fillStyle(0x2980b9, 1);
    rightFrames.fillRect(4, 10, 4, 12);
    rightFrames.fillRect(24, 10, 4, 12);
    rightFrames.fillStyle(0x34495e, 1);
    rightFrames.fillRect(10, 32, 6, 8);
    rightFrames.fillRect(16, 32, 6, 8);
    rightFrames.generateTexture("player-right-1", 32, 40);
    
    const rightFrames2 = this.make.graphics();
    rightFrames2.fillStyle(0x3498db, 1);
    rightFrames2.fillRect(8, 8, 16, 24);
    rightFrames2.fillStyle(0xecf0f1, 1);
    rightFrames2.fillRect(10, 0, 12, 10);
    rightFrames2.fillStyle(0x2c3e50, 1);
    rightFrames2.fillRect(14, 3, 2, 2);
    rightFrames2.fillRect(18, 3, 2, 2);
    rightFrames2.fillStyle(0x2980b9, 1);
    rightFrames2.fillRect(4, 10, 4, 12);
    rightFrames2.fillRect(24, 10, 4, 12);
    rightFrames2.fillStyle(0x34495e, 1);
    rightFrames2.fillRect(12, 32, 6, 8);
    rightFrames2.fillRect(18, 32, 6, 8);
    rightFrames2.generateTexture("player-right-2", 32, 40);
    
    downFrames.destroy();
    downFrames2.destroy();
    upFrames.destroy();
    upFrames2.destroy();
    leftFrames.destroy();
    leftFrames2.destroy();
    rightFrames.destroy();
    rightFrames2.destroy();
  }

  private createEnemySprite() {
    const graphics = this.make.graphics();
    
    // Body
    graphics.fillStyle(0xe74c3c, 1);
    graphics.fillRect(8, 8, 16, 24);
    
    // Head
    graphics.fillStyle(0xecf0f1, 1);
    graphics.fillRect(10, 0, 12, 10);
    
    // Eyes
    graphics.fillStyle(0x2c3e50, 1);
    graphics.fillRect(12, 3, 2, 2);
    graphics.fillRect(18, 3, 2, 2);
    
    // Arms
    graphics.fillStyle(0xc0392b, 1);
    graphics.fillRect(4, 10, 4, 12);
    graphics.fillRect(24, 10, 4, 12);
    
    // Legs
    graphics.fillStyle(0x7f8c8d, 1);
    graphics.fillRect(10, 32, 6, 8);
    graphics.fillRect(16, 32, 6, 8);
    
    graphics.generateTexture("enemy", 32, 40);
    graphics.destroy();
  }

  private createWeaponSprite() {
    const graphics = this.make.graphics();
    
    // Sword
    graphics.fillStyle(0xbdc3c7, 1);
    graphics.fillRect(0, 0, 4, 20);
    
    // Handle
    graphics.fillStyle(0x7f8c8d, 1);
    graphics.fillRect(0, 20, 4, 6);
    
    graphics.generateTexture("weapon", 4, 26);
    graphics.destroy();
  }

  private createHealthBar() {
    const graphics = this.make.graphics();
    
    // Health bar background
    graphics.fillStyle(0x7f8c8d, 1);
    graphics.fillRect(0, 0, 50, 8);
    
    // Health bar fill
    graphics.fillStyle(0x2ecc71, 1);
    graphics.fillRect(1, 1, 48, 6);
    
    graphics.generateTexture("health-bar", 50, 8);
    graphics.destroy();
  }

  private createTileSprites() {
    // Grass tile
    const grassTile = this.make.graphics();
    grassTile.fillStyle(0x2ecc71, 1);
    grassTile.fillRect(0, 0, 32, 32);
    
    // Add some texture to the grass
    grassTile.fillStyle(0x27ae60, 1);
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(0, 28);
      const y = Phaser.Math.Between(0, 28);
      grassTile.fillRect(x, y, 4, 4);
    }
    
    grassTile.generateTexture("grass-tile", 32, 32);
    grassTile.destroy();
    
    // Stone tile
    const stoneTile = this.make.graphics();
    stoneTile.fillStyle(0x95a5a6, 1);
    stoneTile.fillRect(0, 0, 32, 32);
    
    // Add some texture to the stone
    stoneTile.fillStyle(0x7f8c8d, 1);
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(0, 28);
      const y = Phaser.Math.Between(0, 28);
      stoneTile.fillRect(x, y, 4, 4);
    }
    
    stoneTile.generateTexture("stone-tile", 32, 32);
    stoneTile.destroy();
    
    // Wall tile
    const wallTile = this.make.graphics();
    wallTile.fillStyle(0x34495e, 1);
    wallTile.fillRect(0, 0, 32, 32);
    
    // Add some texture to the wall
    wallTile.fillStyle(0x2c3e50, 1);
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(0, 28);
      const y = Phaser.Math.Between(0, 28);
      wallTile.fillRect(x, y, 4, 4);
    }
    
    wallTile.generateTexture("wall-tile", 32, 32);
    wallTile.destroy();
  }

  private createEffectSprites() {
    // Attack effect
    const attackEffect = this.make.graphics();
    attackEffect.fillStyle(0xf39c12, 0.8);
    attackEffect.fillCircle(16, 16, 16);
    attackEffect.generateTexture("attack-effect", 32, 32);
    attackEffect.destroy();
    
    // Hit effect
    const hitEffect = this.make.graphics();
    hitEffect.fillStyle(0xe74c3c, 0.8);
    hitEffect.fillCircle(16, 16, 16);
    hitEffect.generateTexture("hit-effect", 32, 32);
    hitEffect.destroy();
  }
}
