function setup() {
  canvasX = 600;
  canvasY = 387;
  createCanvas(canvasX, canvasY);
  
  r = 25;
  x = r;
  y = r;
  SpeedX = 3;
  SpeedY = 3;
}

function draw() {
  background(220,50,150);
  if(x > canvasX - r||x < r)SpeedX *= -1;
  if(y > canvasY - r||y < r)SpeedY *= -1;
  
  x += SpeedX;
  y += SpeedY;

  circle(x,y,r);

}