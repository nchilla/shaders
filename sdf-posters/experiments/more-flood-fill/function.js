var resolutionXy={x:500,y:500};
let sq=2;
let canvas=document.querySelector('canvas');
let ctx=canvas.getContext('2d');

let colorGrid;
let seeds=[];
let seedCount=20;

let xCount;
let yCount;



function resolutionChange(){
  console.log('updating resolution');
  canvas.width=canvas.offsetWidth;
  canvas.height=canvas.offsetHeight;

  resolutionXy.x=canvas.width;
  resolutionXy.y=canvas.height;

  xCount=Math.ceil(resolutionXy.x/sq);
  yCount=Math.ceil(resolutionXy.y/sq);

  generateSeeds(seedCount);
  gridReset();
  manhattanGradientPaint();


}


function generateSeeds(n){
  console.log('generating seeds');
  seeds=[];
  for (var i = 0; i < n; i++) {
    seeds.push([
      Math.floor(Math.random()*xCount),
      Math.floor(Math.random()*yCount),
    ])
  }
}


function gridReset(){
  console.log('resetting grid')

  colorGrid=[];
  for (var x = 0; x < xCount; x++) {
    colorGrid.push([]);
    for (var y = 0; y < yCount; y++) {
      colorGrid[x].push({
        color:0,
        wave:undefined,
        origin:undefined,
        distance:undefined
      })
    }

  }


  for(let i=0;i<seeds.length;i++){
    colorGrid[seeds[i][0]][seeds[i][1]]={
      color:1,
      wave:1,
      origin:i,
      jfaOrigin:seeds[i],
      distance:0
    }
  }

}

window.addEventListener('resize',resolutionChange);
window.addEventListener('load',startUp);



function startUp(){
  resolutionChange();
  buttons();


}


function buttons(){
  document.querySelectorAll('#button-panel button').forEach((item, i) => {
    item.addEventListener('click',handleClick)
  });

  function handleClick(){
    console.log('clicked');
    switch(event.target.id){
      case 'manhattan-flood':
      gridReset();
      breadthFirstFlood();
      // console.log(colorGrid)
      manhattanGradientPaint();
      break;
      case 'change-seeds':
      generateSeeds(seedCount);
      gridReset();
      manhattanGradientPaint();
      break;
      case 'sdf':
      breadthFirstFlood();
      sdfPaint();
      break;
      case 'jump-flood':
      jumpFlood();
      jfaSdf();
      break;
    }
  }
}




//depth-first won't work for SDFs, because it's going to fill all the pixels in from the first item.


function breadthFirstFlood(){
  let queue=[...seeds];
  let wave=2;
  while(queue.length>0){
    let newQueue=[];
    //loop through neigbor x vals
    for(let i=0,n=queue.length;i<n;i++){

      let bX=queue[i][0];
      let bY=queue[i][1];
      for(let x=-1;x<=1;x++){
        //loop through neigbor y vals
        for(let y=-1;y<=1;y++){
          let nX=bX+x;
          let nY=bY+y;

          //make sure neighbor exists, and check that it's not already filled in
          if(nX>=0&&nX<xCount&&
             nY>=0&&nY<yCount&&
             colorGrid[nX][nY].color==0
          ){
            //fill it in
            colorGrid[nX][nY].color=1;
            //record when it was filled
            colorGrid[nX][nY].wave=wave;
            //record the seed where it originated
            colorGrid[nX][nY].origin=colorGrid[bX][bY].origin;
            //add it to the queue
            newQueue.push([nX,nY]);
          }
        }
      }
    }

    queue=newQueue;

    wave++;
  }

   // manhattanGradientPaint();
}



function jumpFlood(){



  // console.log(colorGrid)
}

function compareManhattanDistance(vec,origin1,origin2){
  let d1=Math.abs(vec[0]-origin1[0])+Math.abs(vec[1]-origin1[1]);
  let d2=Math.abs(vec[0]-origin2[0])+Math.abs(vec[1]-origin2[1]);

  return d1<d2;
  //return true for origin1 being lower, false for origin 2 being lower
}





function manhattanGradientPaint(){
  // console.log(colorGrid);
  for(let x=0,n1=colorGrid.length;x<n1;x++){
    for(let y=0,n2=colorGrid[x].length;y<n2;y++){
      let v=colorGrid[x][y].wave?(255*(colorGrid[x][y].wave/(0.5*resolutionXy.x/sq))):255;
      fillSquare(x,y,`rgb(${v},${v},${v})`);
    }
  }
}

function sdfPaint(){
  // console.log(colorGrid);
  for(let x=0,n1=colorGrid.length;x<n1;x++){
    for(let y=0,n2=colorGrid[x].length;y<n2;y++){
      let d=colorGrid[x][y].distance?colorGrid[x][y].distance:distance([x,y],seeds[colorGrid[x][y].origin]);
      let v=colorGrid[x][y].wave?(255*(d/(0.5*resolutionXy.x/sq))):255;
      fillSquare(x,y,`rgb(${v},${v},${v})`);
    }
  }
}

function jfaSdf(){
  // console.log(colorGrid);
  for(let x=0,n1=colorGrid.length;x<n1;x++){
    for(let y=0,n2=colorGrid[x].length;y<n2;y++){
      let org=colorGrid[x][y].jfaOrigin?colorGrid[x][y].jfaOrigin:[0,0];
      let d=distance([x,y],org);
      let v=colorGrid[x][y].wave?(255*(d/(0.5*resolutionXy.x/sq))):255;
      fillSquare(x,y,`rgb(${v},${v},${v})`);
    }
  }
}


function distance(vec1,vec2){
  return Math.sqrt(Math.pow(vec2[0]-vec1[0],2)+Math.pow(vec2[1]-vec1[1],2));
}


function fillSquare(x,y,color){
  ctx.fillStyle=color;
  ctx.fillRect(x*sq,y*sq,sq,sq);
}
