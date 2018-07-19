//import DOM elements from document
var sliderInput = document.getElementById("slider");
var textInput = document.getElementById("inputbpm");
var tapTempo = document.getElementById("tap");

var beats = document.getElementById("beats");
var count =   document.getElementById("doubles");
var startBut = document.getElementById("start");

var select = document.getElementById("soundselect");


//STORING DATA
//storing the circle counters
var circles = [];
var current = 0;
var circleCount;

//storing the time signature
var numeratorCurrent = 1;
var denominatorCurrent = 0;

var numeratorList = [3,4]
var denominatorList = [4];

var numerator = numeratorList[numeratorCurrent];
var denominator = denominatorList[denominatorCurrent];
var previousCircle = numerator - 1;
var currentCircle = 0;

//storing the tap tempo variables
var tapTempoCt = 0;
var tapCache = [0,0,0,0];

var interval;


//assign each set of sounds to a variable and store them in an array
var ableton = ['sounds/ableton.mp3', 'sounds/abletonUp.mp3'];
var cubase = ['sounds/cubase.wav', 'sounds/cubaseUp.wav'];
var flstudio = ['sounds/flstudio.wav', 'sounds/flstudioUp.wav'];
var logic = ['sounds/logic.wav', 'sounds/logicUp.wav'];
var marimba = ['sounds/marimba.wav', 'sounds/marimbaUp.wav'];
var maschine = ['sounds/maschine.wav', 'sounds/maschineUp.wav'];
var mpc = ['sounds/mpc.wav', 'sounds/mpcUp.wav'];
var protools = ['sounds/protools.wav', 'sounds/protoolsUp.wav'];
var reason = ['sounds/reason.wav', 'sounds/reasonUp.wav'];
var sonar = ['sounds/sonar.wav', 'sounds/sonarUp.wav'];
soundList = [ableton, cubase, flstudio, logic, marimba, maschine, mpc, protools, reason, sonar];


//functions called by the html
function updateSound() {
    sounds = soundList[select.selectedIndex];
}

//INITIALISING
//initialise global variables
var on = false;
var bpm = 120;

//initialise selected sound
var sounds = soundList[select.selectedIndex];
textInput.value = bpm;
sliderInput.value = bpm;
//initialise the time signature
beats.value = numerator;
count.value = denominator;

//initialise the circles
createCircles();


//BUTTONS ONCLICK
//changing time signature numerator & denominator
beats.onclick = function(){
    numeratorCurrent++ ;
    numeratorCurrent %= 2;
    numerator = numeratorList[numeratorCurrent];
    this.value = numerator;
    previousCircle = numerator-1
    currentCircle = 0;
    createCircles(numerator);
    circles.forEach(function(circle){
            circle.classList.remove("active");
    });
    
    
};

count.onclick = function(){
    denominatorCurrent++ ;
    denominatorCurrent %= 1;
    denominator = denominatorList[denominatorCurrent];
    this.value = denominator;
};

//increase and decrease buttons
function inc(number){
    bpm += number;
    updateBpm();
} 

//tap tempo
tapTempo.onclick = function(){
    if(tapTempoCt < 3){
        tapCache[tapTempoCt] = performance.now();
        tapTempoCt++;
        tapTempo.value = (tapTempoCt +1);
    }else{
        tapCache[tapTempoCt] = performance.now();
            tapTempoCt = 0;
            tapTempo.value = "Tap";

            bpm = 60000/(((tapCache[1]-tapCache[0])+(tapCache[2]-tapCache[1])+(tapCache[3]-tapCache[2]))/3);
            bpm = Math.ceil(bpm);
            updateBpm();
    }
}

//changes bpm value when slider or text is changed
sliderInput.oninput = function() {
    bpm = this.value;
    updateBpm();
} 

textInput.oninput = function() {
    bpm = document.getElementById("inputbpm").value;
    updateBpm();
}



//Turns the metronome on
function start(){
    if(on == false)
    {
        on = true;
        beep();
        startBut.value = "Stop";

    }
    else
    {
        on = false;
        startBut.value = "Start";
        clearInterval(interval);
        circles[previousCircle].classList.remove("active");
        currentCircle = 0;
        previousCircle = numerator-1;
        circles[0].classList.remove("active");

    }

}

//function used to dynamically create the circles
function createCircles(){
    var container = document.getElementById("circlecont");
    circleCount = numerator;
    var numCircles = container.childElementCount;
    while(numCircles != circleCount)
    {
        if (numCircles > circleCount) {
        container.removeChild(container.lastChild);
        circles.slice(-1);
        numCircles--;
        }
        else
        {      
            newCircle = document.createElement("div")
            newCircle.className = "circle";
            document.getElementById("circlecont").appendChild(newCircle);
            circles[circles.length] = newCircle;
            numCircles++;
        }
    }
    circles.forEach(function(circle){
        circle.onclick = function(){
            circle.classList.toggle("accent");
        }
    });
}


//function used to set metronome into loop
function beep(){
    if(on){
        playSound();
    }
    interval = setInterval(function(){
        if(on){   
            playSound();
        }
    }, (60000/bpm));
}

//plays the sound and selects next circle while storing previous
function playSound() {
    var sound = new Audio(sounds[0]);
    if(circles[currentCircle].classList.contains("accent"))
    {
        sound = new Audio(sounds[1]);
    }
    sound.play();

    circles[previousCircle].classList.remove("active");
    circles[currentCircle].classList.toggle("active");
    currentCircle++;
    previousCircle++;
    currentCircle = currentCircle%(numerator);
    previousCircle = previousCircle%(numerator);
    if(bpm < 35)
    {
        bpm = 120;
    }
}

//Utility
//start stop on spacebar
window.onkeypress = function(event) {
    if (event.keyCode == 32 || event.keyCode == 0) {
       start();
    }
 }

//updates the bpm across the app
function updateBpm(){
    sliderInput.value = bpm;
    textInput.value = bpm;

    if(on)
    {
        if(current > numeratorList[numeratorCurrent])
        {
            current = 0;
        }
        clearInterval(interval);
        beep();
    }
}