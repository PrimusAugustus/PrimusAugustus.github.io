let zBereich;

function setup() {

  zBereich = createCanvas(windowWidth, windowHeight);
  zBereich.position(0,0);//Links oben
  zBereich.style('z-index','-1') //Verschiebung auf der Z-Achse

  r = 0;
  g = 0;
  b = 0;
  fR = 1; // Faktor Rot
  fG = 2;
  fB = 3;
  
}

function draw() {
 //background(10,80,10);
 rot = mouseX*255/windowWidth;
 blau = mouseY*255/windowHeight;
  noStroke;
 fill(rot,50,blau);
  circle(mouseX,mouseY,50);
  
}