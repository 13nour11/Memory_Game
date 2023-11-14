let yourName = "";
let allmatchedBlocks = [];
let flag = false;
let timerInterval;
let timerSoundPlayed = false;

// Select The Start Game Button
document.querySelector(".control-buttons span").onclick = function () {
    // Prompt Window To Ask For Name
    yourName = prompt("What's your name?");

    // If Name Is Empty
    if (yourName == "" || yourName == null) {
        // Set Name To Unknown
        document.querySelector(".name span").innerHTML = "Unknown";
    }
    // Name Is Not Empty
    else {
        // Set Name To Your Name
        document.querySelector(".name span").innerHTML = yourName;
    }

    // Remove Splash Screen
    document.querySelector(".control-buttons").remove();

    document.getElementById("start").play();

    // Start the game timer only if the player entered their name
    startGameTimer();

    gameFinished(yourName);
};

// Effect Duration
let duration = 1000; // 1000 msec
// Select Blocks Container
let blocksContainer = document.querySelector(".memory-game-blocks");
// Create Array From Game Blocks
let blocks = Array.from(blocksContainer.children); // كل العناصر اللي جوة البلوك الكبير اللي اسمه => "memory-game-blocks"
// console.log(blocks); // array include 20 elements

// Create Range Of Keys
// let orderRange = [...Array(blocks.length).keys()]; //keys() => indexes of the array which start from 0 // Array(blocks.length) => make an empty array whose size is 20 //... => to extract all of them inside the array , افضي او اوزعهم فالاراي بتاعي keys or indexes
// the same
let orderRange = Array.from(Array(blocks.length).keys());
// console.log(orderRange); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

// console.log(orderRange); // fixed array => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
shuffle(orderRange);
// console.log(orderRange); // random array(shuffle) => [11, 13, 14, 19, 1, 10, 6, 3, 16, 2, 12, 18, 8, 4, 0, 5, 9, 15, 7, 17]

// Add Order Css Property To Game Blocks
blocks.forEach((block , index) => {
    // Add CSS Order Property
    block.style.order = orderRange[index];

    // Add Click Event
    block.addEventListener('click' , function(){
        // Trigger The Flip Block Function
        flipBlock(block);
    });
});
// blocks.forEach(block => {
//     console.log(block); // get each one of all blocks
// })

// Flip Block Function
function flipBlock(selectedBlock){
    // Add Class is-flipped
    selectedBlock.classList.add('is-flipped');
    // Collect All Flipped Cards
    // get the flippedBlock which those className 'is-flipped'
    let allFlippedBlocks = blocks.filter(flippedBlock => flippedBlock.classList.contains('is-flipped'));
    
    // If Theres Two Selected Blocks
    if(allFlippedBlocks.length === 2){
        // console.log('Two Flipped Blocks Selected');

        // Stop Clicking Function
        stopClicking();

        // Check Matched Block Function
        checkMatchedBlocks(allFlippedBlocks[0] , allFlippedBlocks[1]);
    }
}

// Stop Clicking Function
function stopClicking(){
    // Add Class No Clicking on Main Container
    blocksContainer.classList.add('no-clicking');
    // Wait Duration
    setTimeout(() =>{
        // Remove Class No Clicking After The Duration
        blocksContainer.classList.remove('no-clicking');
    }, duration);
}

// Check Matched Block Function

function checkMatchedBlocks(firstBlock , secondBlock){
    let trialsElement = document.querySelector(".trials span");

    if(firstBlock.dataset.technology === secondBlock.dataset.technology){
        firstBlock.classList.remove('is-flipped');
        secondBlock.classList.remove('is-flipped');

        firstBlock.classList.add('has-match');
        secondBlock.classList.add('has-match');

        document.getElementById('success').play();
        // =====================================
        allmatchedBlocks.push(firstBlock,secondBlock);
        // console.log(allmatchedBlocks);
        
        gameFinished( yourName, trialsElement.innerHTML);
        
    }
    else{
        trialsElement.innerHTML = parseInt(trialsElement.innerHTML) + 1 ;

        setTimeout( () => {
            firstBlock.classList.remove('is-flipped');
            secondBlock.classList.remove('is-flipped');
        }, duration);

        document.getElementById('fail').play();
    }
    // console.log(allmatchedBlocks.length);   
}


// Finish the Game
function gameFinished(name, trialNum) {
    name = name || "Unknown";

    if (allmatchedBlocks.length === blocks.length) {
        // DOM
        // Create Elements 'Div'
        let newDiv = document.createElement("div");
        let insideDiv1 = document.createElement("div");
        let insideDiv2 = document.createElement("div");

        // Get Player's Name
        insideDiv1.textContent = `Player's Name: ${name},`;
        insideDiv1.className = "name";
        newDiv.className = "info-containear";

        // Get His/Her Trial Number
        insideDiv2.textContent = `Trial Number: ${trialNum}`;
        insideDiv2.className = "trials";

        // Append
        newDiv.appendChild(insideDiv1);
        newDiv.appendChild(insideDiv2);
        document.body.append(newDiv);

        // BOM
        // Local Storage
        //[1] player's name
        let currPlayer = window.localStorage.getItem("names") || ",";
        let newPlayer = currPlayer + "\n" + name;
        // [2] trials Number
        let currTialNum = window.localStorage.getItem("trials") || ",";
        let updateTrialNum = currTialNum + "\n" + trialNum;
        // [1] Store the new player/s name
        window.localStorage.setItem("names", newPlayer);
        // [2] Store the new trials number
        window.localStorage.setItem("trials", updateTrialNum);

        // Ask the player if he/she want to play again
        document.getElementById("win").play();
        // setTimeout(()=>{
            
        //     // alert("Congratulations1111");
        //     // handleGameRestart();
        // }
            
        // ,  duration * 2); // 1000 * 2 = 2000
    }
}

// Reset The Game
function resetGame() {
    // Promot To Get New Player's Name
    yourName = "";
    yourName = prompt("What's Your Name?"); //let newPlayerName 
    // If Name Is Empty
    if (yourName == "" || yourName == null) {
        // Set Name To Unknown
        document.querySelector(".name span").innerHTML = "Unknown";
    }
    // Name Is Not Empty
    else {
        // Set Name To Your Name
        document.querySelector(".name span").innerHTML = yourName;
    }

    // Clear the matched blocks array
    allmatchedBlocks = [];
    // Reset The Trial Counter
    document.querySelector(".trials span").innerHTML = 0;

    shuffle(orderRange);

    // Reset the order of blocks in the DOM
    blocks.forEach((block, index) => {
        block.style.order = orderRange[index];
        block.classList.remove("is-flipped", "has-match");
    });

    // Reset Timer
    clearInterval(timerInterval); // Stop the timer if the game is won
}

// Duration To Finish Up
let finishDuration = 85_000; // 120_000 sec 

function startGameTimer() {
    let sec = finishDuration / 1000; // To Convert Into Seconds
    if (flag === true) {
        flag = flag;
    } else {
        flag = false;
    }

    // DOM
    // Create A Single Timer Element
    let timerDiv = document.createElement("div");

    timerDiv.style.backgroundColor = "whitesmoke";
    timerDiv.style.margin = "20px auto 0 20px";
    timerDiv.style.padding = "20px";

    // make circle
    timerDiv.style.borderRadius = "50%";
    timerDiv.style.height = "40px";
    timerDiv.style.width = "40px";

    timerDiv.style.textAlign = "center";

    // عشان الكلام كان برا الدايرة
    timerDiv.style.display = "flex";
    timerDiv.style.alignItems = "center"; // Center vertically
    timerDiv.style.justifyContent = "center";

    timerDiv.style.border = "3px solid #795377"; // rgba(94, 99, 158, 0.9)
    timerDiv.style.float = "left";
    timerDiv.style.fontSize = "14px";
    timerDiv.style.fontWeight = "bold";
    timerDiv.style.position = "fixed"; // set the position to fixed
    timerDiv.style.top = "0";
    timerDiv.style.left = "0";

    document.body.append(timerDiv);

    timerInterval = setInterval(() => {
        timerDiv.textContent = `${sec} sec`;

        if (!timerSoundPlayed && sec === 5) {
            document.getElementById("timer").play();
            timerSoundPlayed = true;
        }

        if (allmatchedBlocks.length === blocks.length) {
            clearInterval(timerInterval); // Stop the timer if the game is won
            
            setTimeout(() => {
                document.getElementById("win").play();
                alert(`Congratulations! ${yourName}`);
                handleGameRestart();
            }, 1200);
        } 
        else if (sec === 0 && flag)  { // ===
            // sec = 0; 
            clearInterval(timerInterval);
            document.getElementById("gameOver").play();
            setTimeout(() => {
                alert("Game Over!");
                handleGameRestart();
            }, 1000);
        }
        else if(sec <= 0){
            // sec = 0; 
            clearInterval(timerInterval);
            document.getElementById("gameOver").play();
            setTimeout(() => {
                
                alert("Game Over!");
                handleGameRestart();
            }, 1000);

        }
        
        else if (sec > 0){
            sec--;
        }
    }, 1000); // Update every second
}

// Function to handle game restart
function handleGameRestart() {
    yourName="";
    yourName = confirm("Do You Want To Play Again?"); //let playAgain 
    if (yourName) {
        resetGame();
        timerSoundPlayed = false; // Reset timer sound flag
        startGameTimer();
    } else {
        window.location.reload(); // Reload The Page
    }
}

// Shuffle Function
function shuffle(array) {
    // Settings Vars
    let current = array.length,
        temp,
        random;

    while (current > 0) {
        // Get Random Number
        random = Math.floor(Math.random() * current);
        // Decrease Length by 1
        current--;
        // console.log(random);

        // [1] Save Current Element in Stash (box or temp)
        temp = array[current];
        // [2] Current Element = Random Element
        array[current] = array[random];
        // [3] Random Element = Get Element From Stash
        array[random] = temp;
    }
    return array;
}

// **************************************
// Current Array [9, 2, 10, 4, 5, 6, 7, 3, 1, 8]
/*
  [1] Save Current Element in Stash
  [2] Current Element = Random Element
  [3] Random Element = Get Element From Stash
*/
