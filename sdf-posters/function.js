//import lozad and use it to buffer the resize requests for responsive sizing


//for the sizing, use aspect ratios and page sizing
//when rendering poster, make another display mode with a fixed width and use to export

//pass in shader effect choice as a uniform to a single fragment shader with a conditional










const composingColumn=document.querySelector('#dom-canvas');
const inputs=[
  document.querySelector('#layer0'),
  document.querySelector('#layer1'),
  document.querySelector('#layer2')
];

const ctx=[
  inputs[0].getContext('2d'),
  inputs[1].getContext('2d'),
  inputs[2].getContext('2d')
]

const activeLayers=[
  true,
  false,
  false
]

const outputData={
  layer:4,
  mixer:1,
  colors:[[0,0,0],[0,0,0],[0,0,0]],
  layers:[
    {
      effect:0,
      spread:500
    },
    {
      effect:0,
      spread:500
    },
    {
      effect:0,
      spread:500
    }
  ]
}


const sizeSlider=document.querySelector('input[type="range"]');
const sizeInput=document.querySelector('input[name="size"]');

const floater=document.querySelector('.floater');

let mode='text';

// const ctx=inputs[0].getContext('2d');
// ctx.imageSmoothingEnabled = false;
const output = document.querySelector('#gl-canvas canvas');


let displayUpdate=true;
let resolutionUpdate=true;

const fontData={
  font_family:'Courier New',
  font_size:50,
  font_style:'normal',
  font_weight:400,
  layer:0
}

const strokeData={
  stroke_width:20,
  layer:0,
  corners:'miter',
  caps:'butt'
}


const focus={
  on:false,
  item:undefined
}

const strokeFocus={
  on:false,
  stroke:undefined
}

let dragMode=false;


//defined when glsl source is loaded in
let shader;
const gl=output.getContext('webgl');


//uniforms
const resolution=[inputs[0].width,inputs[0].height];
const mouse=[0,0];
var passCount=0;


// poster design
const workspace=document.querySelector('#workspace');
const itemSelect=document.querySelector('ul[data-select="item-select"]');

const items=[];
const strokes=[];
let drawing={
  on:false,
  stroke:undefined
}



let currentLayer=0;


let idCount=0;


class Stroke{
  constructor(id,x,y,positions,minmax){
    this.id=id;
    this.clicks=1;
    this.layer=strokeData.layer;
    this.positions=positions?positions:[[x,y]];
    this.caps=strokeData.caps;
    this.corners=strokeData.corners;

    this.minmax=minmax?minmax:[x,y,x,y];
    this.stroke_width=strokeData.stroke_width;

    this.selector=generateSelector(this);
    // updateDropdown(itemSelect,this.id);

  }

  add(x,y){
    let denX=denorm(x);
    let denY=denorm(y);
    this.positions.push([denX,denY]);
    this.minmax=[
      Math.min(denX,this.minmax[0]),
      Math.min(denY,this.minmax[1]),
      Math.max(denX,this.minmax[2]),
      Math.max(denY,this.minmax[3]),
    ]

  }

  focus(){
    strokeFocus.on=true;
    strokeFocus.stroke=this;
    updateStrokePanel(this);
    updateDropdown(itemSelect,this.id);
    floater.classList.add('on');
    floater.style.left=norm(strokeFocus.stroke.minmax[0])+'px';
    floater.style.top=norm(strokeFocus.stroke.minmax[1])+'px';
    floater.style.height=norm(strokeFocus.stroke.minmax[3]-strokeFocus.stroke.minmax[1])+'px';
    floater.style.width=norm(strokeFocus.stroke.minmax[2]-strokeFocus.stroke.minmax[0])+'px';
    composingColumn.classList.add('focus-stroke');
  }

  remove(){
    this.selector.remove();
    if(!itemSelect.querySelector('.selected')){
      itemSelect.querySelector('li[data-value="none"]').classList.add('selected');
    }

    const ind=strokes.indexOf(this);
    strokes.splice(ind, 1);
    refreshCanvas();
    displayUpdate=true;
  }

  render(){
    ctx[this.layer].lineCap=this.caps;
    ctx[this.layer].lineJoin=this.corners;

    ctx[this.layer].beginPath();
    ctx[this.layer].moveTo(norm(this.positions[0][0]),norm(this.positions[0][1]));
    for (var i = 1; i < this.positions.length; i++) {
      const x=norm(this.positions[i][0]);
      const y=norm(this.positions[i][1]);
      ctx[this.layer].lineTo(x, y);
    }

    ctx[this.layer].lineWidth=norm(this.stroke_width);
    ctx[this.layer].stroke();
    activeLayers[this.layer]=true;

    // ctx[this.layer].font=`${this.font_weight} ${this.font_style} ${norm(this.font_size)}px '${this.font_family}'`;
    // ctx[this.layer].fillText(this.value, norm(this.position[0]), norm(this.position[1]));
    // activeLayers[this.layer]=true;
  }
}


function generateSelector(item){
  console.log(item.id)
  const li=document.createElement('li');
  li.innerText=item.id+'-'+(item.font_family?item.value:'line');

  li.dataset.value=item.id;
  li.dataset.type=item.font_family?'type':'stroke';
  // console.log(li.dataset.type)
  li.addEventListener('click',dropDownSwitch);
  itemSelect.appendChild(li);
  return li;
}


class TextItem{
  constructor(id,x,y,val){
    this.value=val?val:'lorem';
    this.position=[x,y];
    this.font_family=fontData.font_family;
    this.font_size=fontData.font_size;
    this.font_style=fontData.font_style;
    this.font_weight=fontData.font_weight;
    this.layer=fontData.layer;
    this.id=id;

    this.selector=generateSelector(this);
    updateDropdown(itemSelect,this.id);
    focus.on=true;
    focus.item=this;
  }

  update(){

    this.updateNode();
    this.updateCanvas();
  }


  remove(){
    this.node.remove();
    this.selector.remove();
    if(!itemSelect.querySelector('.selected')){
      itemSelect.querySelector('li[data-value="none"]').classList.add('selected');
    }


    const ind=items.indexOf(this);
    items.splice(ind, 1);
    refreshCanvas();
    displayUpdate=true;
  }


  updateNode(){
    if(!this.node){
      this.node=document.createElement('div');
      this.node.className='node noselect';
      this.node.dataset.id=this.id;
      this.node.dataset.type='node';
      workspace.appendChild(this.node);
    }
    this.node.innerText=this.value;
    this.node.style.fontFamily=this.font_family;
    this.node.style.fontSize=norm(this.font_size)+'px';
    this.node.style.fontWeight=this.font_weight;
    this.node.style.fontStyle=this.font_style;
    this.node.style.left=norm(this.position[0])+'px';
    this.node.style.bottom=`calc(100% - ${norm(this.position[1])}px)`


  }

  focus(){
    document.querySelectorAll('.focus').forEach((item, i) => {
      item.classList.remove('focus');
    });
    this.node.classList.add('focus');
    focus.on=true;
    focus.item=this;

    updateTextPanel(this);
    updateDropdown(itemSelect,this.id);

    composingColumn.classList.add('focus-text');
  }



  updateCanvas(){
    // ctx.font="400px 'Courier New'";

    ctx[this.layer].font=`${this.font_weight} ${this.font_style} ${norm(this.font_size)}px '${this.font_family}'`;
    ctx[this.layer].fillText(this.value, norm(this.position[0]), norm(this.position[1]));
    activeLayers[this.layer]=true;

    // ctx[0].font=`${this.font_weight} ${this.font_style} ${norm(this.font_size)}px '${this.font_family}'`;

    // ctx[0].fillText(this.value, norm(this.position[0]), norm(this.position[1]));
  }

}

function norm(val){
  return resolution[0]*val/500;
}

function denorm(val){
  return val/resolution[0] * 500;
}



function updateTextPanel(obj){
  const fontFamily=document.querySelector('ul[data-select="font-family"]');
  updateDropdown(fontFamily,obj.font_family);
  const fontStyle=document.querySelector('ul[data-select="font-style"]');
  updateDropdown(fontStyle,obj.font_style);
  const fontWeight=document.querySelector('ul[data-select="font-weight"]');
  updateDropdown(fontWeight,obj.font_weight);
  const fontLayer=document.querySelector('ul[data-select="font-layer"]');
  updateDropdown(fontLayer,obj.layer);

  // switchLayer(obj.layer)

  const fontSize=document.querySelector('.number-field[data-for="font-size"]');
  numberFieldValue(fontSize,obj.font_size)
  //
  // sizeInput.value=obj.font_size;
  // sizeSlider.value=obj.font_size;

}

function updateStrokePanel(obj){
  const brushLayer=document.querySelector('ul[data-select="brush-layer"]');
  updateDropdown(brushLayer,obj.layer);

  // switchLayer(obj.layer)

  const strokeWidth=document.querySelector('.number-field[data-for="stroke-width"]');
  numberFieldValue(strokeWidth,obj.stroke_width);
  //
  // sizeInput.value=obj.font_size;
  // sizeSlider.value=obj.font_size;

}


function updateLayerPanel(ind){
  if(ind<4){
    updateDropdown(document.querySelector('ul[data-select="effect"]'),outputData.layers[ind].effect);
    numberFieldValue(document.querySelector('.number-field[data-for="spread"]'),outputData.layers[ind].spread);
    document.querySelectorAll('#color-pick input').forEach((item, i) => {
      item.value=outputData.colors[outputData.layer][i]
      document.querySelector('.swatch').style.setProperty('--'+item.name, outputData.colors[outputData.layer][i]);
    });
  }
  // const effectDrop=document.querySelector('ul[data-select="effect"]');



}

function switchLayer(ind){
  outputData.layer=ind;
  document.querySelector('#gl-canvas').dataset.layer=ind;
  updateLayerPanel(ind)
  document.querySelectorAll('#which-layer li').forEach((item, i) => {
    if(item.dataset.value==ind){
      item.classList.add('selected');
    }else{
      item.classList.remove('selected');
    }
  });

}



function numberFieldValue(field,val){
  field.querySelector('input[type="number"]').value=val;
  field.querySelector('input[type="range"]').value=val;
}


function updateDropdown(dropdown,value){
  dropdown.querySelectorAll('li').forEach((item, i) => {
    if(item.dataset.value==value){
      item.classList.add('selected');
    }else{
      item.classList.remove('selected');
    }
  });

}


window.addEventListener('load',function(){




  const vert_shader_src=fetch('gl/shader.vert').then((response) => {return response.text();});
  const jfa_shader_src=fetch('gl/jfa.frag').then((response) => {return response.text();});
  const frag_shader_src=fetch('gl/shader.frag').then((response) => {return response.text();});

  resolutionChange();


  addTextItem(170,200);

  updateTextPanel(items[0])
  switchLayer(outputData.layer);
  setUpListeners();
  refreshCanvas();

  // switchMode('text');

  Promise.all([vert_shader_src,jfa_shader_src,frag_shader_src]).then((values) => {
      // let effects={test:1};
      shader=new Shader(inputs, gl, resolution, outputData, values);
      window.requestAnimationFrame(draw);
  });
})



function addTextItem(x,y){
  items.push(new TextItem(idCount,denorm(x),denorm(y)));
  idCount++;
}



function setUpListeners(){
  window.addEventListener('click',function(){
    const x=event.clientX;
    const y=event.clientY-41 + document.querySelector('.col').scrollTop;

    switch(event.target.dataset.type){
      case 'node':
      if(mode=='brush'){
        brushEvent(x,y);
      }else{
        let item=items.find(a=>a.id==event.target.dataset.id);
        cleanUp();
        item.focus();
      }
      break;
      case 'workspace':
      if(mode=='text'){
        if(!focus.on){
          addTextItem(x - fontData.font_size*2,y);
          cleanUp();
          refreshCanvas();
          resetFocus();
          displayUpdate=true;
        }else{
          focus.on=false;
          strokeFocus.on=false;
          cleanUp();
          resetFocus();
        }

      }else if(mode=='brush'){
        brushEvent(x,y)


        focus.on=false;
        strokeFocus.on=false;
        cleanUp();
        resetFocus();

        refreshCanvas();
        displayUpdate=true;

      }else{
        focus.on=false;
        strokeFocus.on=false;
        cleanUp();
        resetFocus();
      }
      break;
      case 'canvas':
      break;
      default:
      // focus.on=false;strokeFocus.on=false;
      // resetFocus();

    }

  })

  function brushEvent(x,y){
    if(drawing.on){
      // drawing.stroke.positions.push([denorm(x),denorm(y)])

      drawing.stroke.add(x,y);

      drawing.stroke.clicks++;
    }else{
      strokes.push(new Stroke(idCount,denorm(x),denorm(y)));
      idCount++;
      drawing.stroke=strokes[strokes.length-1];
      drawing.on=true;
      composingColumn.classList.add('drawing')
    }
  }


  document.querySelectorAll('.remove').forEach((item, i) => {
    item.addEventListener('click',function(){
      if(i==0){
        focus.on=false;
        focus.item.remove();
      }else{
        strokeFocus.on=false;
        strokeFocus.stroke.remove();
      }
      resetFocus();
    })
  });

  document.querySelectorAll('.duplicate').forEach((item, i) => {
    item.addEventListener('click',function(){
      if(i==0){
        items.push(new TextItem(idCount,focus.item.position[0],focus.item.position[1],focus.item.value));
        idCount++;

        // focus.on=false;
        // focus.item.remove();
        cleanUp();
        resetFocus();
      }else{
        console.log(strokeFocus.stroke.positions);
        strokes.push(new Stroke(idCount,0.,0.,strokeFocus.stroke.positions,strokeFocus.stroke.minmax));
        idCount++;
        // strokeFocus.on=true;
        // strokeFocus.stroke=strokes[strokes.length-1];
        strokes[strokes.length-1].focus();
        cleanUp();

      }


      refreshCanvas();
      displayUpdate=true;
      document.querySelector('.duplication-notice').style.opacity=1;
      setTimeout(function () {
        document.querySelector('.duplication-notice').style.opacity=0;
      }, 2000);
      // resetFocus();
    })
  });


  window.addEventListener('mousedown',function(){

    if(event.target.dataset.type=='node'&&mode!=='brush'){
      let item=items.find(a=>a.id==event.target.dataset.id);
      item.focus();
      focus.item.node.classList.add('drag')
      dragMode=true;
    }

  })

  const toolTableButtons=document.querySelectorAll('#tool-table button');

  toolTableButtons.forEach((item, i) => {
    item.addEventListener('click',function(){
      switchMode(item.dataset.val);
      // item
      // composingColumn.dataset.mode=item.dataset.val;
      // composingColumn.classList.remove('focus-text');
      // mode=item.dataset.val;
    })

  });




  document.querySelectorAll('.dropdown').forEach((item, i) => {
    item.addEventListener('click',function(){
      item.classList.toggle('dropped');
    })
  });

  document.querySelectorAll('.dropdown li').forEach((item, i) => {
    item.addEventListener('click',dropDownSwitch)
  });


  document.querySelectorAll('#color-pick input').forEach((item, i) => {
    item.addEventListener('input',function(){
      outputData.colors[outputData.layer][i]=item.value;
      document.querySelector('.swatch').style.setProperty('--'+item.name, item.value);
    })
  });


  document.querySelectorAll('#which-layer li').forEach((item, i) => {
    item.addEventListener('click',function(){
      document.querySelector('#which-layer .selected').classList.remove('selected');
      item.classList.add('selected');
      outputData.layer=item.dataset.value;
      document.querySelector('#gl-canvas').dataset.layer=item.dataset.value;
      if(item.dataset.value<4){
        updateLayerPanel(item.dataset.value);
      }

      //add function to change layer display to data for current layer
    })
  });





  window.addEventListener('mouseup',function(){
    dragMode=false;
    if(focus.on){
      focus.item.node.classList.remove('drag');
    }
  })

  window.addEventListener('mousemove',function(){
    const x=event.clientX;
    const y=event.clientY-41 + document.querySelector('.col').scrollTop;

    if(dragMode){
      // console.log(event);
      focus.item.position=[
        focus.item.position[0] + denorm(event.movementX),
        focus.item.position[1] + denorm(event.movementY)
      ]
      refreshCanvas();
      displayUpdate=true;

    }else if(drawing.on){
      if(drawing.stroke.positions.length==drawing.stroke.clicks){
        drawing.stroke.positions.push([denorm(x),denorm(y)])
      }else{
        drawing.stroke.positions[drawing.stroke.clicks]=[denorm(x),denorm(y)];
      }
      refreshCanvas();
    }
  })

  let typingInField=false;
  document.querySelectorAll('input').forEach((item, i) => {
    item.addEventListener('focusin',function(){
      typingInField=true;
    })
  });

  document.querySelectorAll('input').forEach((item, i) => {
    item.addEventListener('focusout',function(){
      typingInField=false;
    })
  });

  document.querySelectorAll('.number-field').forEach((item, i) => {
    let numInput=item.querySelector('input[type="number"]');
    let numSlider=item.querySelector('input[type="range"]');

    numSlider.addEventListener('change',function(){
      numInput.value=numSlider.value;
      updateNumField(numSlider.value,item.dataset.for);

    })
    numInput.addEventListener('change',function(){
      numSlider.value=numInput.value;
      updateNumField(numInput.value,item.dataset.for);
    })

  });

  function updateNumField(val,type){
    switch(type){
      case 'font-size':
      updateFontSize(val)
      break;
      case 'spread':
      outputData.layers[outputData.layer].spread=val;
      break;
      case 'stroke-width':
      if(strokeFocus.on){
        strokeFocus.stroke.stroke_width=val;
        refreshCanvas();
        displayUpdate=true;
      }
      strokeData.stroke_width=val;
      break;
    }
  }



  function updateFontSize(val){
    if(focus.on){
      focus.item.font_size=parseInt(val);
      displayUpdate=true;
    }
    fontData.font_size=parseInt(val);
    refreshCanvas();
  }



  window.addEventListener('keydown',function(){
    if(focus.on&&!typingInField){
      // const node=document.querySelector(`.node[data-id="${focus.id}"]`);

      let newVal='';
      let item=focus.item;
      if(event.key.length<2){
        newVal=item.value+event.key;

        if(event.key==' '){
          event.preventDefault();
        }
      }else if(event.key=='Backspace'){
        newVal=item.value.substring(0,item.value.length-1);
      }


      item.selector.innerText=item.id+'-'+newVal;
      item.value=newVal;


      item.updateNode();
      refreshCanvas();
      displayUpdate=true;
    }else if(drawing.on){
      if(event.key=='Escape'){
        composingColumn.classList.remove('drawing');
        drawing.stroke.positions.pop();
        drawing.on=false;

        drawing.stroke.focus();
        // strokeFocus.on=true;
        // strokeFocus.stroke=drawing.stroke;
        cleanUp();
        refreshCanvas();
      }
    }



  })


}

function cleanUp(){
  items.forEach((item, i) => {
    console.log(item);
    if(item.value.length==0){
      item.remove();
    }
  });

  strokes.forEach((item, i) => {
    if(item.positions.length<2&&!drawing.on){
      item.remove();
    }
  });

}

function resetFocus(){

  items.forEach((item, i) => {
    if(item.node){
      item.node.classList.remove('focus');
    }
  });

  updateDropdown(itemSelect,'none');

  composingColumn.classList.remove('focus-text');
  composingColumn.classList.remove('focus-stroke');

  floater.classList.remove('on');

  if(focus.item&&focus.on){
    focus.item.node.classList.add('focus');
    composingColumn.classList.add('focus-text');

    updateDropdown(itemSelect,focus.item.id);
  }
}

function dropDownSwitch(){
  const ul = event.currentTarget.parentNode;
  ul.querySelectorAll('li').forEach((li) => {
    li.classList.remove('selected')
  });
  event.currentTarget.classList.add('selected');
  switch(ul.dataset.select){
    case 'aspect-ratio':
    event.currentTarget.dataset.value;
    document.querySelector('#page-wrap').style.setProperty('--aspect-ratio', event.currentTarget.dataset.value);
    resolutionChange();
    refreshCanvas();
    break;
    case 'font-family':
    if(focus.on){
      focus.item.font_family=event.currentTarget.dataset.value;
      displayUpdate=true;
      refreshCanvas();
    }
    fontData.font_family=event.currentTarget.dataset.value;
    break;
    case 'font-style':
    if(focus.on){
      focus.item.font_style=event.currentTarget.dataset.value;
      displayUpdate=true;
      refreshCanvas();
    }
    fontData.font_style=event.currentTarget.dataset.value;
    break;
    case 'font-weight':
    if(focus.on){
      focus.item.font_weight=parseInt(event.currentTarget.dataset.value);
      displayUpdate=true;
      refreshCanvas();
    }
    fontData.font_weight=parseInt(event.currentTarget.dataset.value);
    break;
    case 'font-layer':
    if(focus.on){
      focus.item.layer=parseInt(event.currentTarget.dataset.value);
      // switchLayer(item.dataset.value);
      // updateLayerPanel(item.dataset.value);
      displayUpdate=true;
      refreshCanvas();
    }
    fontData.layer=parseInt(event.currentTarget.dataset.value);
    break;
    case 'mixer':
    outputData.mixer=event.currentTarget.dataset.value;
    displayUpdate=true;
    break;
    case 'effect':
    outputData.layers[outputData.layer].effect=event.currentTarget.dataset.value;
    displayUpdate=true;
    break;
    case 'item-select':
    focus.on=false;
    strokeFocus.on=false;

    cleanUp();
    resetFocus();
    if(event.currentTarget.dataset.type=='type'){
      switchMode('text');
      let text=items.find(a=>a.id==event.target.dataset.value);
      text.focus();
    }else if(event.currentTarget.dataset.type=='stroke'){
      switchMode('brush');
      strokes.find(a=>a.id==event.target.dataset.value).focus();
    }
    refreshCanvas();
    break;
    case 'brush-layer':
    if(strokeFocus.on){
      strokeFocus.stroke.layer=parseInt(event.currentTarget.dataset.value);
      // switchLayer(item.dataset.value);
      // updateLayerPanel(item.dataset.value);
      displayUpdate=true;
      refreshCanvas();
    }
    break;
    case 'corners':
    if(strokeFocus.on){
      strokeFocus.stroke.corners=event.currentTarget.dataset.value;
      displayUpdate=true;
      refreshCanvas();
    }
    strokeData.corners=event.currentTarget.dataset.value;
    break;
    case 'line-caps':
    if(strokeFocus.on){
      strokeFocus.stroke.caps=event.currentTarget.dataset.value;
      displayUpdate=true;
      refreshCanvas();
    }
    strokeData.caps=event.currentTarget.dataset.value;
    break;
  }

  // item.classList.toggle('dropped');
}

function switchMode(val){
  resetFocus();
  composingColumn.dataset.mode=val;
  document.querySelector('#tool-table .selected').classList.remove('selected');
  document.querySelector(`button[data-val="${val}"]`).classList.add('selected');
  composingColumn.classList.remove('focus-text');
  composingColumn.classList.remove('focus-stroke');
  mode=val;
}


function draw(){
  if(resolutionUpdate){
    refreshCanvas();
    shader.resolution_update(inputs,gl,resolution,{test:1});
    resolutionUpdate=false;
  }else if(displayUpdate){
    shader.display_update(inputs,gl,activeLayers);
    displayUpdate=false;
  }

  // console.log(activeLayers)
  shader.render(activeLayers,outputData);
  window.requestAnimationFrame(draw);
}


function refreshCanvas(){
  //loop through all the text items and draw them
  for(let i = 0; i<ctx.length;i++){
    ctx[i].clearRect(0, 0, resolution[0],resolution[1]);
    activeLayers[i]=false;
  }


  // ctx[0].clearRect(0, 0, resolution[0],resolution[1]);

  items.forEach((item, i) => {
    item.update();
  });

  strokes.forEach((stroke, i) => {
    stroke.render();
  });




  //
  // ctx.clearRect(0, 0, input.width, input.height);
  // ctx.font="400px 'Courier New'";
  // ctx.fillText('A', 120, 200);
}





window.addEventListener('resize',resolutionChange);

function resolutionChange(){
  console.log('updating resolution');
  document.querySelectorAll('canvas').forEach((item, i) => {
    item.width=inputs[0].offsetWidth;
    item.height=inputs[0].offsetHeight;
  });
  resolution[0]=inputs[0].width;
  resolution[1]=inputs[0].height;

  if(strokeFocus.on){
    strokeFocus.stroke.focus();
  }


  // inputs[0].width=inputs[0].offsetWidth;
  // inputs[0].height=inputs[0].offsetHeight;
  // output.width=output.offsetWidth;
  // output.height=output.offsetHeight;
  // resolution[0]=inputs[0].width;
  // resolution[1]=inputs[0].height;
  resolutionUpdate=true;
}
