var ctx;
var playLoop;
var fps = 30;
var canvasH;
var canvasW;
var endgame = false;
var endTimer = 1;
var thatsIllegal = false;

var lastPlayerX;
var lastPlayerY;
var lastComX;
var lastComY;
var turnCount = 0;

var boxes = [];

function Box(relativeX, relativeY) {
  this.mark = -1; //Empty tic tac toe box;
  this.relativeX = relativeX;
  this.relativeY = relativeY;
  this.actualX = 0;
  this.actualY = 0;
  this.opacity = 1;
  this.getMark = function() {return this.mark};
  this.applyMark = function(mark) {
    if (this.mark != -1) return false; //If box is already marked, don't do anything
    this.mark = mark;
    if (mark == 0) {
      lastPlayerX = relativeX;
      lastPlayerY = relativeY;
    } else {
      lastComX = relativeX;
      lastComY = relativeY;
    }
    this.opacity = 0;
    checkEndGame(); //Once a move has been made, check if anyone has won
    return true;
  };
  this.draw = function() {

    ctx.globalAlpha = 1;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0000FF";

    this.size = canvasH/5;
    if(canvasW/5 < this.size)
      this.size = canvasW/5;

    this.actualX = (canvasW - this.size*5)/2 + (this.relativeX+2)*this.size;
    this.actualY = (canvasH - this.size*5)/2 + (this.relativeY+2)*this.size;

    //this.actualX = (this.relativeX + 4) * canvasW / 9;
    //this.actualY = (this.relativeY + 2) * canvasW / 9;

    if(this.opacity < 1) this.opacity += 0.05;
    if (this.mark == 0) { //Draw an "O"
      var scale = 0.8;
      ctx.beginPath();
      if (canvasW < 0) return;
      ctx.globalAlpha = this.opacity;
      ctx.arc(this.actualX + this.size/2, this.actualY + this.size/2, this.size/2 * scale, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (this.mark == 1) { //Draw an "X"
      var offset = 10;
      ctx.beginPath();
      ctx.globalAlpha = this.opacity;
      ctx.moveTo(this.actualX + offset, this.actualY + offset);
      ctx.lineTo(this.actualX + this.size - offset, this.actualY + this.size - offset);
      ctx.moveTo(this.actualX + this.size - offset, this.actualY + offset);
      ctx.lineTo(this.actualX + offset, this.actualY + this.size - offset);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    //Draw grid
    if (Math.abs(relativeX) == 2 || Math.abs(relativeY) == 2) return;
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0000FF";
    ctx.rect(this.actualX, this.actualY, this.size, this.size);
    ctx.closePath();
    ctx.stroke();
  };
}

function onDrawGame() {
  endgame = true;
  endTimer = 0;
}

function onClick(mouseX, mouseY) {
  if (endgame) return;

  var size = canvasH/5;
  if(canvasW/5 < size)
    size = canvasW/5;

  var gridX = Math.floor((mouseX - (canvasW - size*5)/2)/size - 2);
  var gridY = Math.floor((mouseY - (canvasH - size*5)/2)/size - 2);

  console.log(gridX + " " + gridY);
  if (Math.abs(gridX) > 2 || Math.abs(gridY) > 2) return;
  if (Math.abs(gridX) == 2 || Math.abs(gridY) == 2) thatsIllegal = true;
  var arrayPosition = (gridX + 2) + (gridY + 2) * 5;
  if (boxes[arrayPosition].applyMark(0)) {
    machine.playMachine();
    turnCount++;
  }
}

function checkEndGame() {
  for (var x = 1; x < 4; x++) {
    for (var y = 1; y < 4; y++) {
      if(boxes[x + y * 5].getMark() == -1) return false;
    }
  }
  onDrawGame();
  return true;
}

var machine = {
  getBox : function(x, y) {
    return boxes[(x + 2) + (y + 2) * 5];
  },
  calcType : function(x, y) {
    return Math.abs(x) + Math.abs(y);
  },
  checkWins : function(mark, lastX, lastY) {
    var count = 0;
    var empty;
    for (var x = -1; x <= 1; x++) {
      if (this.getBox(x, lastY).getMark() == mark) {
        count++;
      } else if (this.getBox(x, lastY).getMark() == -1) {
        empty = this.getBox(x, lastY);
      }
    }
    if (count >= 2 && empty != null) {
      empty.applyMark(1);
      return true;
    }
    count = 0;
    empty = null;
    for (var y = -1; y <= 1; y++) {
      if (this.getBox(lastX, y).getMark() == mark) {
        count++;
      } else if (this.getBox(lastX, y).getMark() == -1) {
        empty = this.getBox(lastX, y);
      }
    }
    if (count >= 2 && empty != null) {
      empty.applyMark(1);
      return true;
    }
    count = 0;
    empty = null;
    if (this.calcType(lastX, lastY) == 2) {
      for (var i = -1; i <= 1; i++) {
        if (this.getBox(i * lastX * lastY, i).getMark() == mark) {
          count++;
        } else if (this.getBox(i * lastX * lastY, i).getMark() == -1) {
          empty = this.getBox(i * lastX * lastY, i);
        }
      }
      if (count >= 2 && empty != null) {
        empty.applyMark(1);
        return true;
      }
    }
    return false;
  },
  playOffense : function() {
    //Play in corners for horizontals
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        if (this.calcType(x, y) != 2) continue;
        if (this.getBox(x, y).getMark() == 1) {
          if (this.getBox(0, y).getMark() == -1 && this.getBox(-x, y).getMark() == -1) {
            this.getBox(-x, y).applyMark(1);
            return true;
          } else if (this.getBox(x, 0).getMark() == -1 && this.getBox(x, -y).getMark() == -1) {
            this.getBox(x, -y).applyMark(1);
            return true;
          }
        }
      }
    }
    //Protect against double edge play by playing a corner
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        if (this.calcType(x, y) != 2) continue;
        if (this.getBox(x, y).getMark() == -1) {
          if (this.getBox(0, y).getMark() == 0 && this.getBox(x, 0).getMark() == 0) {
            this.getBox(x, y).applyMark(1);
            return true;
          }
        }
      }
    }
    //Protect against diagonal corners play by playing an edge
    for (var c = -0.5; c <= 0.5; c++) {
      if (this.getBox(-1, -1) == c - 0.5 && this.getBox(1, 1) == c - 0.5) {
        if (this.getBox(1, -1) == -c - 0.5 && this.getBox(-1, 1) == -c - 0.5) {
          for (var y = -1; y <= 1; y++) {
            for (var x = -1; x <= 1; x++) {
              if (this.calcType(x, y) != 1) continue;
              if (this.getBox(x, y).getMark() == -1) {
                this.getBox(x, y).applyMark(1);
                return true;
              }
            }
          }
        }
      }
    }
    //Play in a corner if available
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        if (this.calcType(x, y) != 2) continue;
        if (this.getBox(x, y).getMark() == -1) {
          this.getBox(x, y).applyMark(1);
          return true;
        }
      }
    }
    //Play an edge if available
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        if (this.calcType(x, y) != 1) continue;
        if (this.getBox(x, y).getMark() == -1) {
          this.getBox(x, y).applyMark(1);
          return true;
        }
      }
    }
    return false;
  },
  playMachine : function() {
    if (Math.abs(lastPlayerX) == 2 || Math.abs(lastPlayerY) == 2) return;
    if (turnCount == 0) {
      if (this.calcType(lastPlayerX, lastPlayerY) >= 1) { //Edge or Cornor
        this.getBox(0, 0).applyMark(1);
      } else { //Center
        var temp1 = Math.sign(Math.random() - 0.5);
        if (temp1 == 0) temp = 1;
        var temp2 = Math.sign(Math.random() - 0.5);
        if (temp2 == 0) temp = 1;
        this.getBox(temp1, temp2).applyMark(1);
      }
    } else {
      if (!this.checkWins(1, lastComX, lastComY)) {
        if (!this.checkWins(0, lastPlayerX, lastPlayerY)) {
          this.playOffense();
        }
      } else {
        onDrawGame();
        return;
      }
    }
  }
}

function play_game() {
  // playLoop = setInterval(function() {
  //   update();
  //   draw();
  // }, 1000 / fps);

  endgame = false;
  endTimer = 1;
  thatsIllegal = false;

  turnCount = 0;

  var counter = 0;
  boxes = [];
  for (var y = -2; y <= 2; y++) {
    for (var x = -2; x <= 2; x++) {
      boxes[counter] = new Box(x, y);
      counter++;
    }
  }
}

// function update() {
//   sizeAdjust();
// }

function draw(){
  reset();
  if (endTimer < 1) endTimer += 0.012;
  if (endgame && endTimer > 0.5) {
    ctx.globalAlpha = endTimer * endTimer * endTimer * endTimer;
    ctx.fillStyle = "#000000";
    ctx.font = "60px Arial";
    var text = "You Didn't Win!";
    ctx.fillText(text, canvasW / 2 - ctx.measureText(text).width / 2, canvasH / 2);
    ctx.font = "30px Arial";
    text = "Click to Reset";
    ctx.fillText(text, canvasW / 2 - ctx.measureText(text).width / 2, canvasH / 2 + 50);
  } else {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].draw();
    }
    if (thatsIllegal) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000000";
      ctx.font = "30px Arial";
      text = "Wait... I thought I fixed that bug...";
      ctx.fillText(text, canvasW / 2 - ctx.measureText(text).width / 2, canvasH / 2);
    }
  }
}

function reset() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#00F000";
  ctx.fillRect(0, 0, canvasW, canvasH);
}

function sizeAdjust() {
  canvas = document.getElementById("mycanvas");
  canvasW = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  canvasH = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  canvasH *= 0.8;
  canvasW *= 0.8;
  //console.log(canvasH);
  //console.log(canvasW);
  //document.getElementById("mycanvas").height = canvasH;
  //document.getElementById("mycanvas").width = canvasW;
  if(canvas.width != canvasW)
    {
    canvas.width = canvasW;
    }
  if(canvas.height != canvasH)
    {
    canvas.height = canvasH;
    }
}

window.onload =
  function Game() {
    // sizeAdjust();
    // document.body.style.marginTop = 0;
    // document.body.style.marginLeft = 0;
    // document.body.style.marginBottom = 0;
    // document.body.style.marginUp = 0;
    //
    // this.ctx = document.getElementById("mycanvas").getContext("2d");
    // play();
  }
document.onmousedown =
  function mousedown(e) {
    e = e || window.event;
    mouse = true;
    if(!game.tictac)
      return;
    if (!endgame) {
      xOffset = document.getElementById("mycanvas").getBoundingClientRect().x;
      yOffset = document.getElementById("mycanvas").getBoundingClientRect().y;
      onClick(e.pageX-xOffset, e.pageY-yOffset);
    } else if (endTimer >= 1) {
      endgame = false;
      thatsIllegal = false;
      turnCount = 0;
      for (var y = -2; y <= 2; y++) {
        for (var x = -2; x <= 2; x++) {
          boxes[(x + 2) + (y + 2) * 5].mark = -1;
        }
      }
    }
  }
document.onmouseup =
  function mouseup(e) {
    e = e || window.event;
    mouse = false;
  }
