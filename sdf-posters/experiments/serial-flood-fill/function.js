

var resolutionXy={x:500,y:500};
let canvas=document.querySelector('canvas');
let ctx=canvas.getContext('2d');
let squares=[];
let sq=10;
let xCount=resolutionXy.x/sq;
let yCount=resolutionXy.y/sq;
let corners=true;

// let mouse


document.querySelectorAll('button').forEach((item, i) => {
  item.addEventListener('click',function(){
    let target=event.currentTarget;
    switch(target.id){
      case 'brute-force':
      bruteForce();
      break;
      case 'brute-force-voronoi':
      bruteForceVoronoi();
      break;
      case 'flood-fill':
      floodGradient();
      // noAnimationFlood();
      break;
      case 'flood-fill-voronoi':
      floodFillVoronoi();
      break;
      case 'corners':
      corners=corners?false:true;
      target.innerText=corners?'turn off corners in flood':'include corners';
      break;

    }
  })
});





let textured=[
  {x:5+20,y:10+20,i:0,k:'a'},
  {x:20+20,y:23+20,i:0,k:'b'},
  {x:17+20,y:10+20,i:0,k:'c'},
  {x:9+20,y:5+20,i:0,k:'d'},


]



window.addEventListener('resize',resolutionChange);
window.addEventListener('load',startUp);



function startUp(){
  resolutionChange();
  setUpSquares();
  draw();
  // bruteForce();
  // bruteForceVoronoi();
  // floodGradient();

}

function resolutionChange(){
  canvas.width=canvas.offsetWidth;
  canvas.height=canvas.offsetHeight;

  resolutionXy.x=canvas.width;
  resolutionXy.y=canvas.height;

  setUpSquares();
  draw();

}

function setUpSquares(){
  squares=[];
  xCount=resolutionXy.x/sq;
  yCount=resolutionXy.y/sq;
  for(let x=0;x<xCount;x++){
    for(let y=0;y<yCount;y++){
      squares.push({x:x,y:y});
    }
  }
  // console.log(squares);
}



function fillSquare(vector,color){
  ctx.fillStyle=color;
  ctx.fillRect(vector.x*sq,vector.y*sq,sq,sq);
}


function floodGradient(){
  let flood=[...squares];
  let filled=[...textured];
  let layer=1;

  fillLayer();

  function fillLayer(){
    let changeCount=0;
    filled.forEach((item, i) => {
      //fill texture square
      let col=item.i*10;
      fillSquare(item,`rgb(${col},${col},${col})`);
      if(item.i==layer-1){
        let neighbors=getNeighbors(item,{x:xCount,y:yCount},layer);
        let max=corners?8:4;
        for(var x=0;x<max;x++){
          let neigh=neighbors[x];
          if(!filled.some(a=>a.x==neigh.x&&a.y==neigh.y)){
            filled.push(neigh);
            let ncol=neigh.i*10;
            fillSquare(neigh,`rgb(${ncol},${ncol},${ncol})`);

            changeCount++;
          }
        }
      }


    });
    // console.log(changeCount);
    if(changeCount>0){

      layer++;
      window.requestAnimationFrame(fillLayer);

    }

  }

}


function noAnimationFlood(){
  let flood=[...squares];
  let filled=[...textured];
  let layer=1;
  let changeCount=1;

  while(changeCount>0){
    changeCount=0;
    fillLayer();
  }

  filled.forEach((item, i) => {
    let col=item.i*10;
    fillSquare(item,`rgb(${col},${col},${col})`);
  });



  function fillLayer(){
    changeCount=0;
    filled.forEach((item, i) => {
      //fill texture square
      // let col=item.i*10;
      // fillSquare(item,`rgb(${col},${col},${col})`);
      if(item.i==layer-1){
        let neighbors=getNeighbors(item,{x:xCount,y:yCount},layer);
        let max=corners?8:4;
        for(var x=0;x<max;x++){
          let neigh=neighbors[x];
          if(!filled.some(a=>a.x==neigh.x&&a.y==neigh.y)){
            filled.push(neigh);
            let ncol=neigh.i*10;
            fillSquare(neigh,`rgb(${ncol},${ncol},${ncol})`);

            changeCount++;
          }
        }
      }


    });
    // console.log(changeCount);
    layer++;

  }
}



function floodFillVoronoi(){
  let flood=[...squares];
  let filled=[...textured];
  let layer=1;

  fillLayer();

  function decideColor(val){
    switch(val){
      case 'a':
      return 'green';
      break;
      case 'b':
      return 'blue';
      break;
      case 'c':
      return 'red';
      break;
      case 'd':
      return 'yellow';
      break;
    }
  }

  function fillLayer(){
    let changeCount=0;
    filled.forEach((item, i) => {
      //fill texture square
      let col=item.i*10;

      fillSquare(item,decideColor(item.k));

      if(item.i==layer-1){
        let neighbors=getNeighbors(item,{x:xCount,y:yCount},layer,item.k);
        let max=corners?8:4;
        for(var x=0;x<max;x++){
          let neigh=neighbors[x];
          if(!filled.some(a=>a.x==neigh.x&&a.y==neigh.y)){
            filled.push(neigh);
            let ncol=neigh.i*10;

            fillSquare(neigh,decideColor(item.k));

            changeCount++;
          }
        }
      }
    });
    if(changeCount>0){

      layer++;
      window.requestAnimationFrame(fillLayer);

    }
}

}







function getNeighbors(v,bounds,layer,color){
  let vals=[
    {x:v.x-1,y:v.y,i:layer,k:color},
    {x:v.x+1,y:v.y,i:layer,k:color},
    {x:v.x,y:v.y-1,i:layer,k:color},
    {x:v.x,y:v.y+1,i:layer,k:color},
    {x:v.x+1,y:v.y+1,i:layer,k:color},
    {x:v.x+1,y:v.y-1,i:layer,k:color},
    {x:v.x-1,y:v.y+1,i:layer,k:color},
    {x:v.x-1,y:v.y-1,i:layer,k:color}

  ]
  let max=corners?8:4;
  for(var i=0;i<max;i++){
    if(
      vals[i].x<0||vals[i].x>bounds.x||
      vals[i].y<0||vals[i].y>bounds.y
    ){
      vals[i]=v;
    }
  }
  return vals;
}



function draw(){

  for(let i=0;i<squares.length;i++){
    if(textured.some(a=>a.x==squares[i].x&&a.y==squares[i].y)){
      ctx.fillStyle='rgb(0,0,0)';
    }else{
      ctx.fillStyle=`rgb(255,255,255)`;
    }
    ctx.fillRect(squares[i].x*sq,squares[i].y*sq,sq,sq);
  }
  // console.log(pos);

}


function distance(vec1,vec2){
  return Math.sqrt(Math.pow(vec2.x-vec1.x,2)+Math.pow(vec2.y-vec1.y,2));
}


function bruteForce(){
  for(let s=0;s<squares.length;s++){
    let allPos=[];
    for(let t=0;t<textured.length;t++){
      allPos.push(distance(textured[t],squares[s]));
    }
    let pos=Math.min(...allPos);
    pos=pos*10;
    ctx.fillStyle=`rgb(${pos},${pos},${pos})`;
    ctx.fillRect(squares[s].x*sq,squares[s].y*sq,sq,sq);
  }

}

function bruteForceVoronoi(){
  for(let s=0;s<squares.length;s++){
    let dist=2000;
    let ind=-1;
    for(let t=0;t<textured.length;t++){
      let newDist=distance(textured[t],squares[s]);
      if(newDist<dist){
        ind=t;
        dist=newDist;
      }

      distance(textured[t],squares[s])<dist
    }
    let fill;
    switch(ind){
      case 0:
        fill="green";
      break;
      case 1:
        fill="blue";
      break;
      case 2:
        fill="red";
      break;
      case 3:
        fill="yellow";
      break;
      default:
        fill="white";
    }

    ctx.fillStyle=fill;
    ctx.fillRect(squares[s].x*sq,squares[s].y*sq,sq,sq);
  }

}
