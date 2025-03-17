import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { generateMap } from "../utils/mapGenerator";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private enemies: Phaser.Physics.Arcade.Group;
  private map: number[][];
  private tiles: Phaser.GameObjects.Group;
  private walls: Phaser.Physics.Arcade.StaticGroup;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private attackKey: Phaser.Input.Keyboard.Key;
  private lastEnemySpawnTime: number = 0;
  private enemySpawnInterval: number = 5000; // 5 seconds
  private maxEnemies: number = 10;

  constructor() {
    super("GameScene");
  }

  create() {
    // Generate map
    this.map = generateMap(25, 25);
    this.createMap();
    
    // Create player
    this.player = new Player(this, 400, 300);
    
    // Create enemies group
    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: this.maxEnemies,
      runChildUpdate: true
    });
    
    // Spawn initial enemies
    this.spawnEnemies(3);
    
    // Set up input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Set up collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);
    this.physics.add.collider(this.enemies, this.enemies);
    
    // Set up camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.5);
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, 25 * 32, 25 * 32);
    
    // Create event for player attack
    this.events.on("player-attack", this.handlePlayerAttack, this);
    
    // Start UI scene
    this.scene.launch("UIScene", { player: this.player });
  }

  update(time: number, delta: number) {
    // Update player
    this.player.update(this.cursors, this.attackKey);
    
    // Spawn enemies over time
    if (time > this.lastEnemySpawnTime + this.enemySpawnInterval && this.enemies.countActive() < this.maxEnemies) {
      this.spawnEnemies(1);
      this.lastEnemySpawnTime = time;
    }
    
    // Update enemies to follow player
    this.enemies.getChildren().forEach((enemy: Enemy) => {
      enemy.followPlayer(this.player);
    });
    
    // Check for collisions between player and enemies
    this.physics.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, undefined, this);
  }

  private createMap() {
    this.tiles = this.add.group();
    this.walls = this.physics.add.staticGroup();
    
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileX = x * 32;
        const tileY = y * 32;
        
        // 0 = grass, 1 = stone, 2 = wall
        switch (this.map[y][x]) {
          case 0:
            this.tiles.add(this.add.image(tileX + 16, tileY + 16, "grass-tile"));
            break;
          case 1:
            this.tiles.add(this.add.image(tileX + 16, tileY + 16, "stone-tile"));
            break;
          case 2:
            this.tiles.add(this.add.image(tileX + 16, tileY + 16, "wall-tile"));
            const wall = this.walls.create(tileX + 16, tileY + 16, "wall-tile");
            wall.setSize(32, 32);
            wall.setImmovable(true);
            break;
        }
      }
    }
  }

  private spawnEnemies(count: number) {
    for (let i = 0; i < count; i++) {
      let x, y;
      let validPosition = false;
      
      // Find a valid position for the enemy (not on a wall and not too close to player)
      while (!validPosition) {
        x = Phaser.Math.Between(100, 25 * 32 - 100);
        y = Phaser.Math.Between(100, 25 * 32 - 100);
        
        // Check distance from player
        const distance = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
        
        // Check if position is on a wall
        const tileX = Math.floor(x / 32);
        const tileY = Math.floor(y / 32);
        const isWall = tileX >= 0 && tileY >= 0 && tileX < this.map[0].length && tileY < this.map.length && this.map[tileY][tileX] === 2;
        
        if (distance > 200 && !isWall) {
          validPosition = true;
        }
      }
      
      const enemy = new Enemy(this, x, y);
      this.enemies.add(enemy);
    }
  }

  private handlePlayerAttack() {
    // Check for enemies in attack range
    this.enemies.getChildren().forEach((enemy: Enemy) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, 
        this.player.y, 
        enemy.x, 
        enemy.y
      );
      
      if (distance < 50) {
        enemy.takeDamage(this.player.attackDamage);
        
        // Check if enemy is dead
        if (enemy.health <= 0) {
          enemy.destroy();
          
          // Increase player experience
          this.player.gainExperience(10);
        }
      }
    });
  }

  private handlePlayerEnemyCollision(player: Player, enemy: Enemy) {
    if (!player.isInvulnerable) {
      player.takeDamage(enemy.attackDamage);
      
      // Knockback player
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
      player.setVelocity(
        Math.cos(angle) * 200,
        Math.sin(angle) * 200
      );
      
      // Make player temporarily invulnerable
      player.setInvulnerable(true);
      
      // Check if player is dead
      if (player.health <= 0) {
        this.scene.restart();
      }
    }
  }
}
