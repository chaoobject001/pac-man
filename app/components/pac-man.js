// in app/components/pac-man.js
import Ember from 'ember';
import Component from '@ember/component';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
// component can be js and / or handlebars 
export default Component.extend(KeyboardShortcuts, {
  // need html already been rendered
  // didInsertElement runs whenever the component is loaded and put on screen 
  didInsertElement() {
    this.drawGrid();
    this.drawPac();
  },

  score: 0,
  levelNumber: 1,
  x: 1,
  y: 2,
  squareSize: 40,
  walls: [
    { x: 1, y: 1 },
    { x: 8, y: 5 }
  ],

  directions: {
    'up': { x: 0, y: -1 },
    'down': { x: 0, y: 1 },
    'left': { x: -1, y: 0 },
    'right': { x: 1, y: 0 },
    'stopped': { x: 0, y: 0 },
  },

  grid: [
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 1, 2, 1, 2, 2, 2, 1],
    [2, 2, 1, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1]
  ],

  ctx: Ember.computed(function () {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    return ctx;
  }),

  drawPac() {
    let x = this.get('x');
    let y = this.get('y');
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor, this.get('direction'));
  },

  drawPellet(x, y) {
    let radiusDivisor = 6;
    this.drawCircle(x, y, radiusDivisor, 'stopped');
  },

  drawCircle(x, y, radiusDivisor, direction) {
    let ctx = this.get('ctx');
    let squareSize = this.get('squareSize');

    let pixelX = (x + 1 / 2 + this.offsetFor('x', direction)) * squareSize;
    let pixelY = (y + 1 / 2 + this.offsetFor('y', direction)) * squareSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize / radiusDivisor, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  offsetFor(coordinate, direction) {
    let frameRatio = this.get('frameCycle') / this.get('framePerMovement');
    return this.get(`directions.${direction}.${coordinate}`) * frameRatio;
  },

  keyboardShortcuts: {
    up() { this.movePacMan('up'); },
    down() { this.movePacMan('down'); },
    left() { this.movePacMan('left'); },
    right() { this.movePacMan('right'); },
  },

  screenWidth: Ember.computed(function () {
    return this.get('grid.firstObject.length');
  }),
  screenHeight: Ember.computed(function () {
    return this.get('grid.length');
  }),

  screenPixelWidth: Ember.computed(function () {
    return this.get('screenWidth') * this.get('squareSize');
  }),

  screenPixelHeight: Ember.computed(function () {
    return this.get('screenHeight') * this.get('squareSize');
  }),

  clearScreen() {
    let ctx = this.get('ctx');

    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'));
  },

  isMoving: false,
  direction: 'stopped',
  movePacMan(direction) {
    if (this.get('isMoving') || this.pathBlockedInDirection(direction)) {
      // do nothing, just wait it out
    } else {
      this.set('direction', direction)
      this.set('isMoving', true)
      this.movementLoop()
    }
  },

  // The movement loop
  frameCycle: 1,
  framesPerMovement: 30,
  movementLoop() {
    if (this.get('frameCycle') == this.get('framesPerMovement')) {
      // reset everything
      let direction = this.get('direction');
      this.set('x', this.nextCoordinate('x', direction));
      this.set('y', this.nextCoordinate('y', direction));

      this.set('isMoving', false);
      this.set('frameCycle', 1);

      this.processAnyPellets();
    } else {
      this.incrementProperty('frameCycle');
      Ember.run.later(this, this.movementLoop, 1000 / 60);
      // 1000/60 means 60 frames per second
      // Ember.run.later  - run this later
      // 1st arg: scope to run the function in 
      // 2nd arg: function to run
      // 3rd arg: How many milliseconds later to run it
    }

    this.clearScreen();
    this.drawGrid();
    this.drawPac()
  },

  nextCoordinate(coordinate, direction) {
    return this.get(coordinate) + this.get(`directions.${direction}.${coordinate}`);
  },

  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection(direction) {
    let nextX = this.nextCoordinate('x', direction);
    let nextY = this.nextCoordinate('y', direction);

    return this.get(`grid.${nextY}.${nextX}`);
  },

  processAnyPellets() {
    let x = this.get('x');
    let y = this.get('y');
    let grid = this.get('grid');

    if (grid[y][x] == 2) {
      grid[y][x] = 0;
      this.incrementProperty('score');

      if (this.levelComplete()) {
        this.incrementProperty('levelNumber');
        this.restartLevel();
      }
    }
  },

  restartLevel() {
    this.set('x', 0);
    this.set('y', 0);

    let grid = this.get('grid');
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell == 0) {
          grid[rowIndex][columnIndex] = 2;
        }
      });
    });
  },
  /*
    collidedWithBorder() {
      let x = this.get('x');
      let y = this.get('y');
      let screenHeight = this.get('screenHeight');
      let screenWidth = this.get('screenWidth');
  
      let pacOutOfBounds = x < 0 || y < 0 ||
        x >= screenWidth ||
        y >= screenHeight;
      
      return pacOutOfBounds;
    },
  */
  drawWall(x, y) {
    let ctx = this.get('ctx');
    let squareSize = this.get('squareSize');

    ctx.fillStyle = '#000';
    ctx.fillRect(x * squareSize, y * squareSize,
      squareSize, squareSize);
  },

  drawGrid() {
    let grid = this.get('grid');
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell == 1) {
          this.drawWall(columnIndex, rowIndex);
        }
        if (cell == 2) {
          this.drawPellet(columnIndex, rowIndex);
        }
      });
    });
  },
  /*
    collidedWithWall() {
      let x = this.get('x');
      let y = this.get('y');
      let grid = this.get('grid');
  
      return grid[y][x] === 1;
    }, 
  */
  levelComplete() {
    let hasPelletsLeft = false;
    let grid = this.get('grid');

    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell == 2) {
          hasPelletsLeft = true;
        }
      });
    });
    return !hasPelletsLeft;
  },

});


