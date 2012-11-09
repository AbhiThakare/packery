( function( window ) {

"use strict";

// -------------------------- Rect -------------------------- //

function Rect( props ) {
  // extend properties from defaults
  for ( var prop in Rect.defaults ) {
    this[ prop ] = Rect.defaults[ prop ];
  }

  for ( prop in props ) {
    if ( Rect.defaults.hasOwnProperty( prop ) ) {
      this[ prop ] = props[ prop ];
    }
  }

}

Rect.defaults = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

/**
 * Determines whether or not this rectangle wholly encloses another rectangle or point.
 * @param {Rect} otherRect
 * @returns {Boolean}
**/
Rect.prototype.contains = function( otherRect ) {
  // points don't have width or height
  var otherWidth = otherRect.width || 0;
  var otherHeight = otherRect.height || 0;
  return this.x <= otherRect.x &&
    this.y <= otherRect.y &&
    this.x + this.width >= otherRect.x + otherWidth &&
    this.y + this.height >= otherRect.y + otherHeight;
};

/**
 * Determines whether or not the rectangle contains point.
 * @param {Object} point: { x: , y: }
 * @returns {Boolean}
**/
Rect.prototype.containsPoint = function( point ) {
  return this.x < point.x &&
    this.y < point.y &&
    this.x + this.width > point.x &&
    this.y + this.height > point.y;
}

Rect.prototype.containsAnyCorner = function( otherRect ) {
  return this.containsPoint({ x: otherRect.x, y: otherRect.y }) ||
    this.containsPoint({ x: otherRect.x + otherRect.width, y: otherRect.y }) ||
    this.containsPoint({ x: otherRect.x + otherRect.width, y: otherRect.y + otherRect.height }) ||
    this.containsPoint({ x: otherRect.x, y: otherRect.y + otherRect.height });
};

/**
 * Determines whether or not the rectangle intersects with another.
 * @param {Rect} otherRect
 * @returns {Boolean}
**/
Rect.prototype.intersects = function( otherRect ) {
  // check if any point in either rect are contained in the other
  return this.containsAnyCorner( otherRect ) ||
    otherRect.containsAnyCorner( this );
};

Rect.prototype.getMaximalFreeRects = function( otherRect ) {
  if ( !this.intersects( otherRect ) ) {
    return;
  }

  var freeRects = [];
  var freeRect;

  var thisRight = this.x + this.width;
  var thisBottom = this.y + this.height;
  var otherRight = otherRect.x + otherRect.width;
  var otherBottom = otherRect.y + otherRect.height;

  // top
  if ( this.y < otherRect.y ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: otherRect.y - this.y
    })
    freeRects.push( freeRect );
  }

  // right
  if ( thisRight > otherRight ) {
    freeRect = new Rect({
      x: otherRight,
      y: this.y,
      width: thisRight - otherRight,
      height: this.height
    })
    freeRects.push( freeRect );
  }

  // bottom
  if ( thisBottom > otherBottom ) {
    freeRect = new Rect({
      x: this.x,
      y: otherBottom,
      width: this.width,
      height: thisBottom - otherBottom
    })
    freeRects.push( freeRect );
  }

  // left
  if ( this.x < otherRect.x ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: otherRect.x - this.x,
      height: this.height
    })
    freeRects.push( freeRect );
  }


  return freeRects;
}



var r1 = new Rect({
  x: 40,
  y: 160,
  width: 250,
  height: 100
});

var r2 = new Rect({
  x: 60,
  y: 30,
  width: 140,
  height: 200
});

var freeRects = r2.getMaximalFreeRects( r1 );

// console.log( r1.intersects( r2 ) );
console.log( freeRects );

// -------------------------- canvas -------------------------- //

var w = 400;
var h = 600;

window.onload = function() {
  var canvas = document.getElementsByTagName('canvas')[0];

  canvas.width = w;
  canvas.height = h;

  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'hsla(240, 100%, 50%, 0.3)';
  ctx.fillRect( r1.x, r1.y, r1.width, r1.height );
  ctx.fillRect( r2.x, r2.y, r2.width, r2.height );

  ctx.fillStyle = 'hsla(0, 100%, 50%, 0.5)';
  freeRects.forEach( function( rect ) {
    ctx.fillRect( rect.x, rect.y, rect.width, rect.height );
  });

};

})( window );
