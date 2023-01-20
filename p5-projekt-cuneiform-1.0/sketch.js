 

let userInput = document.getElementById('userInput').value; //Eingabefeld
let dots = [];
let font;
let mouseRadius;  
let textBox = []; //Größe des Textes
let dotSize;  //Größe der Punkte
let textTime; //Speichert Alter der Eingabe
let canvHeight = 400; //Höhe des Canvas



function preload(){
  initialiseFont("EasyCuneiform.ttf"); //Initialisierung des Fonts
  }


function setup(){
  let txt;
  if(userInput.length > 0) txt = userInput;
  else txt = 'text';                     //Dieser Text wird angezeigt
  let txtSize = 0.8*windowWidth/txt.length;      //Größe des Textes
  if(txtSize > 250) txtSize = 250;
  let textCornerX = txtSize/10;        //Ecke linksunten vom Text/ Position des Textes
  let textCornerY = txtSize;
  mouseRadius = 50;                     //Radius um die Maus in dem Punkte vertrieben werden in px
  dotSize = txtSize/20;                 //Größe der Punkte in px

  createCanvas(windowWidth, canvHeight);       //Größe des des Bildes, in Pixeln; x,y;     möglich: windowWidth,windowHeigth
    
  
  textBox = [textCornerX,textCornerY,0,canvHeight]; //x1,y1,x2,y2 der Box des Textes
   
  textForm(txt,txtSize);                 // Inhalt und Größe des Textes

  
}

function draw(){

  //Wenn es einen neuen Input gibt, wird er gespeichert und die Zeit gestoppt
  if(userInput != document.getElementById('userInput').value){
    textTime = millis();
    userInput = document.getElementById('userInput').value;
  }
  
  //Ist nach 1,5s der Input noch der gleiche, wird das Bild neu geladen
  else if((millis() - textTime) > 1500 && textTime != -1){
    mysetup();
    textTime = -1;
  }

  //Normale Ausführung des Sketches
  mydraw();
}


//Setup und draw ausgelagert, damit es neustartbar ist


function mysetup() {
  dots = [];
  let txt = userInput;                  //Dieser Text wird angezeigt
  let txtSize = 0.8*windowWidth/txt.length;                    //Größe des Textes
  if(txtSize > 250) txtSize = 250;
  let textCornerX = txtSize/10;         //Ecke linksunten vom Text/ Position des Textes
  let textCornerY = (height/2);
  dotSize = sqrt(txtSize)*0.7;  //Punktgröße in abhängigkeit von Schriftgröße

  
  textBox = [textCornerX,textCornerY,0,height]; //x1,y1,x2,y2 der Box des Textes
   
  textForm(txt,txtSize);                 // Inhalt und Größe des Textes
  
}


function mydraw() {
  background(200,255,200);                //Hintergrundfarbe Rot,Grün,Blau (0-255)

  
  moveDots();
  showDots();

  //Mausradclick -> Neuverteilung; '#' -> Punkte gehen an Zielposition
  if(mouseIsPressed && mouseButton === CENTER) spreadDots();
  if(key == '#' && keyIsPressed && focused) dotsGoHome();
}




/**************************/
/******* FUNKTIONEN *******/
/**************************/

function mouseOnCanvas(){
  return (mouseX < width && mouseY < height);
}


//Lädt Font 
function initialiseFont(font_name){

  console.log(font_name);
  font = loadFont(font_name);
}


//Wandelt Text in Punkte um und erstellt Punkte
function textForm(content,size){
  textFont(font);
  textSize(size);
  let points = font.textToPoints(content,textBox[0],textBox[1]);
  for(i = 0; i < points.length; i++){
    let doT = new dot(points[i].x,points[i].y,i);
    
    dots.push(doT);
  }
}

//Funktionen, die alle Punkte ansprechen


//Druckt alle Punkte
function showDots(){
  noStroke();
  for(let i = 0; i < dots.length; i++){
    dots[i].show();
  }
}

//bewegt alle Punkte
function moveDots(){
  for(let i = 0; i < dots.length; i++){
    dots[i].move();
  }
}

function dotsGoHome(){
  for(let i = 0; i < dots.length; i++){
    dots[i].goHome();
  }
}

function spreadDots(){
  for(let i = 0; i < dots.length; i++){
    dots[i].posX = (int)(random(width));
    dots[i].posY = (int)(random(height));
    dots[i].atHome = false;
  }
}




/******** Punkt-Klasse ********/

class dot{
  constructor(x,y,nummer){
   
    this.posX = (int)(random(width));   //Startkoordinaten
    this.posY = (int)(random(height));
    this.homeX = x;                     //Zielkoordinaten des Punktes
    this.homeY = y;
    this.atHome = false;                //Ist der Punkt am Ziel?
    this.colour = 'yellow';             //temporäre Farbe des Punktes
    this.speed = 1/(random(100,300));   //Geschwindigkeitsmanipulator
    this.minSpeed = 1/(random(10,40)); //Standartgeschwindigkeit
    this.number = nummer; // nummer

    if(x > textBox[2]) textBox[2] = x;  //TextBox speichert Grenzen des Textes ein
    if(y < textBox[3]) textBox[3] = y;
  }

  move(){
    let dirX;
    let dirY;

    //Vor Maus abhauen
    
    if(mouseIsPressed && mouseButton != CENTER && mouseOnCanvas() && sqrt((sq(mouseX-this.posX))+(sq(mouseY-this.posY)^2)) < mouseRadius){
      dirX = 0.1*sq(this.posX-mouseX)/(this.posX-mouseX);
      dirY = 0.1*sq(this.posY-mouseY)/(this.posY-mouseY);
      this.posX += dirX;    //eigentliche Verschiebung des Punktes
      this.posY += dirY;

      this.atHome = false;
      this.colour = 'yellow';
    }

    else{
      // Zurücksetzung der Farbe
      if(this.colour == 'yellow'){
      this.colour = color(map(this.homeX,textBox[0],textBox[2],0,255),map(this.number,0,dots.length,150,0),map(this.homeY,textBox[1],textBox[3],0,255));
        }
      
        //Bewegung des Punktes (Falls noch nicht am Ziel):

      if(!this.atHome){

        dirX = this.homeX-this.posX;
        dirY = this.homeY-this.posY;
      
        //Verschiebung des Punkts
        this.posX += (this.minSpeed*dirX/abs(dirX))+(dirX*this.speed);
        this.posY += (this.minSpeed*dirY/abs(dirY))+(dirY*this.speed);


        //Ist der Punkt am Zielort?
        if((abs(this.homeY-this.posY)) < 0.3 && (abs(this.homeX-this.posX)) < 0.3) {

          this.goHome();
        }
      }
    
    }
  }
  //Malt den Punkt
  show(){
    fill(this.colour);
    circle(this.posX,this.posY,dotSize);
  }

  //Bewegt den Punkt zu den Zielkoordinaten
  goHome(){
    this.posX = this.homeX;
    this.posY = this.homeY;
    this.atHome = true;
  }
}



