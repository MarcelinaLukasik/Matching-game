let ballImgList = ["../static/images/Yellow-ball.png", "../static/images/Green-ball.png", "../static/images/Pink-ball.png"]
let colorList = []
let points = 0

initGame(slots = 16, ballsToSpawn = 3);

function initGame(slots, ballsToSpawn) {
    createSlots(slots);
    initSlotsDropZones();
    spawner(ballsToSpawn);
    initElement();
}

function createSlots(slotsNumber) {
    for ( let i = 0; i < slotsNumber; i++){
        let newSlot = document.createElement("div");
        let parent = document.querySelector(".all_balls");
        newSlot.className = "slot";
        parent.appendChild(newSlot);
    }
}

function ballSpawn(){
    let allSlots = document.querySelectorAll('.slot');
    let newBall = document.createElement("div");
    let newBallImg = document.createElement("img");

    let randomBallColor = ballImgList[Math.floor(Math.random() * ballImgList.length)];
    let freeSlot = false;
    while (freeSlot == false) {                                                     // gets random slot, checks slot for children(balls),
        let randomSlot = allSlots[Math.floor(Math.random() * allSlots.length)];   // if randomSlot is empty returns true and ends the loop
        let slotChildren = randomSlot.children;
        if (randomSlot.nodeName == "DIV" && slotChildren.length == 0) {
            freeSlot = true;
    }
    newBall.className = "ball"
    ballNames(randomBallColor, newBall);
    newBallImg.src = randomBallColor;
    newBall.appendChild(newBallImg);
    randomSlot.appendChild(newBall);
    }
}

function ballNames(randomBallColor, newBall) {
    if ( randomBallColor.includes("Orange")){    //sets the title for ball, used later to check when 3 balls match
        newBall.title = "Orange";
    }
    else if ( randomBallColor.includes("Blue")) {
        newBall.title = "Blue";
    }
    else if ( randomBallColor.includes("Yellow")) {
        newBall.title = "Yellow";
    }
    else if ( randomBallColor.includes("Green")) {
        newBall.title = "Green";
    }
    else if ( randomBallColor.includes("Pink")) {
        newBall.title = "Pink";
    }
}

function spawner(spawnCount) {
    for ( let i = 0 ; i < spawnCount; i++) {
        ballSpawn();
    }
}

function initSlotsDropZones(){
    let allBalls = document.querySelectorAll('.slot');
    let initialId = 0;

    allBalls.forEach( function(element) {
        element.id = "slot_" + (initialId++);
        element.setAttribute("draggable", false)
        element.addEventListener("drop", handleDrop);
        element.addEventListener("dragover", handleDragOver);
    })
}

function initElement(){
    let allBalls = document.querySelectorAll('.ball');
    let initialId = 0;
    allBalls.forEach( function(element) {
        element.setAttribute("draggable", true)
        element.addEventListener("dragstart", handleDragStart);
        element.firstElementChild.setAttribute("draggable", false);
        element.id = "ball_" + (initialId++);
    })
}

function handleDragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function handleDrop(ev) {
    let parent = ev.target;

    if (ev.target.nodeName == "IMG" ) {
            return false;
    }
    let slotChildren = ev.target.children;
    if (ev.target.nodeName == "DIV" && slotChildren.length != 0) {
            return false;
    }
    const id = ev.dataTransfer.getData("text/plain");
    let divWithImg = document.getElementById(id);
    parent.appendChild(divWithImg); // appends ball to the slot
    ev.preventDefault();
    ballSpawn();
    initElement();
    getBallsList();
}

function handleDragOver(ev) {
    ev.preventDefault();
}

function getBallsList() {
    colorList = [];
    let allSlots = document.querySelectorAll('.slot');
    for ( const slot of allSlots){    // creates list of "X" when slot is empty, and "color-name"(from 'title') when ball is in slot
        let ball = slot.firstChild;
        if ( ball != null){
            let ballColor = ball.getAttribute('title');
            colorList.push(ballColor);
        }
        else {
            colorList.push("X");
        }
    }
    matchBalls(allSlots);
}

function matchBalls(allSlots) {
    let currentColor = document.getElementById('ColorToMatch').title;
    for ( let i = 0; i < (allSlots.length -2); i++) {                                     // for loop iterates over every slot
         if (i === 2 || i === 3 || i === 6 || i === 7 || i === 10 || i === 11 || i === 14){      // skip slots, where result is 3 balls next to each other but not displayed in a row on page
            if ( colorList[i] === currentColor && colorList[i] === colorList[i +1] && colorList[i+1] === colorList[i+2]
                && colorList[i] !== "X" ) {
            continue;
        }
    }
        else if (i !== 1 && i !== 5 && i !== 9 && i !== 13  // skip slots, where result is 4 balls next to each other but not displayed in a row on page
             && colorList[i] === currentColor && colorList[i] === colorList[i +1] // checks for 4 in a row
             && colorList[i+1] === colorList[i+2] && colorList[i+2] === colorList[i+3] && colorList[i] !== "X") {
            points += 20;
            let slot_count = 4
            highlights(allSlots, i, slot_count);
            allSlots[i].removeChild(allSlots[i].firstChild);              // delete ball
            allSlots[i +1].removeChild(allSlots[i +1].firstChild);
            allSlots[i +2].removeChild(allSlots[i +2].firstChild);
            allSlots[i +3].removeChild(allSlots[i +3].firstChild);
            colorToMatchChange();
            getBallsList();
         }
        else if (colorList[i] === currentColor && colorList[i] === colorList[i +1] && colorList[i+1] === colorList[i+2]  // checks for 3 in a row
             && colorList[i] !== "X") {
            points += 10;
            let slot_count = 3
            highlights(allSlots, i, slot_count);
            allSlots[i].removeChild(allSlots[i].firstChild);
            allSlots[i +1].removeChild(allSlots[i +1].firstChild);
            allSlots[i +2].removeChild(allSlots[i +2].firstChild);
            colorToMatchChange();
            getBallsList(); // checks if there are already some matches after new color to match is assigned
        }
    }
    let colorSet = new Set(colorList);  // if board is empty, spawn new ball
         if (colorSet.size == 1) {
            ballSpawn();
            initElement();
         }

    gameOverCheck();
    document.getElementById('score').textContent = String(points);
}

function highlights(allSlots, i, slot_count) {
    if (slot_count == 4) {
    allSlots[i].classList.add("highlight");
    allSlots[i +1].classList.add("highlight");
    allSlots[i +2].classList.add("highlight");
    allSlots[i +3].classList.add("highlight");

    setTimeout(() => {
        allSlots[i].classList.remove("highlight");
        allSlots[i +1].classList.remove("highlight");
        allSlots[i +2].classList.remove("highlight");
        allSlots[i +3].classList.remove("highlight");
        }, 1000);
    }
    else if (slot_count == 3) {
    allSlots[i].classList.add("highlight");
    allSlots[i +1].classList.add("highlight");
    allSlots[i +2].classList.add("highlight");

        setTimeout(() => {
            allSlots[i].classList.remove("highlight");
            allSlots[i +1].classList.remove("highlight");
            allSlots[i +2].classList.remove("highlight");
            }, 1500);
    }
}


function colorToMatchChange() {
    let currentColor = document.getElementById('NextColor').src;
    document.getElementById('ColorToMatch').src = currentColor;
    let randomColor = ballImgList[Math.floor(Math.random() * ballImgList.length)];
    document.getElementById('NextColor').src = randomColor;
    let ballColorDiv = document.getElementById('ColorToMatch');
    let nextColorDiv = document.getElementById('NextColor');
    ballNames(currentColor, ballColorDiv);  // set the title for current color
    ballNames(randomColor, nextColorDiv);   // set the title for next color
}

function gameOverCheck() {
     if (!colorList.includes("X")) {
             let messageDiv = document.createElement("div");
             let parent = document.querySelector(".all_balls");
             let form = document.createElement("form");
             let button = document.createElement("button")
             let user_name_field = document.createElement("input");
             form.setAttribute('action', "/High_score");
             user_name_field.type = "text";
             user_name_field.id = "username";
             user_name_field.placeholder = "YOUR USERNAME";
             form.appendChild(button)
             form.appendChild(user_name_field)
             button.innerHTML = "Submit score";
             button.className = "submit_score";
             button.addEventListener("click", user_score);
             messageDiv.className = "game_over";
             parent.appendChild(messageDiv);
             parent.appendChild(form);
             messageDiv.insertAdjacentText("afterbegin", 'GAME OVER');
         }
}

function restart() {
    location.reload();
}

function user_score() {
    let new_username = document.getElementById('username').value
    const dict_values = {score: points, name: new_username}
    const user_data = JSON.stringify((dict_values))
    $.ajax( {
        url: "/High_score",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(user_data)
    });
}


