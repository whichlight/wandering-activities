let tsneData;
let maxX, maxY, minX, minY;
let points = []; // Array to store Point objects
let hoverInfo;

function preload() {
  // Load your JSON file (update the path to your JSON file)
  tsneData = loadJSON('tsne_output.json');
}

function setup() {
  colorMode(HSB, 360,100,100,100);
  createCanvas(windowWidth*0.8, windowHeight); // Set the size of the canvas to full window
  background(0); // Set the background to white
  hoverInfo = new HoverInfo();

  // Ensure that tsneData is an array
  let dataArray = tsneData instanceof Array ? tsneData : Object.values(tsneData);

  // Find the max and min for both dimensions to scale the points
  maxX = max(dataArray.map(d => d['tsne-2d-one']));
  maxY = max(dataArray.map(d => d['tsne-2d-two']));
  minX = min(dataArray.map(d => d['tsne-2d-one']));
  minY = min(dataArray.map(d => d['tsne-2d-two']));

  // Translate the plot to center
  let rangeX = maxX - minX;
  let rangeY = maxY - minY;
  let scale = min(width / rangeX, height / rangeY) * 0.8; // Scale factor (80% of the canvas)

  // Draw the points
  for (let d of dataArray) {
    // Scale and position the t-SNE points to fit the canvas
    let x = map(d['tsne-2d-one'], minX, maxX, -rangeX * scale / 2, rangeX * scale / 2);
    let y = map(d['tsne-2d-two'], minY, maxY, -rangeY * scale / 2, rangeY * scale / 2);

    points.push(new Point(d.activity, x, y));
  }
}

function draw() {
  background(120,100,50); // Redraw background to clear previous hover text
  translate(width / 2, height / 2); // Centering the plot

  // Draw and check hover for each point
  let isHovering = false;
  hoverInfo.activities = [];
  points.forEach(p => {
    p.draw();
    if (p.isHovered()) {
      p.found = true; 
      if(!hoverInfo.activities.includes(p.activity)){
        hoverInfo.activities.push(p.activity);
      }
      isHovering=true;
    }
    
  });

  if(isHovering){
    hoverInfo.show();
  }

  if (!isHovering) {
    hoverInfo.hide();
  }
 
}

class HoverInfo {
  constructor() {
    this.div = document.getElementById('hover-info');
    this.activities = []
  }

  show() {
    let x = mouseX;
    let y = mouseY; 
    let canvasRect = document.querySelector('canvas').getBoundingClientRect();
    let content = this.activities.map((a)=>(
      "<p>" + a + "</p>"
    )).join("");
    this.div.innerHTML = content;
    console.log(content);
  
    this.div.style.left = (canvasRect.left + x + 20) + 'px';
    this.div.style.top = (canvasRect.top + y - 40) + 'px';
    this.div.classList.add('visible'); // Add the visible class to trigger the fade-in

  }

  hide() {
      this.div.classList.remove('visible'); // Remove the visible class to trigger the fade-out
  }
}


class Point {
  constructor(activity, x, y) {
    this.activity = activity;
    this.x = x;
    this.y = y;
    this.r = 20; 
    this.found = false; 
    this.c = random(360);
  }

  draw() {
    if(!this.found){
      fill(0,0,100,50); // Semi-transparent white
    }
    else{
      fill(this.c,100,100,80); // Semi-transparent white

    }
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
  }

  isHovered() {
    return dist(mouseX - width / 2, mouseY - height / 2, this.x, this.y) < (this.r/2);
  }

 
}