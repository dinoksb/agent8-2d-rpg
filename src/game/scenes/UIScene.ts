import Phaser from "phaser";
import { Player } from "../entities/Player";

export class UIScene extends Phaser.Scene {
  private player: Player;
  private healthBar: Phaser.GameObjects.Graphics;
  private experienceBar: Phaser.GameObjects.Graphics;
  private levelText: Phaser.GameObjects.Text;
  private healthText: Phaser.GameObjects.Text;

  constructor() {
    super("UIScene");
  }

  init(data: { player: Player }) {
    this.player = data.player;
  }

  create() {
    // Create health bar
    this.healthBar = this.add.graphics();
    
    // Create experience bar
    this.experienceBar = this.add.graphics();
    
   // Create level text
    this.levelText = this.add.text(16, 16, `Level: ${this.player.level}`, {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold"
    });
    this.levelText.setScrollFactor(0);
    
    // Create health text
    this.healthText = this.add.text(16, 40, `Health: ${this.player.health}/${this.player.maxHealth}`, {
      fontSize: "18px",
      color: "#ffffff"
    });
    this.healthText.setScrollFactor(0);
    
    // Listen for player events
    this.player.on("health-changed", this.updateHealthUI, this);
    this.player.on("experience-changed", this.updateExperienceUI, this);
    this.player.on("level-changed", this.updateLevelUI, this);
    
    // Initial UI update
    this.updateHealthUI();
    this.updateExperienceUI();
	}

  update() {
    // Update UI elements that need constant updating
  }

  private updateHealthUI() {
    // Update health bar
    this.healthBar.clear();
    
    // Background
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(10, 70, 200, 20);
    
    // Health fill
    const healthPercentage = this.player.health / this.player.maxHealth;
    this.healthBar.fillStyle(0xff0000, 1);
    this.healthBar.fillRect(10, 70, 200 * healthPercentage, 20);
    
    // Update health text
    this.healthText.setText(`Health: ${this.player.health}/${this.player.maxHealth}`);
  }

  private updateExperienceUI() {
    // Update experience bar
    this.experienceBar.clear();
    
    // Background
    this.experienceBar.fillStyle(0x000000, 0.5);
    this.experienceBar.fillRect(10, 100, 200, 10);
    
    // Experience fill
    const experiencePercentage = this.player.experience / this.player.experienceToNextLevel;
    this.experienceBar.fillStyle(0x00ff00, 1);
    this.experienceBar.fillRect(10, 100, 200 * experiencePercentage, 10);
  }

  private updateLevelUI() {
    this.levelText.setText(`Level: ${this.player.level}`);
  }
}
