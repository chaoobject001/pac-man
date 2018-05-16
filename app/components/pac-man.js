// in app/components/pac-man.js
import Ember from 'ember';
import Component from '@ember/component';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
// component can be js and / or handlebars 
export default Component.extend(KeyboardShortcuts, {
  // need html already been rendered
  // didInsertElement runs whenever the component is loaded and put on screen 
  didInsertElement: function() {
    this.drawCircle();
  },

  x: 50,
  y: 100,
  squareSize: 40,

  ctx: Ember.computed(function() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    return ctx;
  }),

  drawCircle: function() {
    let ctx = this.get('ctx');
    let x = this.get('x');
    let y = this.get('y');
    let radius = this.get('squareSize') / 2;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  keyboardShortcuts: {
    up: function() { 
      this.movePacMan('y', -1 * this.get('squareSize'))
    },
    down: function() { 
      this.movePacMan('y', this.get('squareSize'));
    },
    left: function() { 
      this.movePacMan('x', -1 * this.get('squareSize'));
    },
    right: function() { 
      this.movePacMan('x', this.get('squareSize'));
    },
  },

  clearScreen: function() {
    let ctx = this.get('ctx');
    let screenWidth = 800;
    let screenHeight = 600;

    ctx.clearRect(0, 0, screenWidth, screenHeight);
  },

  movePacMan: function(direction, amount) {
    this.incrementProperty(direction, amount);
    this.clearScreen();
    this.drawCircle();
  }
});


