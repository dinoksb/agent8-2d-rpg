import Phaser from "phaser";
import { Player } from "./Player";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  // Stats
  public health: number = 50;
  public maxHealth: number = 50;
  public attackDamage: number = 10;
  public speed: number = 80;
  
  // State
  private aggroRange: number = 200;
  private attackRange: number = 20;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 1000; // 1 second
  private healthBar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
    
    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set up physics body
    this.setCollideWorldBounds(true);
    this.setSize(20, 30);
    this.setOffset(6, 10);
    
    // Create health bar
    this.healthBar = scene.add.graphics();
    this.updateHealthBar();
    
    // Set depth for rendering order
    this.setDepth(5);
    this.healthBar.setDepth(6);
  }

  update() {
    // Update health bar position
    this.updateHealthBar();
  }

  public followPlayer(player: Player) {
    // Calculate distance to player
    const distance = Phaser.Math.Distance.Between(
      this.x, 
      this.y, 
      player.x, 
      player.y
    );
    
    // Follow player if within aggro range
    if (distance < this.aggroRange) {
      // Move towards player
      if (distance > this.attackRange) {
        const angle = Phaser.Math.Angle.Between(
          this.x, 
          this.y, 
          player.x, 
          player.y
        );
        
        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;
        
        this.setVelocity(velocityX, velocityY);
      } else {
        // Stop when in attack range
        this.setVelocity(0, 0);
        
        // Attack if cooldown is over
        const time = this.scene.time.now;
        if (time > this.lastAttackTime + this.attackCooldown) {
          this.attack(player);
          this.lastAttackTime = time;
        }
      }
    } else {
      // Stop when player is out of range
      this.setVelocity(0, 0);
    }
  }

  private attack(player: Player) {
    // Create attack effect
    const attackEffect = this.scene.add.sprite(this.x, this.y, 'hit-effect');
    attackEffect.setAlpha(0.5);
    attackEffect.setDepth(4);
    
    // Animate attack effect
    this.scene.tweens.add({
      targets: attackEffect,
      alpha: 0,
      scale: 1.2,
      duration: 200,
      onComplete: () => {
        attackEffect.destroy();
      }
    });
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
    
    // Create hit effect
    const hitEffect = this.scene.add.sprite(this.x, this.y, 'hit-effect');
    hitEffect.setAlpha(0.7);
    hitEffect.setDepth(9);
    
    // Animate hit effect
    this.scene.tweens.add({
      targets: hitEffect,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      onComplete: () => {
        hitEffect.destroy();
      }
    });
    
    // Flash enemy when hit
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 1
    });
    
    // Update health bar
    this.updateHealthBar();
    
    // Knockback
    if (this.scene.registry.get('player')) {
      const player = this.scene.registry.get('player');
      const angle = Phaser.Math.Angle.Between(player.x, player.y, this.x, this.y);
      this.setVelocity(
        Math.cos(angle) * 150,
        Math.sin(angle) * 150
      );
      
      // Stop knockback after a short time
      this.scene.time.delayedCall(100, () => {
        if (this.active) {
          this.setVelocity(0, 0);
        }
      });
    }
  }

  private updateHealthBar() {
    this.healthBar.clear();
    
    // Only show health bar if enemy has taken damage
    if (this.health < this.maxHealth) {
      // Background
      this.healthBar.fillStyle(0x000000, 0.5);
      this.healthBar.fillRect(this.x - 15, this.y - 25, 30, 5);
      
      // Health fill
      const healthPercentage = this.health / this.maxHealth;
      this.healthBar.fillStyle(0xff0000, 1);
      this.healthBar.fillRect(this.x - 15, this.y - 25, 30 * healthPercentage, 5);
    }
  }

  destroy(fromScene?: boolean) {
    // Clean up health bar when enemy is destroyed
    if (this.healthBar) {
      this.healthBar.destroy();
    }
    
    super.destroy(fromScene);
  }
}
