import Phaser from 'phaser';
import { OllamaService } from '../ai/OllamaService';

export interface MouseState {
  health: number;
  hunger: number;
  social: number;
  sleep: number;
  temperature: number;
}

export class MouseNPC {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private aiService: OllamaService;
  private behaviorTimer: number = 0;
  private behaviorInterval: number = 5000; // Update behavior every 5 seconds
  private speed: number = 30;
  
  // Mouse state
  private state: MouseState = {
    health: 100,
    hunger: 50,
    social: 20,
    sleep: 70,
    temperature: 75
  };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    aiService: OllamaService
  ) {
    this.scene = scene;
    this.aiService = aiService;

    // Create the mouse sprite
    this.sprite = scene.physics.add.sprite(x, y, 'mouse');
    this.sprite.setScale(1);
    this.sprite.setDepth(8);
    this.sprite.setFrame(0);
    this.sprite.setVelocity(0, 0);
  }

  /**
   * Get the Phaser sprite for this mouse
   */
  getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  /**
   * Get the current state of the mouse
   */
  getState(): MouseState {
    return { ...this.state };
  }

  /**
   * Update the mouse behavior based on AI decisions
   */
  async update(delta: number, playerPosition: { x: number; y: number }): Promise<void> {
    if (!this.sprite.active) return;

    this.behaviorTimer += delta;

    // Query AI for new behavior every 5 seconds
    if (this.behaviorTimer >= this.behaviorInterval) {
      this.behaviorTimer = 0;

      // Gradually change stats over time
      this.state.hunger = Math.min(100, this.state.hunger + 2);
      this.state.sleep = Math.max(0, this.state.sleep - 1);

      // Get AI decision
      const action = await this.getMouseBehavior(this.state);
      console.log(`🐭 Mouse AI decision: ${action}`);

      // Execute the action
      this.executeAction(action, playerPosition);
    }
  }

  /**
   * Execute a specific action for the mouse
   */
  private executeAction(action: string, playerPosition: { x: number; y: number }): void {
    switch (action) {
      case 'idle':
        this.idle();
        break;

      case 'wander':
        this.wander();
        break;

      case 'approach_player':
        this.approachPlayer(playerPosition);
        break;

      case 'flee':
        this.flee(playerPosition);
        break;

      case 'rest':
        this.rest();
        break;

      case 'eat':
        this.eat();
        break;

      default:
        this.idle();
    }
  }

  /**
   * Make the mouse stand still
   */
  private idle(): void {
    this.sprite.setVelocity(0, 0);
    this.sprite.setFrame(0);
  }

  /**
   * Make the mouse wander around randomly
   */
  private wander(): void {
    const wanderX = Phaser.Math.Between(-this.speed, this.speed);
    const wanderY = Phaser.Math.Between(-this.speed, this.speed);
    this.sprite.setVelocity(wanderX, wanderY);
    this.updateAnimation(wanderX, wanderY);
  }

  /**
   * Make the mouse approach the player
   */
  private approachPlayer(playerPosition: { x: number; y: number }): void {
    const angleToPlayer = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y,
      playerPosition.x, playerPosition.y
    );
    const vx = Math.cos(angleToPlayer) * this.speed;
    const vy = Math.sin(angleToPlayer) * this.speed;
    this.sprite.setVelocity(vx, vy);
    this.updateAnimation(vx, vy);
  }

  /**
   * Make the mouse flee from the player
   */
  private flee(playerPosition: { x: number; y: number }): void {
    const angleAway = Phaser.Math.Angle.Between(
      playerPosition.x, playerPosition.y,
      this.sprite.x, this.sprite.y
    );
    const vx = Math.cos(angleAway) * this.speed * 1.5;
    const vy = Math.sin(angleAway) * this.speed * 1.5;
    this.sprite.setVelocity(vx, vy);
    this.updateAnimation(vx, vy);
  }

  /**
   * Make the mouse rest and restore energy
   */
  private rest(): void {
    this.sprite.setVelocity(0, 0);
    this.sprite.setFrame(0);
    this.state.sleep = Math.min(100, this.state.sleep + 10);
  }

  /**
   * Make the mouse eat and reduce hunger
   */
  private eat(): void {
    this.sprite.setVelocity(0, 0);
    this.sprite.setFrame(0);
    this.state.hunger = Math.max(0, this.state.hunger - 15);
  }

  /**
   * Update the mouse animation based on velocity
   */
  private updateAnimation(vx: number, vy: number): void {
    if (Math.abs(vx) > Math.abs(vy)) {
      if (vx > 0) {
        this.sprite.anims.play('mouse-walk-right', true);
      } else {
        this.sprite.anims.play('mouse-walk-left', true);
      }
    } else {
      if (vy > 0) {
        this.sprite.anims.play('mouse-walk-down', true);
      } else {
        this.sprite.anims.play('mouse-walk-up', true);
      }
    }
  }

  /**
   * Query the AI service for the next mouse behavior based on current state
   */
  private async getMouseBehavior(mouseState: MouseState): Promise<string> {
    if (!this.aiService.isReady()) {
      return 'idle';
    }

    const prompt = `You are controlling a small mouse in a game. Based on its current state, decide what the mouse should do.

Current state:
- Health: ${mouseState.health}/100
- Hunger: ${mouseState.hunger}/100 (higher = more hungry)
- Social: ${mouseState.social}/100 (higher = wants more interaction)
- Sleep: ${mouseState.sleep}/100 (higher = more awake)
- Temperature: ${mouseState.temperature}/100 (75 is comfortable)

Respond with ONLY ONE of these actions:
- idle (stand still)
- wander (walk around slowly)
- approach_player (walk toward player)
- flee (run away)
- eat (look for food)
- rest (sleep/relax)

Choose the most appropriate action:`;

    try {
      const response = await fetch(`${this.aiService.getBaseUrl()}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.aiService.getModel(),
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 20
          }
        })
      });

      if (!response.ok) {
        console.error('Ollama API error');
        return 'idle';
      }

      const data = await response.json();
      const action = data.response.trim().toLowerCase();

      const validActions = ['idle', 'wander', 'approach_player', 'flee', 'eat', 'rest'];
      return validActions.find(a => action.includes(a)) || 'idle';
    } catch (error) {
      console.error('Error getting mouse behavior:', error);
      return 'idle';
    }
  }

  /**
   * Destroy the mouse NPC
   */
  destroy(): void {
    this.sprite.destroy();
  }

  /**
   * Check if the mouse is still active
   */
  isActive(): boolean {
    return this.sprite.active;
  }

  /**
   * Get the mouse position
   */
  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  /**
   * Set the mouse position
   */
  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }
}
