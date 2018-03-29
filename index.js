// Configuration
const fps = 60; // 60 frames per second
const timeUnit = 1; // 1 second
const timeStep = timeUnit / fps; // Update/render step
const metersPerPixel = 0.05; // Pixel density in meters
const kilogramsPerPixel = 0.1; // Pixel density in kilograms
const pixelsPerMeter = 1 / metersPerPixel; // 20 pixels per meter
const pixelsPerKilogram = 1 / kilogramsPerPixel; // 10 pixels per kilogram
const forceUnit = (60 * pixelsPerMeter) / Math.pow(timeUnit, 2); // Unit of force of 60kg*m/s^2
const defaultGravity = 60 * pixelsPerMeter; // Default gravity of 60m/s^2 (exaggerated for fast gameplay)
const defaultFrictionX = 0.95; // Default horizontal friction (ground)
const defaultFrictionY = 0.98; // Default vertical friction (air)
const playerX = 1 * pixelsPerMeter; // Horizontal starting position of 1 meter
const playerY = 1 * pixelsPerMeter; // Vertical starting position of 1 meter
const playerWidth = 1 * pixelsPerMeter; // Width of 1 meter
const playerHeight = 1.8 * pixelsPerMeter; // Height of 1.8 meter
const playerMass = playerWidth * playerHeight * kilogramsPerPixel; // Mass of 72kg
const playerForceMove = 1 * forceUnit * playerMass; // Run force
const playerForceJump = 25 * forceUnit * playerMass; // Jump force
const playerForceSwim = 2.5 * forceUnit * playerMass; // Swim force
const playerAirJumps = 1; // Number of air jumps
const playerHealth = 100; // Maximum health
const interfaceHeight = 40; // Height of the interface

// Colors
const transparentColor = "rgba(0, 0, 0, 0)";
const blackColor = "rgba(0, 0, 0, 1)";
const whiteColor = "rgba(255, 255, 255, 1)";
const defaultColor = "rgba(63, 63, 63, 1)";
const backgroundColor = "rgba(239, 239, 239, 1)";
const playerColor = "rgba(0, 127, 191, 1)";
const airColor = "rgba(191, 223, 255, 1)";
const sandColor = "rgba(255, 223, 191, 1)";
const rockColor = "rgba(207, 207, 207, 1)";
const earthColor = "rgba(95, 0, 0, 1)";
const grassColor = "rgba(0, 127, 0, 1)";
const stoneColor = "rgba(127, 127, 127, 1)";
const rubberColor = "rgba(63, 63, 63, 1)";
const waterColor = "rgba(0, 255, 200, 0.5)";
const iceColor = "rgba(191, 255, 255, 1)";
const lavaColor = "rgba(255, 0, 0, 0.67)";
const slimeColor = "rgba(127, 159, 0, 0.5)";
const healthColor = "rgba(159, 255, 0, 1)";
const enemyColor = "rgba(127, 0, 127, 1)";
const ladderColor = "rgba(191, 127, 0, 1)";

// Tiles temporarily apply its properties to the player during intersection/collision.
// Additional tiles can be designed and used instantly.

const empty = Object.freeze({
  name: "empty",
});

const standard = Object.freeze({
  name: "standard",
  color: defaultColor,
});

const earth = Object.freeze({
  name: "earth",
  color: earthColor,
  frictionX: 0.97,
});

const grass = Object.freeze({
  name: "grass",
  color: grassColor,
  frictionX: 0.95,
});

const stone = Object.freeze({
  name: "stone",
  color: stoneColor,
  frictionX: 0.93,
});

const rubber = Object.freeze({
  name: "rubber",
  color: rubberColor,
  frictionX: 0.9,
});

const ice = Object.freeze({
  name: "ice",
  color: iceColor,
  frictionX: 0.99,
});

const water = Object.freeze({
  name: "water",
  color: waterColor,
  frictionX: 0.85,
  frictionY: 0.85,
  gravity: 0.75 * defaultGravity,
  transcend: true,
  background: false,
});

const lava = Object.freeze({
  name: "lava",
  color: lavaColor,
  health: -0.5 * playerHealth,
  frictionX: 0.75,
  frictionY: 0.75,
  gravity: 0.1 * defaultGravity,
  transcend: true,
  background: false,
});

const slime = Object.freeze({
  name: "slime",
  color: slimeColor,
  frictionX: 0.7,
  frictionY: 0.7,
  gravity: 0.5 * defaultGravity,
  transcend: true,
  background: false,
});

const spikes = Object.freeze({
  name: "spikes",
  color: transparentColor,
  triangle: stoneColor,
  size: 1 * pixelsPerMeter,
  health: -playerHealth * fps,
});

const health = Object.freeze({
  name: "health",
  color: healthColor,
  health: 0.25 * playerHealth * fps,
  transcend: true,
  dispose: true,
});

const enemy = Object.freeze({
  name: "enemy",
  color: enemyColor,
  health: -playerHealth * fps,
  distanceX: 2.5 * pixelsPerMeter,
  velocityX: 0.75,
  dispose: true,
});

const ladder = Object.freeze({
  name: "ladder",
  color: ladderColor,
  transcend: true,
  gravity: 0.001,
  frictionX: 0.75,
  frictionY: 0.75,
});

const platformH = Object.freeze({
  name: "platformH",
  color: stoneColor,
  distanceX: 4 * pixelsPerMeter,
  velocityX: 1,
});

const platformV = Object.freeze({
  name: "platformV",
  color: stoneColor,
  distanceY: 11 * pixelsPerMeter,
  velocityY: 0.5,
  gravity: 10 * defaultGravity,
});

const conveyorL = Object.freeze({
  name: "conveyor",
  color: rubberColor,
  forceX: -0.75 * forceUnit * playerMass,
});

const conveyorR = Object.freeze({
  name: "conveyor",
  color: rubberColor,
  forceX: 0.75 * forceUnit * playerMass,
});

// The draw class
class Draw {
  constructor(ctx) {
    // Apply the default configuration
    this.ctx = ctx;
  }
  rectangle(x, y, w, h, color) {
    // Draw rectangle
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }
  circle(x, y, r, color) {
    // Draw circle
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }
  triangle(x, y, width, height, color) {
    // Draw triangle
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height);
    this.ctx.lineTo(x + width, y + height);
    this.ctx.lineTo(x + width / 2, y);
    this.ctx.fill();
  }
  text(text, x, y, color) {
    // Draw text
    this.ctx.font = "16px sans-serif";
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }
}

// The Rectangle class is the base class of the player and the tiles
class Rectangle {
  constructor(x, y, w, h, color) {
    // Apply the default configuration
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.background = true;
  }
  // Check if a tile intersects with this one
  intersect(tile) {
    return (
      this.x < tile.x + tile.w &&
      tile.x < this.x + this.w &&
      this.y < tile.y + tile.h &&
      tile.y < this.y + this.h
    );
  }
  render(draw) {
    // Render the rectangle
    draw.rectangle(this.x, this.y, this.w, this.h, this.color || defaultColor);
  }
}

// The Tile class
class Tile extends Rectangle {
  constructor(x, y, w, h, type) {
    // Apply the default configuration
    super(x, y, w, h, defaultColor);
    type = type || standard;
    // Apply the properties of tile type to this instance
    for (let key in type) {
      if (type.hasOwnProperty(key)) {
        this[key] = type[key];
      }
    }
  }
  render(draw) {
    // Only render if not disposed
    if (this.disposed) {
      return;
    }
    if (this.triangle) {
      // Render rectangle with embedded triangles
      draw.rectangle(
        this.x,
        this.y,
        this.w,
        this.h,
        this.color || defaultColor
      );
      for (let y = 0; y < this.h; y += this.size) {
        for (let x = 0; x < this.w; x += this.size) {
          draw.triangle(
            this.x + x,
            this.y + y,
            this.size,
            this.size,
            this.triangle
          );
        }
      }
    } else {
      // Render rectangle
      draw.rectangle(
        this.x,
        this.y,
        this.w,
        this.h,
        this.color || defaultColor
      );
    }
  }
}

// The Player class
class Player extends Rectangle {
  constructor(draw, level, explosion) {
    // Apply the default configuration
    super(playerX, playerY, playerWidth, playerHeight, playerColor);
    this.draw = draw;
    this.level = level;
    this.explosion = explosion;
    this.dx = 0;
    this.dy = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.fx = 0;
    this.fy = 0;
    this.dt = 0;
    this.fm = playerForceMove;
    this.fj = playerForceJump;
    this.fs = playerForceSwim;
    this.m = playerMass;
    this.top = false;
    this.right = false;
    this.bottom = false;
    this.left = false;
    this.up = false;
    this.down = false;
    this.forward = false;
    this.backward = false;
    this.direction = 0;
    this.progress = 0;
    this.jump = playerAirJumps;
    this.health = playerHealth;
    this.tiles = [];
    this.disposed = false;
  }
  collides() {
    // Check if the player is in collision with a tile
    return this.bottom || this.top || this.left || this.right;
  }
  update(dt, progress) {
    this.dt = dt;
    this.progress = progress;
    // Update the player if not disposed, else update the explosion
    if (this.disposed) {
      this.explosion.update(dt, progress);
    } else {
      // Apply the properties of the current tiles to the player
      this.properties();
      // Update the velocity of the player
      this.velocity();
      // Move the player to the new position
      this.translate();
    }
  }
  velocity() {
    // Update the forces
    this.fx = this.level.forceX + this.fm * this.direction;
    this.fy = this.level.forceY;
    // Handle the floor and air jumps
    if (this.bottom && this.up) {
      this.up = false;
      this.jump = playerAirJumps;
      this.fy = -this.fj;
    } else if (this.up && this.jump > 0) {
      this.up = false;
      this.jump--;
      this.fy = -this.fj;
    }
    // Handle the wall jumps
    if ((this.left && this.forward) || (this.right && this.backward)) {
      this.fy = -this.fj;
    }
    // Handle the ceiling jump
    if (this.top && this.down) {
      this.fy = this.fj;
    }
    // Handle the swim impulse if the player is trancending a tile
    this.tiles.forEach((tile) => {
      if (tile.transcend && this.up) {
        this.fy -= this.fs;
      }
    });
    // Handle the downward motion on a descendable tile
    if (this.level.gravity < 1 && this.down) {
      this.fy += this.fs;
    }
    // Calculate the acceleration
    this.ax = this.fx / this.m;
    this.ay = this.fy / this.m + this.level.gravity;
    // Apply the acceleration to the velocity
    this.vx += this.ax * this.dt;
    this.vy += this.ay * this.dt;
    // Apply the horizontal friction to the velocity
    if (this.vx < 1 && this.vx > -1) {
      this.vx = 0;
    } else if (this.vx !== 0) {
      this.vx *= this.level.frictionX;
    }
    // Apply the vertical friction to the velocity
    if (this.vy < 1 && this.vy > -1) {
      this.vy = 0;
    } else if (this.vy !== 0) {
      this.vy *= this.level.frictionY;
    }
  }
  translate() {
    this.tiles = [];
    // Update the deltas of the x and y position
    this.dx += this.vx * this.dt;
    this.dy += this.vy * this.dt;
    // Create rectangles for the new x and y position
    this.nx = new Rectangle(this.x + this.dx, this.y, this.w, this.h);
    this.ny = new Rectangle(this.x, this.y + this.dy, this.w, this.h);
    // Loop over the tiles
    this.level.data.forEach((tile) => {
      // Only process actual tiles that are not disposed
      if (!(tile instanceof Tile) || tile.disposed) {
        return;
      }
      // If the player transcends a tile, add it to the current collection of tiles
      if (tile.transcend) {
        if (tile.intersect(this.nx) || tile.intersect(this.ny)) {
          this.tiles.push(tile);
        }
      } else {
        // If the player intersects with a tile vertically, revise its position
        if (tile.intersect(this.ny)) {
          this.tiles.push(tile);
          if (this.dy < 0) {
            this.dy = tile.y + tile.h - this.y;
          } else if (this.dy > 0) {
            this.dy = tile.y - this.y - this.h;
          }
        }
        // Do the same for the horizontal intersection,
        // but only when the tile is not moving vertically,
        // to avoid the physics flippin' out
        if (tile.intersect(this.nx) && !tile.distanceY) {
          this.tiles.push(tile);
          if (this.dx < 0) {
            this.dx = tile.x + tile.w - this.x;
          } else if (this.dx > 0) {
            this.dx = tile.x - this.x - this.w;
          }
        }
      }
    });
    // Apply the new position and reset the deltas
    this.x += this.dx;
    this.y += this.dy;
    this.dx = 0;
    this.dy = 0;
    // Update the collision data
    this.bottom = this.ny.y > this.y;
    this.top = this.ny.y < this.y;
    this.left = this.nx.x < this.x;
    this.right = this.nx.x > this.x;
    // Reset the velocity if the player is on a collision course
    if (this.left || this.right) {
      this.vx = 0;
    }
    if (this.top || this.bottom) {
      this.vy = 0;
    }
  }
  properties() {
    // Loop over the intersected tiles
    this.tiles.forEach((tile) => {
      // If the tile moves horizontally, update the player position
      if (tile.dx) {
        this.dx -= tile.dx;
      }
      // Relying on default dy correction and gravity for now
      // Physics are flippin' out vertically
      if (tile.dy) {
        // this.dy -= tile.dy;
      }
      // Apply the health value from a tile
      if (this.health > playerHealth) {
        this.health = playerHealth;
      } else if (this.health > 0) {
        this.health += this.dt * (tile.health || 0);
      } else {
        this.health = 0;
        this.dispose();
      }
    });
  }
  dispose() {
    // Dispose the player if the health reaches zero
    this.disposed = true;
    // Set the position of the explosion to that of the player
    this.explosion.x = this.x + this.w / 2;
    this.explosion.y = this.y + this.h / 2;
    // Reset the player when the explosion is finished
    this.explosion.done = () => {
      this.disposed = false;
      this.tiles = [];
      this.health = playerHealth;
      this.x = playerX;
      this.y = playerY;
      this.vx = 0;
      this.vy = 0;
    };
    // Setup the explosion
    this.explosion.setup();
  }
  render() {
    if (this.disposed) {
      // If the player is disposed, render the explosion
      this.explosion.render();
    } else {
      // Else render the player
      this.draw.rectangle(this.x, this.y, this.w, this.h, this.color);
    }
  }
}

// The Level class
class Level {
  constructor(draw, player, data) {
    // Apply the default configuration
    this.draw = draw;
    this.player = player;
    this.data = data;
    (this.width = draw.ctx.canvas.width),
      (this.height = draw.ctx.canvas.height),
      (this.gravity = defaultGravity);
    this.frictionX = defaultFrictionX;
    this.frictionY = defaultFrictionY;
    this.forceX = 0;
    this.forceY = 0;
    this.dt = 0;
    this.progress = 0;
    this.wall = 1;
  }
  static convert(data) {
    // Convert data units from meters to pixels
    return data.map((rectangle) => {
      rectangle.x *= pixelsPerMeter;
      rectangle.y *= pixelsPerMeter;
      rectangle.w *= pixelsPerMeter;
      rectangle.h *= pixelsPerMeter;
      return rectangle;
    });
  }
  addWall() {
    // Add walls to the edges of the level, so the player stays inside the canvas
    this.data.push(new Tile(0, -this.wall, this.width, this.wall));
    this.data.push(new Tile(this.width, 0, this.wall, this.height));
    this.data.push(new Tile(this.wall, this.height, this.width, this.wall));
    this.data.push(new Tile(-this.wall, 0, this.wall, this.height));
    this.data.push(
      new Tile(0, this.height - interfaceHeight, this.width, interfaceHeight)
    );
  }
  update(dt, progress) {
    this.dt = dt;
    this.progress = progress;
    // Update the tiles of the level
    this.tiles();
    // Apply the properties of the current tiles to the player
    this.properties();
  }
  tiles() {
    // Loop over the tiles
    this.data.forEach((tile) => {
      // Update the tiles of the level
      if (!(tile instanceof Tile)) {
        return;
      }
      let velocityX, velocityY;
      // Update the horizontal velocity
      if (tile.velocityX) {
        velocityX = Math.sin(this.dt * this.progress * tile.velocityX * 0.1);
      } else {
        velocityX = Math.sin(this.dt * this.progress * 0.1);
      }
      // Update the vertical velocity
      if (tile.velocityY) {
        velocityY = Math.sin(this.dt * this.progress * tile.velocityY * 0.1);
      } else {
        velocityY = Math.sin(this.dt * this.progress * 0.1);
      }
      // Update the horizontal position of the tile
      // Save the initial position and the delta of the tile
      if (tile.distanceX) {
        if (!tile.ix) {
          tile.ix = tile.x;
        }
        tile.dx = tile.x;
        tile.x = tile.ix + velocityX * tile.distanceX;
        tile.dx -= tile.x;
      }
      // Do the same for the vertical position
      if (tile.distanceY) {
        if (!tile.iy) {
          tile.iy = tile.y;
        }
        tile.dy = tile.y;
        tile.y = tile.iy + velocityY * tile.distanceY;
        tile.dy -= tile.y;
      }
    });
  }
  reset() {
    // Reset the level properties
    this.forceX = 0;
    this.forceY = 0;
    this.gravity = defaultGravity;
    this.frictionX = defaultFrictionX;
    this.frictionY = defaultFrictionY;
  }
  properties() {
    // Reset the level properties
    this.reset();
    // Loop over the intersected tiles
    this.player.tiles.forEach((tile) => {
      // Apply the tile properties to the level
      this.forceX = tile.forceX || 0;
      this.forceY = tile.forceY || 0;
      this.gravity = tile.gravity || defaultGravity;
      this.frictionX = tile.frictionX || defaultFrictionX;
      this.frictionY = tile.frictionY || defaultFrictionY;
      // Dispose the tile
      if (tile.dispose) {
        tile.disposed = true;
      }
    });
  }
  interface() {
    // Setup the configuration
    let x = 0;
    let y = this.height - interfaceHeight;
    let h = 0;
    let w = 97;
    let tiles = [
      earth,
      lava,
      ladder,
      slime,
      health,
      grass,
      rubber,
      stone,
      water,
      ice,
      enemy,
    ];
    // Render the background
    this.draw.rectangle(x, y, this.width, interfaceHeight, backgroundColor);
    this.draw.text(
      "Health: " + Math.floor(this.player.health),
      x + 25,
      y + interfaceHeight / 2 + 5,
      blackColor
    );
    // Render the tile legend
    tiles.forEach((tile, index) => {
      this.draw.rectangle(
        x + w * index + 125,
        y + h * index + interfaceHeight / 2 - 10,
        20,
        20,
        tile.color
      );
      this.draw.text(
        tile.name,
        x + w * index + 155,
        y + h * index + interfaceHeight / 2 + 5,
        blackColor
      );
    });
  }
  render(background) {
    // Loop over the tiles
    this.data.forEach((tile) => {
      // Render the tile based on background position
      if (background === tile.background) {
        tile.render(this.draw);
      }
    });
    // Render the interface
    this.interface();
  }
}

// The Explosion class
class Explosion {
  constructor(draw, x, y, done) {
    // Apply the default configuration
    this.draw = draw;
    (this.x = x), (this.y = y), (this.dt = 0);
    this.progress = 0;
    this.done = done;
    this.alpha = 1;
    this.particles = false;
    this.number = 300;
    this.radius = 3;
    this.factor = 0.95;
    this.vf = this.factor + (1 - this.factor) / 2;
  }
  setup() {
    // Setup the particles for the explosion
    this.particles = [];
    this.alpha = 1;
    for (let i = 0; i < this.number; i++) {
      this.particles.push({
        x: this.x,
        y: this.y,
        v: 1.25,
        r: Math.random() * this.radius,
        theta: Math.random() * Math.PI * 2,
        red: Math.floor(Math.random() * 256),
        green: Math.floor(Math.random() * 256),
        blue: Math.floor(Math.random() * 256),
      });
    }
  }
  update(dt, progress) {
    this.dt = dt;
    this.progress = progress;
    // Update the particles
    this.alpha *= this.factor;
    // Loop over the particles
    this.particles.forEach((p) => {
      // Update the velocity
      p.v *= this.vf;
      // Convert polar coördinates to cartesian coördinates
      p.x += p.r * Math.cos(p.theta) * p.v;
      p.y += p.r * Math.sin(p.theta) * p.v;
      // Set color
      p.c =
        this.color || "rgba(" + p.red + ", " + p.blue + ", " + p.green + ", 1)";
    });
    // Reset and call the done method when the explosion is finished
    if (this.alpha < 0.05) {
      this.setup();
      if (typeof this.done === "function") {
        this.done();
      }
    }
  }
  render() {
    // Save the current context
    this.draw.ctx.save();
    // Loop over the particles
    this.particles.forEach((p) => {
      // Apply global alpha
      this.draw.ctx.globalAlpha = this.alpha;
      // Draw particle
      this.draw.circle(p.x, p.y, p.r, p.c);
    });
    // Restore the previous context
    this.draw.ctx.restore();
  }
}

// The Game class
class Game {
  constructor(player, level) {
    // Apply the default configuration
    this.player = player;
    this.level = level;
    this.fps = fps;
    this.timeStep = timeStep;
    this.keys = {};
    this.running = false;
    // this.poing = this.sound('poing.wav', 3);
  }
  start() {
    // Start the game loop
    this.running = true;
    this.setup();
    requestAnimationFrame(this.loop.bind(this));
  }
  setup() {
    // Setup the key events
    document.addEventListener("keydown", (event) => {
      this.keys[event.keyCode] = true;
      this.update(event);
    });
    document.addEventListener("keyup", (event) => {
      this.keys[event.keyCode] = false;
      this.update(event);
    });
  }
  update(event) {
    // Apply the keypresses to the player
    // this.player.up = this.keys[87] || this.keys[38] || this.keys[32];
    this.player.down = this.keys[83] || this.keys[40];
    this.player.forward = this.keys[68] || this.keys[39];
    this.player.backward = this.keys[65] || this.keys[37];
    this.player.direction = !!this.player.forward - !!this.player.backward;
    this.jump(event);
  }
  jump(event) {
    // Trigger the jump only once per keypress
    if ([87, 38, 32].indexOf(event.keyCode) > -1) {
      if (event.type === "keydown") {
        if (!this.prevent) {
          this.prevent = true;
          this.player.up = true;
          // this.poing.play();
        }
      } else if (event.type === "keyup") {
        this.prevent = false;
        this.player.up = false;
      }
    }
  }
  loop(timestamp) {
    // The main game loop
    if (!this.delta) {
      this.delta = 0;
    }
    if (!this.initial) {
      this.initial = timestamp;
    }
    if (!this.previous) {
      this.previous = timestamp;
    }
    // Calculate the time delta
    this.delta += (timestamp - this.previous) / 1000;
    // Calculate the time progress
    this.progress = timestamp - this.initial;
    // Save the current timestamp
    this.previous = timestamp;
    // Update the player and level for every defined timeStep,
    // to make sure the physics stay consistent, regardless of framerate
    while (this.delta > this.timeStep) {
      this.delta -= this.timeStep;
      this.level.update(this.timeStep, this.progress, this);
      this.player.update(this.timeStep, this.progress, this);
    }
    // Render the background of the level
    this.level.render(true);
    // Render the player
    this.player.render();
    // Render the foreground of the level
    this.level.render(false);
    if (this.running) {
      // setTimeout(() => {
      //   // Low framerate testcase
      //   this.loop(performance.now());
      // }, 1000 / 15);
      requestAnimationFrame(this.loop.bind(this));
    }
  }
  sound(uri, max) {
    // Create a multichannel sound
    let channels = [];
    let index = 0;
    for (let i = 0; i < max; i++) {
      channels.push(new Audio(uri));
    }
    return {
      play: () => {
        channels[index++].play();
        if (index >= max) {
          index = 0;
        }
      },
    };
  }
}

// Level data in meters
const data = [
  // Background graphics
  new Rectangle(0, 0, 60, 30, airColor),
  new Rectangle(0, 12, 30, 18, sandColor),
  new Rectangle(30, 12, 30, 18, rockColor),
  // Top left of the level
  new Tile(0, 12, 8, 3, earth),
  new Tile(0, 11, 8, 1, grass),
  new Tile(22, 12, 8, 3, earth),
  new Tile(22, 11, 8, 1, grass),
  new Tile(12.5, 8, 5, 1, platformH),
  new Tile(25.5, 9.2, 1, 1.8, enemy),
  // Top right of the level
  new Tile(35, 5, 3, 1, stone),
  new Tile(34, 6, 4, 1, stone),
  new Tile(33, 7, 5, 1, stone),
  new Tile(32, 8, 6, 1, stone),
  new Tile(31, 9, 7, 1, stone),
  new Tile(30, 10, 8, 9, stone),
  new Tile(43, 0, 4, 13, stone),
  new Tile(52, 5, 3, 14, stone),
  new Tile(38, 17, 14, 2, stone),
  new Tile(30, 19, 25, 1, stone),
  new Tile(38, 5, 14, 12, water),
  new Tile(55, 16, 5, 1, platformV),
  // Bottom right of the level
  new Tile(30, 27, 15, 3, stone),
  new Tile(30, 26, 15, 1, ice),
  new Tile(45, 29, 15, 1, lava),
  new Tile(49, 20, 1, 9, ladder),
  new Tile(37, 24.2, 1, 1.8, enemy),
  // Bottom left of the level
  new Tile(0, 27, 8, 3, earth),
  new Tile(22, 27, 8, 3, earth),
  new Tile(8, 29, 14, 1, earth),
  new Tile(8, 28, 14, 1, spikes),
  new Tile(0, 26, 8, 1, conveyorR),
  new Tile(22, 26, 8, 1, conveyorL),
  new Tile(12.5, 20, 5, 1, slime),
  new Tile(2, 24.5, 1, 1, health),
  new Tile(5, 24.5, 1, 1, health),
  new Tile(24, 24.5, 1, 1, health),
  new Tile(27, 24.5, 1, 1, health),
];

const main = () => {
  // Initialize the whole shebang
  let context = document.getElementById("canvas").getContext("2d");
  let draw = new Draw(context);
  let explosion = new Explosion(draw);
  let player = new Player(draw, null, explosion);
  let level = new Level(draw, player, Level.convert(data));
  let game = new Game(player, level);
  level.addWall();
  player.level = level;
  window.onload = () => game.start();
};

// Game, set, match, go!
main();
