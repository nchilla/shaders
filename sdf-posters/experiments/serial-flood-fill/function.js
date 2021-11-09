

var resolutionXy={x:500,y:500};
let canvas=document.querySelector('canvas');
let ctx=canvas.getContext('2d');
let squares=[];
let sqRows=[];
let sq=10;
let xCount=resolutionXy.x/sq;
let yCount=resolutionXy.y/sq;
let corners=true;
let m=1;


let textured=[];

let colors=['AliceBlue','Aquamarine','Cornsilk','DarkSeaGreen','Salmon','PaleGoldenRod','Gainsboro'];


function setUpSquares(){
  squares=[];
  textured=[];
  sqRows=[];
  xCount=resolutionXy.x/sq;
  yCount=resolutionXy.y/sq;
  m=resolutionXy.x/100;

  let letters=['a','b','c','d','e','f','g']

  for (var i = 0; i < 8; i++) {
    textured.push({
      x:Math.floor(xCount*Math.random()),
      y:Math.floor(xCount*Math.random()),
      i:0,
      k:i
    })
  }



  for(let x=0;x<xCount;x++){
    sqRows.push([]);
    for(let y=0;y<yCount;y++){
      let located=textured.find(a=>a.x==x&&a.y==y);
      sqRows[x].push({wave:located?1:null,color:located?located.k:100,distance:0,fill:located?1:0});
      squares.push({x:x,y:y,f:textured.find(a=>a.x==x&&a.y==y)?1:0});
    }
  }


  // console.log(sqRows);
  // console.log(squares);
}



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
      breadthFloodFill('manhattan');
      // floodGradient();
      // noAnimationFlood();
      break;
      case 'flood-fill-voronoi':
      breadthFloodFill('voronoi');
      // floodFillVoronoi();
      break;
    }
  })
});


function clamp(min,val,max){
  return Math.max(Math.min(val,max),min);
}

function breadthFloodFill(type){

  let items=JSON.parse(JSON.stringify(sqRows));
  // let items=[...sqRows];
  let wave=1;
  //starting queue
  let q=[...textured];

  let colorFunction;
  switch(type){
    case 'manhattan':
    colorFunction = (wave,parent)=> {return `rgb(${wave*m},${wave*m},${wave*m})`;};
    break;
    case 'voronoi':
    colorFunction = (wave,parent)=> {return colors[parent.k];};
    break;
  }

  while(q.length>0){
    let newQ=[];
    for(let i=0;i<q.length;i++){
      // loop through surrounding x vals
      for(let x=-1;x<=1;x++){
        //loop through each y for that surrounding x
        for(let y=-1;y<=1;y++){
          //get neighboring coord vals
          let x1=q[i].x+x;
          let y1=q[i].y+y;
          //if neighbor exists
          if((x1>=0 && x1 < items.length) && (y1>=0 && y1 < items[x1].length)){
            //if neighbor isn't filled yet
            if(items[x1][y1].fill==0){
              //fill it in
              items[x1][y1].fill=1;
              // console.log(sqRows[x1][y1].fill)

              // fillFlood(wave,q[i],x1,y1);
              color=colorFunction(wave,q[i]);
              fillSquare({x:x1,y:y1},color);

              //add it to the queue
              newQ.push({x:x1,y:y1,i:wave,k:q[i].k});
            }
          }
        }
      }
    }
    wave++;
    q=newQ;
  }





  // console.log(queue);
}




function bruteForce(){
  // let scale=255/(resolutionXy.x/2);
  let scale=255/(resolutionXy.x/sq);
  for(let s=0;s<squares.length;s++){
    let allPos=[];
    for(let t=0;t<textured.length;t++){
      allPos.push(distance(textured[t],squares[s]));
    }
    let pos=Math.min(...allPos);
    pos=pos*scale;
    ctx.fillStyle=`rgb(${pos},${pos},${pos})`;
    ctx.fillRect(squares[s].x*sq,squares[s].y*sq,sq,sq);
  }

}










window.addEventListener('resize',resolutionChange);
window.addEventListener('load',startUp);



function startUp(){
  resolutionChange();
  // setUpSquares();
  // draw();
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





function fillSquare(vector,color){
  ctx.fillStyle=color;
  ctx.fillRect(vector.x*sq,vector.y*sq,sq,sq);
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
    let fill=colors[ind];

    ctx.fillStyle=fill;
    ctx.fillRect(squares[s].x*sq,squares[s].y*sq,sq,sq);
  }

}

function redundantFloodFill(){
  let wave=2;
  let l=sqRows.length-1;
  let count=1;
  while(count>0){
    floodWave();
  }


  function floodWave(){
    count=0;
    //loop through all x coords
    for(let bX=0;bX<sqRows.length;bX++){
      //loop through each y coord for that x
      for(let bY=0;bY<sqRows[bX].length;bY++){
        //check if it was filled in during the prior wave
        if(sqRows[bX][bY].fill==1&&sqRows[bX][bY].wave==wave-1){
          //if so, loop through surrounding x vals
          for(let x=-1;x<=1;x++){
            //loop through each y for that surrounding x
            for(let y=-1;y<=1;y++){
              //get neighboring coord vals
              let x1=bX+x;
              let y1=bY+y;
              //if neighbor exists
              if((x1>=0 && x1 < sqRows.length) && (y1>=0 && y1 < sqRows[x1].length)){
                //if neighbor isn't filled yet
                if(sqRows[x1][y1].fill==0){
                  count=1;
                  sqRows[x1][y1].fill=1;
                  sqRows[x1][y1].wave=wave;
                }
              }
            }
          }

        }
      }
    }

    wave++;
  }


  for(let x=0; x<sqRows.length; x++){
    for(let y=0; y<sqRows[x].length; y++){
      let val=(sqRows[x][y].fill==1)?(255*(0.9-1/sqRows[x][y].wave)):255;
      fillSquare({x:x,y:y},`rgb(${val},${val},${val})`);
    }
  }

}
