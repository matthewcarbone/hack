//document.getElementById("question-box-0").focus();
var fps = 90;
var loop = null;
var time = {last: Date.now(), current: Date.now(), delta: 0};

var log = [];
var logparams = {count : 0, max_count : 20, size: 0};

var game = {login : false, tictac: false}
var interact = {isopen :  false, id : 0, stage : 0};

var ctx;

var testing = false;


function update (){

  if(game.tictac){
    sizeAdjust();
    draw();
  }

  update_modal();
  update_input();
  update_log();
  update_time();

}

function update_modal(){
  $("#Iframe1")[0].style.height = parseInt(window.innerHeight*0.75) + 'px';
  $("#Iframe1")[0].style.width = parseInt($("#Iframe1")[0].style.height)*(16/9) + 'px';
}

function update_time(){
  time.current = Date.now();
  time.delta = time.current - time.last;
  time.last = time.current;
}

function update_log(){

  // update log count for typing
  // if update_typing = true, then typing animation should occur
  var update_typing = false;
  logparams.count += time.delta;
  if(logparams.count > logparams.max_count){
    logparams.count -= logparams.max_count;
    update_typing = true;
  }

  //fix log height
  var height = window.innerHeight - 80
  $("#log_text_holder")[0].style.height = height.toString() + "px"

  //if there is nothing to animate, then updates should not occur
  if(update_typing == false)
    return;

  //update log content
  for (i = 0; i < log.length; i++){
    var text = log[i][0];

    //don't update boxes that have already completed their typing animation
    if(log[i][1] >= text.length)
      continue;

    //update one typing animation
    log[i][1]++;


    //if the text is actually some |HTML| type it all at once.
    if(text[log[i][1]-1] == '|'){
      var end_hunter;
      for(end_hunter = log[i][1]; end_hunter < text.length; end_hunter++){
        if (text[end_hunter] == '|')
          break;
      }
      log[i][1] = end_hunter + 1;
    }

    p_id = "log_text_" + i.toString();
    text = text.substring(0, log[i][1]).replace(/[|]/g, '');
    text = text.replace(/[@]/g, '');

    //focus on element
    document.getElementById(p_id).scrollIntoView();

    //special_text = "<a href=\"#\" onclick = \"say_hi()\">hello</a>";
    //special_text = "<a href=\"#\" id = \"hyperlink_video1\"class=\"btn btn-default\" data-toggle=\"modal\" onclick=\"openModal()\">hello</a>"
    $("#"+p_id)[0].innerHTML = text; // + special_text;


    //out += "<p id = \"test_id\">" + add.substring(0, log[i][1]) + modal_text + "</p>\n";
    //out += "<div class=\"col-4\"><iframe id=\"Iframe1\" width=\"100%\" src=\"https://www.youtube.com/embed/vCI2H02m1Z4\"></iframe></div>";

    //only one typing animation is to be updated, so at this point you can break out of the loop
    break;
  }
}

function update_input(){

  //make sure the input always starts with "> "
  var currentValue = $("#input_text")[0].value;
  if (currentValue.indexOf("> ") != 0 && currentValue.length != 0){
    var indexToDel = -1;
    while ((currentValue.charAt(indexToDel+1) == ' ' ||
          currentValue.charAt(indexToDel+1) == '>') &&
          indexToDel < currentValue.length)
          indexToDel++;
    $("#input_text")[0].value = "> " + currentValue.substring(indexToDel+1, currentValue.length)
  }
}

function log_push(text, animation_count, message_type = 0){

  //update the html by atting a new <p>
  p_id = "log_text_" + logparams.size.toString();
  if(message_type == 0)
    $("#log_text_holder")[0].innerHTML += "\n<p id = \"" + p_id + "\" class = \"pbb\">" + text.substring(0, animation_count) + "</p>";
  else if (message_type == 1)
    $("#log_text_holder")[0].innerHTML += "\n<p id = \"" + p_id + "\" style = \"color: #ffffff\" class = \"puser\">" + text.substring(0, animation_count) + "</p>";
  else if (message_type == 2)
    $("#log_text_holder")[0].innerHTML += "\n<p id = \"" + p_id + "\" style = \"color: #ff5555\" class = \"pbb\">" + text.substring(0, animation_count) + "</p>";
  else if (message_type == 3)
    $("#log_text_holder")[0].innerHTML += "\n<p id = \"" + p_id + "\" style = \"color: #55ffff\" class = \"puser\">" + text.substring(0, animation_count) + "</p>";

  //update log array
  log.push([text, animation_count]);

  //change for next time
  logparams.size++;
}
function log_push_extra(type, id){
  if(type == "canvas"){
    var height = window.innerHeight * 0.8;
    var width = window.innerWidth * 0.8;
    $("#log_text_holder")[0].innerHTML += "\n<canvas id=\"" + id + "\" style = \"border:1px solid #000000;\" width=\"" + width + "\" height=\"" + height + "\"></canvas>"
    ctx = document.getElementById("mycanvas").getContext("2d");

    game.tictac = true;
    play_game();
  }
}

function system_respond(input){
  if(input.includes("$hack_system")){
    log_push("Running system hack. Please wait.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push(get_random_fun_response() + "...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push(get_random_fun_response() + "...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push(get_random_fun_response() + "...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push("Hack failed. Error 402: Insufficient credentials.", 0);
  }
  else if (input.includes("$download_files")){
    log_push("Downloading secret files...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push("Intruder, stop right there! To access those files (top secret government documents of course) you need the secret password. What is it?", 0, 2);

    interact.isopen = true;
    interact.id = 1;
    interact.stage = 0;
  }
  else if (input.includes("$riddle_me_this")){
    log_push("This computer does not have a sense of humor and cannot tell riddles or jokes.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push("Boooooooooo. As Babble Bot, I know tons of interesting riddles. Answer these for a reward:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
    log_push("1. Mary's father has 5 daughters: NANA, NENE, NINI, NONO and _____. What's the name of his last daughter? ", 0, 2);

    interact.isopen = true;
    interact.id = 2;
    interact.stage = 0;
  }
  else if (input.includes("$chrono_virus")){
    log_push("Infecting network... @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push("Epidemic failed. Error 222: PC offline.", 0);
  }
  else if (input.includes("$update_firmware")){
    log_push("Updating firmware. Please wait.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push(get_random_fun_response() + "...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push(get_random_fun_response() + "...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push(get_random_fun_response() + "...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push("Firmware is up to date (build version 1.32)", 0);
  }
  else if (input.includes("$notcho_business")){
    log_push("Operation failed. Error 789: It's none of your business.", 0);
  }
  else if (input.includes("$spill_tea")){
    log_push("Spiling tea... @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push("Operation failed. Error 632: No tea left to be spilled.", 0);
  }
  else if (input.includes("$kill_switch")){
    log_push("Do you want to exit this program [yes/no]?", 0);

    interact.isopen = true;
    interact.id = 3;
    interact.stage = 0;
  }
  else if (input.includes("$yeet_all_the_french_fries")){
    var numfries = getRandomInt(2, 10000);
    log_push("Babble Bot found " + numfries + " french fries. @@@@@@@@@@@@@@@" , 0);
    log_push("Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom"
    + " Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom"
    + " Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom"
    + " Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom Nom"
    + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
    log_push("All " + numfries + " fries have been successfully yeeted.", 0);
  }
  else{
    log_push("Unrecognized command or sequence. Please try again.", 0);
  }
  //▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  //█████████████████████████████████
}

function get_random_fun_response(){
  responses = [
    "Crunching large numbers",
    "Eating a lot of cookies",
    "Recalibrating potentiometer",
    "Fetching latest updates",
    "Compiling byte code",
    "Encrypting important data",
    "Running a marathon",
    "Getting very swole",
    "Arbitrarily sorting numbers",
    "Simulating test cases",
    "Extracting critical data",
    "Clearing working memory",
    "Juggling ten frying pans"
  ];
  return responses[getRandomInt(0, responses.length)];
}

function handle_interaction(input){

  if(interact.id == 0){
    log_push("Who goes there...INTRUDER!!!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
    log_push("My name is <b>BABBLE BOT</b> and I am the AI in charge of guarding c0mrade's personal computer.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
    log_push("If you want to hack this system you have to get through me first! And trust me..I won't go easy on you.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
    interact.isopen = false;
  }

  else if(interact.id == 1){

    if(interact.stage == 0){
      if(clean_input(input).hashCode() == 1253261399){
        interact.stage = 1;
        log_push("Authentication verified...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
        log_push("Downloading secret files...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
        log_push("HOLD ON. @@@@@@@@@@@@@@@@@ This operation isn't cheap - it's going to cost you $740,000. Please send me your bank account number:", 0, 2);
      }
      else {
        log_push("WRONG!!! You can't get past Babble Bot... the smartest AI security guard you'll ever meet!", 0, 2);
        interact.isopen = false;
      }
    }

    else if(interact.stage == 1){
      if(clean_input(input).hashCode() == -2032403652){
        log_push("Processing payment...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
        log_push("Downloading secret files...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
        log_push("Files downloaded! <b>YOU WIN!</b>", 0);
      }
      else {
        log_push("Processing payment...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
        log_push("That's a fake number! Don't try to play tricks on me...", 0, 2);
      }
      interact.isopen = false;
    }

  }

  else if(interact.id == 2){

    if(interact.stage == 0){
      if(clean_input(input) == "mary"){
        log_push("Hehe you're clever! How about this one?@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
        log_push("2. What five letter word becomes <b>shorter</b> when you add two letters to it?", 0, 2);
        interact.stage = 1;
      }
      else {
        log_push("Not quite. Better luck next time!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
        interact.isopen = false;
      }
    }

    else if(interact.stage == 1){
      if(clean_input(input) == "short"){
        log_push("Correct! How about this one?@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
        log_push("3. I am awesome. I like typing in red font. I know a hacker named c0mrade. Who am I?", 0, 2);
        interact.stage = 2;
      }
      else {
        log_push("Not quite. Better luck next time!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
        interact.isopen = false;
      }
    }

    else if(interact.stage == 2){
      if(clean_input(input) == "babblebot"){
        log_push("You got them all! Heres a secret number: |<span class = \"blink\"><b>049</b></span>|@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
        log_push("I have no idea what it means... @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
      }
      else {
        log_push("Not quite. Better luck next time!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0, 2);
      }
      interact.isopen = false;
    }
  }

  else if(interact.id == 3){
    if(interact.stage == 0){
      if(clean_input(input) == "yes"){
        log_push("Are you <b>sure</b> you want to exit this program [yes/no]?", 0, 2);
        interact.stage = 1;
      }
      else if(clean_input(input) == "no"){
        log_push("Operation canceled.", 0);
        interact.isopen = false;
      }
      else {
        log_push("Answer the question! [yes/no]", 0, 2);
        interact.stage = 1;
      }
    }
    else if(interact.stage == 1){
      if(clean_input(input) == "yes"){
        log_push("Are you <b>sure</b> you want to exit this program [yes/no]?", 0, 2);
      }
      else if(clean_input(input) == "no"){
        log_push("That's what I thought >:)", 0, 2);
        interact.isopen = false;
      }
      else {
        log_push("Answer the question! [yes/no]", 0, 2);
      }
    }

  }

}

function make_response(input){

  //handle interactions between player and computer
  if(interact.isopen){
    handle_interaction(input);
    return;
  }

  //handle player commands
  if(input.includes("$")){
    system_respond(input);
    return;
  }
   //babble bot's response
   bbrespond(input);
}

function bbrespond(input){

  //var special_text1 = "<a href=\"#\" id = \"hyperlink_video1\" data-toggle=\"modal\" onclick=\"openModal(1)\">video</a>"
  var special_text2 = "<a href=\"#\" id = \"hyperlink_video2\" data-toggle=\"modal\" onclick=\"openModal(2)\">play</a>"
  //var special_text = "<canvas id=\"myCanvas\" width=\"200\" height=\"100\" style=\"border:1px solid #000000;\"></canvas>"
  //var response = "Hi there. My name is Babble Bot and I am the AI in charge of guarding C0MRADE's personal computer. Check out this cool| " + special_text1 + "|!";

  if(clean_input(input).includes("canweplaytictactoe")){
    log_push("Challenge accepted!"
    + " I love video games because they transport you into a different world...they "
    + "bring you beyond the bounds of your imagination! Let's |" + special_text2 + "|!", 0, 2);
  }
  else if(clean_input(input).includes("getrichquick123")){
    log_push("*GASP* How did you figure out the secret password? @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Don't be using that in the wrong places...", 0, 2);
  }
  else{
    make_generic_response(input);
  }

  update_log();
}

function make_generic_response(input){
  input = input.toLocaleLowerCase();
  input = input.replace(/[<>,.?/!@#$%^&*-=+']/g, '');
  input = input.split(" ");

  var score = [];
  var index_of_max = 0;
  for(var i = 0; i < responses2.length; i++)
  {
      score[i] = 0;
      var split_response = (responses2[i][0]).split(" ");
      for(var j = 0; j < split_response.length; j++)
      {
        for(var k = 0; k < input.length; k++)
        {
          if(split_response[j] == input[k])
            score[i]++;
        }
      }
      score[i]/=split_response.length;
      if(score[i] > score[index_of_max])
        index_of_max = i;
  }
  console.log(score);
  log_push(responses2[index_of_max][1], 0, 2);
}

function submit_userpass_form(){

  if(game.login == true)
    return;

  if(!testing){
    if($("#username")[0].value.hashCode() != -853093168){
      $("#username")[0].value  = "";
      $("#password")[0].value  = "";
      alert("incorrect username or password :(");
      return;
    }
    if($("#password")[0].value.hashCode() != 1216985755){
      $("#username")[0].value  = "";
      $("#password")[0].value  = "";
      alert("incorrect username or password :(");
      return;
    }
  }

  $("#log_text_holder")[0].style.display = "block";
  $("#input_form")[0].style.display = "block";
  $("#userpass_form")[0].style.display = "none";


  if(!testing){
    log_push("Login Sucessful@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 0);
    log_push("Running system startup...", 0);
    log_push("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@25% ... "
              + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@50% ... "
              + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@75% ... "
              + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@99% ... "
              + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@100%", 0);
    log_push("System ready. Type commands below", 0);
  }

  game.login = true;
}

$("#input_form").submit(function(e) {
e.preventDefault();
  //error checking for blank message
  if($("#input_text")[0].value.length == 0){
    e.preventDefault();
    return;
  }

  //add the text to the log
  if($("#input_text")[0].value.includes("$"))
    log_push($("#input_text")[0].value, $("#input_text")[0].value.length, 3);
  else
    log_push($("#input_text")[0].value, $("#input_text")[0].value.length, 1);
  //handle input
  make_response($("#input_text")[0].value);

  //reset the input to be empty
  $("#input_text")[0].value = "";

  //set the log text, height, content, and scroll
  update_log();
  $("#log_text_holder")[0].scrollTop = $("#log_text_holder")[0].scrollHeight - $("#log_text_holder")[0].clientHeight;

  //prevent the page from reloading
  e.preventDefault();
});

// Close Video Modal If Outside Click
window.addEventListener('click', function closeModal(e) {
  if (e.target == document.querySelector('#modal1')) {
    document.querySelector('#modal1').style.display = 'none';
  }
  if (e.target == document.querySelector('#modal2')) {
    document.querySelector('#modal2').style.display = 'none';
    game.tictac = false;
  }
});

// Open
function openModal(modal_id) {
  if(modal_id == 1){
    $("#modal1")[0].style.display = 'block';
  }
  if(modal_id == 2){
    $("#modal2")[0].style.display = 'block';
    ctx = document.getElementById("mycanvas").getContext("2d");
    game.tictac = true;
    play_game();
  }
}

$(document).on('keydown', function(e) {
       if (e.key == "Escape") {
            document.querySelector('#modal1').style.display = 'none';
            document.querySelector('#modal2').style.display = 'none';
            game.tictac = false;
       }
       if (e.key == "Enter") {
            submit_userpass_form();
       }
   });

//sweet unsecure hashing function borrowed from stack overflow: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
String.prototype.hashCode = function() {
   var hash = 0;
   if (this.length == 0) {
       return hash;
   }
   for (var i = 0; i < this.length; i++) {
       var char = this.charCodeAt(i);
       hash = ((hash<<5)-hash)+char;
       hash = hash & hash;
   }
   return hash;
}

window.onload = function(){
    //set the update loop
    if(!testing)
      interact.isopen = true;
    loop = setInterval(function() {update();} , 1000/fps);
};

function getRandomInt(low, high){
  return Math.floor(Math.random() * Math.floor(high-low)) + low;
}

function clean_input(input){
  input = input.replace(/[@>\-? ]/g, '');
  input = input.toLocaleLowerCase();
  return input;
}

//hacking
//> <a href="#" id = "hyperlink_video1" data-toggle="modal" onclick="openModal(2)">video</a>
