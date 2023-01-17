/*
Einstellungen können folgende gemacht werden:
Font des Textes:  line 22
Inhalt des Textes:  26
Größe des Textes: 27
Koordinaten des Textes: 28,29
Einflussbereich der Maus: 30
Größe der Dots: 31
Größe des Bildes: 33
Hintergrundfarbe: 44
*/


let dots = [];
let font;
let mouseRadius;
let textBox = []; //Größe des Textes
let dotSize;


function preload(){
  initialiseFont("EasyCuneiform.ttf"); //Name des Fonts
  }

function setup() {
  let txt = 'Hase';                     //Dieser Text wird angezeigt
  let txtSize = 200;                    //Größe des Textes
  let textCornerX = 20;                 //Ecke linksunten vom Text/ Position des Textes
  let textCornerY = 200;
  mouseRadius = 50;                     //Radius um die Maus in dem Punkte vertrieben werden in px
  dotSize = 10;                         //Größe der Punkte in px

  createCanvas(windowWidth, 400);       //Größe des des Bildes, in Pixeln; x,y;     möglich: windowWidth,windowHeigth
    
  
  textBox = [textCornerX,textCornerY,0,height]; //x1,y1,x2,y2 der Box des Textes
   
  textForm(txt,txtSize);                 // Inhalt und Größe des Textes

}


function draw() {
  background(200,255,200);                //Hintergrundfarbe Rot,Grün,Blau (0-255)

  moveDots();
  showDots();

  if(mouseIsPressed && mouseButton === CENTER) spreadDots();
  if(key == 'i' && keyIsPressed) dotsGoHome();
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
    this.speed = 1/(random(120,400));   //Geschwindigkeitsmanipulator
    this.minSpeed = 1/(random(15,75)); //Standartgeschwindigkeit
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



