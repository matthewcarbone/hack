var ctx;
var playLoop;
var fps = 30;
var text_size = 100;
var canvasH;
var canvasW;
var endgame = false;
var endTimer = 1;
var thatsIllegal = false;
var wingame = false;

var lastPlayerX;
var lastPlayerY;
var lastComX;
var lastComY;
var turnCount = 0;
var machineDelay = -1;

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
    checkEndGame(); //Once a move has been made, check if game has been won or tied
    return true;
  };
  this.draw = function() {

    this.size = (canvasH-text_size)/5;
    if(canvasW/5 < this.size) this.size = canvasW/5;

    this.actualX = (canvasW - this.size*5)/2 + (this.relativeX+2)*this.size;
    this.actualY = ((canvasH-text_size) - this.size*5)/2 + (this.relativeY+2)*this.size;

    if(this.opacity < 1) this.opacity += 0.05;
    if (this.mark == 0) { //Draw an "O"
      var scale = 0.75;
      ctx.beginPath();
      if (canvasW < 0) return;
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = this.opacity * 5;
      ctx.arc(this.actualX + this.size/2, this.actualY + this.size/2, this.size/2 * scale, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (this.mark == 1) { //Draw an "X"
      ctx.beginPath();
      var offset = 10;
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = "#192634";
      ctx.lineWidth = this.opacity * 5;
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
    ctx.strokeStyle = "#3d5f80";
    ctx.rect(this.actualX, this.actualY, this.size, this.size);
    ctx.closePath();
    ctx.stroke();
  };
}

function onTieGame() {
  endgame = true;
  endTimer = 0;
}

function onWinGame() { //Temporary way to end the game
  if (wingame) return;
  wingame = true;
  //endgame = true;
  endTimer = -100;

  log_push("&nbsp&nbsp", 0, 2);
  log_push("I am beaten... Why did c0mrade forget to fix that stupid bug???", 0, 2);
  //log_push("Oh I know why! It's cause he was too busy planning that government hack! In fact, he mentioned that the password was |<span class = \"blink\"><b>getrichquick123</b></span>|@@@", 0, 2);
  log_push("Oh I know why! He was too busy planning that government hack! In fact, he mentioned that the password was |<span class = \"blink\"><b>twmnxs6yfxs7hjb</b></span>|@@@", 0, 2);

  log_push("OOPS. I shoudn't have told you that...Good thing that password is encrypted... we take security seriously around here ya'know.", 0, 2);
}

function onClick(mouseX, mouseY) {
  if (endgame || wingame) return;
  if (machineDelay >= 0) return;

  var size = (canvasH-text_size)/5;
  if(canvasW/5 < size) size = canvasW/5;

  var gridX = Math.floor((mouseX - (canvasW - size*5)/2)/size - 2);
  var gridY = Math.floor((mouseY - ((canvasH-text_size) - size*5)/2)/size - 2);

  if (Math.abs(gridX) > 2 || Math.abs(gridY) > 2) return;
  if (Math.abs(gridX) == 2 || Math.abs(gridY) == 2) thatsIllegal = true;
  var arrayPosition = (gridX + 2) + (gridY + 2) * 5;
  if (boxes[arrayPosition].applyMark(0)) {
    if (Math.abs(gridX) != 2 && Math.abs(gridY) != 2) {
      machineDelay = 30;
    }
  }
}

function checkEndGame() {
  for (var y = 0; y < 5; y++) { //Check for all horizontal wins
    for (var x = 0; x < 3; x++) {
      for (var dx = 0; dx < 3; dx++) {
        if (boxes[x + dx + y * 5].getMark() != 0) break;
        if (dx == 2) {
          onWinGame();
          return true;
        }
      }
    }
  }
  for (var x = 0; x < 5; x++) { //Check for all vertical wins
    for (var y = 0; y < 3; y++) {
      for (var dy = 0; dy < 3; dy++) {
        if (boxes[x + (y + dy) * 5].getMark() != 0) break;
        if (dy == 2) {
          onWinGame();
          return true;
        }
      }
    }
  }
  for (var y = 0; y < 3; y++) { //Check for all left-right, up-down diagonal wins
    for (var x = 0; x < 3; x++) {
      for (var d = 0; d < 3; d++) {
        if (boxes[(x + d) + (y + d) * 5].getMark() != 0) break;
        if (d == 2) {
          onWinGame();
          return true;
        }
      }
    }
  }
  for (var y = 0; y < 3; y++) { //Check for all right-left, up-down diagonal wins
    for (var x = 2; x < 5; x++) {
      for (var d = 0; d < 3; d++) {
        if (boxes[(x - d) + (y + d) * 5].getMark() != 0) break;
        if (d == 2) {
          onWinGame();
          return true;
        }
      }
    }
  }
  for (var x = 1; x < 4; x++) {
    for (var y = 1; y < 4; y++) {
      if(boxes[x + y * 5].getMark() == -1) return false;
    }
  }
  onTieGame();
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
    //Protect against diagonal force plays by playing an edge
    if (turnCount == 1) {
      for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
          if (this.calcType(x, y) != 2) continue;
          if (this.getBox(x, y).getMark() == 0) {
            for (var y = -1; y <= 1; y++) {
              for (var x = -1; x <= 1; x++) {
                if (this.calcType(x, y) != 1) continue;
                if (this.getBox(x, y).getMark() == -1 && this.getBox(-x, -y).getMark() == -1) {
                  this.getBox(x, y).applyMark(1);
                  return true;
                }
              }
            }
          }
        }
      }
    }
    // //Protect against diagonal corners play by playing an edge
    // for (var c = -0.5; c <= 0.5; c++) {
    //   if (this.getBox(-1, -1).getMark() == c - 0.5 && this.getBox(1, 1).getMark() == c - 0.5) {
    //     if (this.getBox(1, -1).getMark() == -c - 0.5 && this.getBox(-1, 1).getMark() == -c - 0.5) {
    //       for (var y = -1; y <= 1; y++) {
    //         for (var x = -1; x <= 1; x++) {
    //           if (this.calcType(x, y) != 1) continue;
    //           if (this.getBox(x, y).getMark() == -1) {
    //             this.getBox(x, y).applyMark(1);
    //             return true;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
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
        onTieGame();
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
  wingame = false;

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
  if (machineDelay > 0) {
    machineDelay--;
  } else if (machineDelay == 0) {
    machine.playMachine();
    turnCount++;
    machineDelay--
  }
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
      ctx.fillText(text, canvasW / 2 - ctx.measureText(text).width / 2, canvasH - text_size/2);
      //+ (text_size-ctx.measureText(text).height)/2
    }
    if (wingame) {
      glitch1();
      }
    if (wingame) {
      var canvasImg = new Image();
      canvasImg.src = canvas.toDataURL();
      ctx.drawImage(canvasImg, Math.random() * 2, Math.random() * 2);
    }
   }

}
function glitch1() {
  var canvasImg = new Image();
  canvasImg.src = canvas.toDataURL();

  var sx;
  var sy;
  var sw;
  var sh;
  var glitchOffset = 30;
  for (var y = 0; y < canvasH; y += 20) {
    sx = canvasW * Math.random();
    sy = y;
    sw = canvasW * Math.random();
    sh = Math.random() * 20;
    //ctx.filter = "blur(2px)";
    ctx.drawImage(canvasImg, sx, sy, sw, sh, (Math.random() - 0.5) * glitchOffset + sx, sy, sw, sh);
    ctx.filter = "none";
  }
}


function glitch2() {
  var canvasImg = new Image();
  canvasImg.src = canvas.toDataURL();

  var sx;
  var sy;
  var sw;
  var sh;
  var glitchOffset = 30;
  for (var i = 0; i < 30; i++) {
    sx = canvasW * Math.random();
    sy = canvasH * Math.random();
    sw = canvasW * Math.random() / 10;
    sh = canvasW * Math.random() / 10;
    ctx.drawImage(canvasImg, sx, sy, sw, sh, (Math.random() - 0.5) * glitchOffset + sx, (Math.random() - 0.5) * glitchOffset + sy, sw, sh);
    ctx.filter = "none";
  }
}

function reset() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#4b99b8";
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
  canvasW *= 0.5;
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

document.onmousedown =
  function mousedown(e) {
    e = e || window.event;
    mouse = true;
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
