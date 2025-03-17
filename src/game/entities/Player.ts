import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
  // Stats
  public health: number = 100;
  public maxHealth: number = 100;
  public attackDamage: number = 100;
  public speed: number = 150;
  public level: number = 1;
  public experience: number = 0;
  public experienceToNextLevel: number = 100;
  
  // State
  public isAttacking: boolean = false;
  public isInvulnerable: boolean = false;
  private invulnerabilityTime: number = 1000; // 1 second
  private invulnerabilityTimer: Phaser.Time.TimerEvent;
  private attackCooldown: number = 500; // 0.5 seconds
  private lastAttackTime: number = 0;
  private direction: string = 'down';
  
  // Weapon
  private weapon: Phaser.GameObjects.Sprite;
  private weaponAngle: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    
    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set up physics body
    this.setCollideWorldBounds(true);
    this.setSize(20, 30);
    this.setOffset(6, 10);
    
    // Create weapon
    this.weapon = scene.add.sprite(x, y, 'weapon');
    this.weapon.setOrigin(0.5, 1);
    this.weapon.setVisible(false);
    
    // Create animations
    this.createAnimations();
    
    // Set depth for rendering order
    this.setDepth(10);
    this.weapon.setDepth(11);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, attackKey: Phaser.Input.Keyboard.Key) {
    if (!cursors) return;
    
    // Handle movement
    this.handleMovement(cursors);
    
    // Handle attack
    this.handleAttack(attackKey);
    
    // Update weapon position
    this.updateWeaponPosition();
  }

  private handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Reset velocity
    this.setVelocity(0);
    
    // Handle movement if not attacking
    if (!this.isAttacking) {
      if (cursors.left.isDown) {
        this.setVelocityX(-this.speed);
        this.direction = 'left';
        this.anims.play('player-left', true);
      } else if (cursors.right.isDown) {
        this.setVelocityX(this.speed);
        this.direction = 'right';
        this.anims.play('player-right', true);
      }
      
      if (cursors.up.isDown) {
        this.setVelocityY(-this.speed);
        if (!cursors.left.isDown && !cursors.right.isDown) {
          this.direction = 'up';
          this.anims.play('player-up', true);
        }
      } else if (cursors.down.isDown) {
        this.setVelocityY(this.speed);
        if (!cursors.left.isDown && !cursors.right.isDown) {
          this.direction = 'down';
          this.anims.play('player-down', true);
        }
      }
      
      // Normalize velocity for diagonal movement
      this.body.velocity.normalize().scale(this.speed);
      
      // Idle animation if not moving
      if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.anims.play(`player-idle-${this.direction}`, true);
      }
    }
  }

  private handleAttack(attackKey: Phaser.Input.Keyboard.Key) {
    const time = this.scene.time.now;
    
    if (attackKey.isDown && time > this.lastAttackTime + this.attackCooldown && !this.isAttacking) {
      this.isAttacking = true;
      this.lastAttackTime = time;
      
      // Show weapon
      this.weapon.setVisible(true);
      
      // Play attack animation
      this.anims.play(`player-attack-${this.direction}`, true);
      
      // Create attack effect
      const attackEffect = this.scene.add.sprite(this.x, this.y, 'attack-effect');
      attackEffect.setAlpha(0.7);
      attackEffect.setDepth(9);
      
      // Position attack effect based on direction
      switch (this.direction) {
        case 'up':
          attackEffect.setPosition(this.x, this.y - 20);
          break;
        case 'down':
          attackEffect.setPosition(this.x, this.y + 20);
          break;
        case 'left':
          attackEffect.setPosition(this.x - 20, this.y);
          break;
        case 'right':
          attackEffect.setPosition(this.x + 20, this.y);
          break;
      }
      
      // Animate attack effect
      this.scene.tweens.add({
        targets: attackEffect,
        alpha: 0,
        scale: 1.5,
        duration: 300,
        onComplete: () => {
          attackEffect.destroy();
        }
      });
      
      // Emit attack event
      this.scene.events.emit('player-attack');
      
      // Reset attack state after animation
      this.scene.time.delayedCall(300, () => {
        this.isAttacking = false;
        this.weapon.setVisible(false);
      });
    }
  }

  private updateWeaponPosition() {
    // Position weapon based on player direction
    switch (this.direction) {
      case 'up':
        this.weapon.setPosition(this.x, this.y - 5);
        this.weapon.setAngle(-90);
        this.weapon.setFlipX(false);
        break;
      case 'down':
        this.weapon.setPosition(this.x, this.y + 5);
        this.weapon.setAngle(90);
        this.weapon.setFlipX(false);
        break;
      case 'left':
        this.weapon.setPosition(this.x - 5, this.y);
        this.weapon.setAngle(180);
        this.weapon.setFlipX(false);
        break;
      case 'right':
        this.weapon.setPosition(this.x + 5, this.y);
        this.weapon.setAngle(0);
        this.weapon.setFlipX(false);
        break;
    }
  }

  private createAnimations() {
    // Create player animations
    this.scene.anims.create({
      key: 'player-down',
      frames: [
        { key: 'player-down-1' },
        { key: 'player-down-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    this.scene.anims.create({
      key: 'player-up',
      frames: [
        { key: 'player-up-1' },
        { key: 'player-up-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    this.scene.anims.create({
      key: 'player-left',
      frames: [
        { key: 'player-left-1' },
        { key: 'player-left-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    this.scene.anims.create({
      key: 'player-right',
      frames: [
        { key: 'player-right-1' },
        { key: 'player-right-2' }
      ],
      frameRate: 8,
      repeat: -1
    });
    
    // Idle animations
    this.scene.anims.create({
      key: 'player-idle-down',
      frames: [{ key: 'player-down-1' }],
      frameRate: 1
    });
    
    this.scene.anims.create({
      key: 'player-idle-up',
      frames: [{ key: 'player-up-1' }],
      frameRate: 1
    });
    
    this.scene.anims.create({
      key: 'player-idle-left',
      frames: [{ key: 'player-left-1' }],
      frameRate: 1
    });
    
    this.scene.anims.create({
      key: 'player-idle-right',
      frames: [{ key: 'player-right-1' }],
      frameRate: 1
    });
    
    // Attack animations
    this.scene.anims.create({
      key: 'player-attack-down',
      frames: [{ key: 'player-down-1' }],
      frameRate: 1
    });
    
    this.scene.anims.create({
      key: 'player-attack-up',
      frames: [{ key: 'player-up-1' }],
      frameRate: 1
    });
    
    this.scene.anims.create({
      key: 'player-attack-left',
      frames: [{ key: 'player-left-1' }],
      frameRate: 1
    });
    
    this.scene.anims.create({
      key: 'player-attack-right',
      frames: [{ key: 'player-right-1' }],
      frameRate: 1
    });
  }

  public takeDamage(amount: number) {
    if (this.isInvulnerable) return;
    
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
    
    // Flash player when hit
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 3
    });
    
    // Emit health changed event
    this.emit('health-changed');
  }

  public setInvulnerable(isInvulnerable: boolean) {
    this.isInvulnerable = isInvulnerable;
    
    if (isInvulnerable) {
      // Clear existing timer if there is one
      if (this.invulnerabilityTimer) {
        this.invulnerabilityTimer.remove();
      }
      
      // Set timer to remove invulnerability
      this.invulnerabilityTimer = this.scene.time.delayedCall(
        this.invulnerabilityTime,
        () => {
          this.isInvulnerable = false;
        }
      );
    }
  }

  public gainExperience(amount: number) {
    this.experience += amount;
    
    // Check for level up
    if (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
    
    // Emit experience changed event
    this.emit('experience-changed');
  }

  private levelUp() {
    this.level++;
    this.experience -= this.experienceToNextLevel;
    
    // Increase stats
    this.maxHealth += 20;
    this.health = this.maxHealth;
    this.attackDamage += 5;
    this.speed += 10;
    
    // Increase experience required for next level
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
    
    // Create level up effect
    const levelUpEffect = this.scene.add.sprite(this.x, this.y, 'attack-effect');
    levelUpEffect.setTint(0xffff00);
    levelUpEffect.setAlpha(0.7);
    levelUpEffect.setDepth(9);
    
    // Animate level up effect
    this.scene.tweens.add({
      targets: levelUpEffect,
      alpha: 0,
      scale: 2,
      duration: 500,
      onComplete: () => {
        levelUpEffect.destroy();
      }
    });
    
    // Emit level changed event
    this.emit('level-changed');
    this.emit('health-changed');
  }
}
