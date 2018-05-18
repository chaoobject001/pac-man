// in app/components/pac-man.js
import Ember from 'ember';
import Component from '@ember/component';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
// component can be js and / or handlebars 
export default Component.extend(KeyboardShortcuts, {
  // need html already been rendered
  // didInsertElement runs whenever the component is loaded and put on screen 
  didInsertElement: function() {
    this.drawWalls();
    this.drawCircle();
  },

  x: 1,
  y: 2,
  squareSize: 40,
  walls: [
    {x: 1, y: 1},
    {x: 8, y: 5}
  ],

  grid: [
    [0,0,0,0,0,0,0,1],
    [0,1,0,1,0,0,0,1],
    [0,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1]
  ],

  ctx: Ember.computed(function() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    return ctx;
  }),

  drawCircle: function() {
    let ctx = this.get('ctx');
    let x = this.get('x');
    let y = this.get('y');
    let squareSize = this.get('squareSize');

    let pixelX = (x + 1/2) * squareSize;
    let pixelY = (y + 1/2) * squareSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize/2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  keyboardShortcuts: {
    up: function() { 
      this.movePacMan('y', -1 );
    },
    down: function() { 
      this.movePacMan('y', 1);
    },
    left: function() { 
      this.movePacMan('x', -1);
    },
    right: function() { 
      this.movePacMan('x', 1);
    },
  },

  screenWidth: Ember.computed( function() {
    return this.get('grid.firstObject.length');
  }), 
  screenHeight: Ember.computed(function() {
    return this.get('grid.length');
  }),

  screenPixelWidth: Ember.computed( function() {
    return this.get('screenWidth') * this.get('squareSize');
  }), 

  screenPixelHeight: Ember.computed(function() {
    return this.get('screenHeight') * this.get('squareSize');
  }),

  clearScreen: function() {
    let ctx = this.get('ctx');

    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'));
  },

  movePacMan: function(direction, amount) {
    this.incrementProperty(direction, amount);

    if(this.collidedWithBorder() || this.collidedWithWall()) {
      this.decrementProperty(direction, amount);
    }

    this.clearScreen();
    this.drawWalls();
    this.drawCircle();
  },

  collidedWithBorder: function() {
    let x = this.get('x');
    let y = this.get('y');
    let screenHeight = this.get('screenHeight');
    let screenWidth = this.get('screenWidth');

    let pacOutOfBounds = x < 0 || y < 0 ||
      x >= screenWidth ||
      y >= screenHeight;
    
    return pacOutOfBounds;
  },

  drawWalls: function() {
    let squareSize = this.get('squareSize');
    let ctx = this.get('ctx');
    ctx.fillStyle = '#000';

    let grid = this.get('grid');
    grid.forEach(function(row, rowIndex){
      row.forEach(function(cell, columnIndex){
        if(cell == 1){
          ctx.fillRect(
            columnIndex * squareSize,
            rowIndex * squareSize,
            squareSize,
            squareSize
          );
        }
      }); 
    });
  },

  collidedWithWall: function() {
    let x = this.get('x');
    let y = this.get('y');
    let grid = this.get('grid');

    return grid[y][x] === 1;
  }

});


