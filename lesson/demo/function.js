var resolutionXy={x:500,y:500};
let sq=10;
let canvas=document.querySelector('canvas');
let ctx=canvas.getContext('2d');

let colorGrid;
let seeds=[];
let seedCount=10;
let speed=0.5;

let xCount;
let yCount;


let anims=[];


window.addEventListener('resize',resolutionChange);
window.addEventListener('load',startUp);

function startUp(){
  resolutionChange();
  // buttons();
  inputSetUp();
  brushSetUp();

}


function inputSetUp(){

  //seeds---------------------
  document.querySelector('#seed-slider').addEventListener('input',function(){
    let v=parseInt(event.currentTarget.value);
    seedCount=v;
    document.querySelector('.seeds figcaption').innerText=v;
  })
  document.querySelector('#speed-slider').addEventListener('input',function(){
    let v=parseInt(event.currentTarget.value);
    speed=v/100;
    document.querySelector('.algorithms figcaption').innerText=v+'%';
  })
  document.querySelectorAll('button').forEach((item, i) => {
    item.addEventListener('click',function(){
      switch(event.currentTarget.id){
        case 'update-seeds':
        generateSeeds(seedCount);
        gridReset();
        drawSeeds();
        break;
        case 'run-algorithm':
        gridReset();
        drawSeeds();
        handleRun();
        break;

      }
    })
  });


}

function handleRun(){
  let v=document.querySelector('#algorithm-select').value;
  switch(v){
    case 'brute force':
    bruteForce();
    break;
    case 'flood fill':
    euclidFlood();
    break;
  }
}



function brushSetUp(){
  let mouseDown=false;

  window.addEventListener('mousedown',function(){
    mouseDown=true;
  })
  window.addEventListener('mouseup',function(){
    mouseDown=false;
  })

  document.querySelector('canvas').addEventListener('mousemove',function(){
    let normX=Math.floor((event.clientX - 230)/sq)
    let normY=Math.floor(event.clientY/sq);
    // console.log(seeds);
    for(let x=-1;x<=1;x++){
      //loop through neigbor y vals
      for(let y=-1;y<=1;y++){
        // let nX=normX+x;
        // let nY=normY+y;
        let nX=clamp(0,(normX+x),xCount-1);
        let nY=clamp(0,(normY+y),yCount-1);


        if(mouseDown&&!seeds.includes([nX,nY])){
          seeds.push([nX,nY]);
          fillSquare(nX,nY,`rgb(0,0,0)`);
        }


      }
    }

  })
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
  anims[anims.length-1]=false;
  colorGrid=[];
  for (var x = 0; x < xCount; x++) {
    colorGrid.push([]);
    for (var y = 0; y < yCount; y++) {
      colorGrid[x].push({
        color:0,
        wave:undefined,
        origin:undefined,
        distance:undefined,
      })
    }

  }


  for(let i=0;i<seeds.length;i++){
    colorGrid[seeds[i][0]][seeds[i][1]]={
      color:1,
      wave:1,
      origin:[...seeds[i]],
      distance:0.00001
    }
  }

}

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
  drawSeeds();
}

function drawSeeds(){
  // console.log(colorGrid);
  for(let x=0,n1=colorGrid.length;x<n1;x++){
    for(let y=0,n2=colorGrid[x].length;y<n2;y++){
      let v=colorGrid[x][y].wave?(255*(colorGrid[x][y].wave/(0.5*resolutionXy.x/sq))):255;
      fillSquare(x,y,`rgb(${v},${v},${v})`);
    }
  }
}

function bruteForce(){
  anims.push(true);
  let num=anims.length-1;
  let queue=[];
  for(let x=0,n1=colorGrid.length;x<n1;x++){
    for(let y=0,n2=colorGrid[x].length;y<n2;y++){
      let bestDist=9000;
      for (var i = 0; i < seeds.length; i++) {
        let d=distance(seeds[i],[x,y]);
        bestDist=d<bestDist?d:bestDist;
      }

      let delay=50/speed;
      let v=255*(bestDist/(0.4*resolutionXy.x/sq));

      queue.push([x,y,bestDist]);
      setTimeout(function () {
        if(anims[num]){
          fillSquare(x,y,`rgb(${v},${v},${v})`);
        }

      }, 0.5*delay*x+0.5*y);
    }
  }


  let c=0;

  // draw();
  //
  // function draw(){
  //   let v=255*(queue[c][2]/(0.4*resolutionXy.x/sq));
  //   fillSquare(queue[c][0],queue[c][1],`rgb(${v},${v},${v})`);
  //   c++;
  //
  //   let delay=1/speed;
  //   setTimeout(function () {
  //     if(anims[num]){
  //       window.requestAnimationFrame(draw);
  //     }
  //   }, delay);
  //
  // }


}




function euclidFlood(){
  anims.push(true);
  let num=anims.length-1;

  let queue=[...seeds];
  let wave=2;

  loopWave();

  function loopWave(){
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

          //make sure neighbor exists,
          if(nX>=0&&nX<xCount&&
             nY>=0&&nY<yCount

          ){
            //check if it's filled in
            if(colorGrid[nX][nY].color==0){
              //if it's not, fill it in
              colorGrid[nX][nY].color=1;
              //record when it was filled
              colorGrid[nX][nY].wave=wave;
              //record the seed where it originated
              colorGrid[nX][nY].origin=colorGrid[bX][bY].origin;
              let d=distance([nX,nY],colorGrid[bX][bY].origin);
              colorGrid[nX][nY].distance=d;
              //add it to the queue
              newQueue.push([nX,nY]);
              euclidFillSquare(nX,nY,d);
            }else{
              if(colorGrid[nX][nY].origin!==colorGrid[bX][bY].origin){
                let oldDist=distance([nX,nY],colorGrid[nX][nY].origin);
                let newDist=distance([nX,nY],colorGrid[bX][bY].origin);
                if(newDist<oldDist){
                  colorGrid[nX][nY].origin=colorGrid[bX][bY].origin;
                  colorGrid[nX][nY].distance=newDist;
                  euclidFillSquare(nX,nY,newDist);


                  newQueue.push([nX,nY]);
                }
              }

            }
          }
        }
      }
    }

    queue=newQueue;

    wave++;

    if(queue.length>0){
      let delay=50/speed;
      setTimeout(function () {
        if(anims[num]){
          window.requestAnimationFrame(loopWave);
        }

      }, delay);

    }
  }

}






function euclidFillSquare(x,y,d){
  let v=255*(d/(0.4*resolutionXy.x/sq));
  ctx.fillStyle=`rgb(${v},${v},${v})`;
  ctx.fillRect(x*sq,y*sq,sq,sq);
}


function euclidGradientPaint(){
  for(let x=0,n1=colorGrid.length;x<n1;x++){
    for(let y=0,n2=colorGrid[x].length;y<n2;y++){
      // let org=colorGrid[x][y].origin;
      let d=colorGrid[x][y].distance?colorGrid[x][y].distance:resolutionXy.x;
      // distance([x,y],org);

      let v=255*(d/(0.5*resolutionXy.x/sq));
      fillSquare(x,y,`rgb(${v},${v},${v})`);
      // fillSquare(x,y,`rgb(${d},${d},${d})`);
    }
  }
  console.log('done')
}


function clamp(min,val,max){
  return Math.min(Math.max(val,min),max);
}



function distance(vec1,vec2){
  return Math.sqrt(Math.pow(vec2[0]-vec1[0],2)+Math.pow(vec2[1]-vec1[1],2));
}

function fillSquare(x,y,color){
  ctx.fillStyle=color;
  ctx.fillRect(x*sq,y*sq,sq,sq);
}
