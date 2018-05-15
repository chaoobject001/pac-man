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

  drawCircle: function() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let x = 50;
    let y = 100;
    let radius = 20;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  keyboardShortcuts: {
    up: function() { console.log('up');},
    down: function() { console.log('down');},
    left: function() { console.log('left');},
    right: function() { console.log('right');},
  },
});


