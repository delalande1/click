var on = false;
var bpm = 120;
var circles = [];
var wait = (60000/bpm);
var current = 0;
var interval;
var tap = false;
var secCounter = 0;

var topsCount = 2;
var botsCount = 0;
var tops = [2,3,4,6]
var bots = [4];

var timing = tops[topsCount];
var bottom = bots[botsCount];
var prev = timing -1;


var slider = document.getElementById("slider");
var input = document.getElementById("inputbpm");
var tapTempo = document.getElementById("tap");

var beats = document.getElementById("beats");
var bot =   document.getElementById("doubles");
beats.value = timing;
doubles.value=bottom;
input.value = bpm;

var startBut = document.getElementById("start");
var audio = new Audio('block.wav');

beats.onclick = function(){
    topsCount++ ;
    topsCount %= 4;
    timing = tops[topsCount];
    this.value = timing;
    createCircles();

};

var prevTap = 0;

tapTempo.onclick = function(){
    var tap=performance.now();
    if(prevTap != 0 && tap < 100000)
    {
        bpm = 60000/(tap-prevTap);
        bpm = Math.ceil(bpm);
        slider.value = bpm;
        input.value = bpm;
    }
    prevTap = tap;

}

bot.onclick = function(){
    botsCount++ ;
    botsCount %= 1;
    bottom = bots[botsCount];
    this.value = bottom;
};
slider.oninput = function() {
    bpm = this.value;
    input.value = bpm;
} 

input.oninput = function() {
    bpm = document.getElementById("inputbpm").value;
    slider.value = bpm;
}




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
        circles[prev].classList.remove("active");
        current = 0;
        
        prev = timing-1;
        circles[0].classList.remove("active");

    }

}

function createCircles(){
    var container = document.getElementById("circlecont");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    for(var i = 0; i < timing; i++)
    {
        
        circles[i] = document.createElement("div")
        circles[i].className = "circle";
        document.getElementById("circlecont").appendChild(circles[i]);
    }
}

createCircles();



function beep(){
    if(on){
        audio.play();
        circles[prev].classList.remove("active");
        circles[current].classList.toggle("active");
        current++;
        prev++;
        current = current%timing;
        prev = prev%timing;
        if(bpm < 35)
        {
            bpm = 120;
        }
    }
    function beepRec(){

    setTimeout(function(){
        if(on){
            audio.play();
            circles[prev].classList.remove("active");
            circles[current].classList.toggle("active");
            current++;
            prev++;
            current = current%timing;
            prev = prev%timing;
            if(bpm < 35)
            {
                bpm = 120;
            }

            beepRec();

        }
    }, (60000/bpm));
}
    beepRec();
 }