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

const sizeSlider=document.querySelector('input[type="range"]');
const sizeInput=document.querySelector('input[name="size"]');

let mode='move';

const ctx=inputs[0].getContext('2d');
ctx.imageSmoothingEnabled = false;
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

const focus={
  on:false,
  item:undefined
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

const items=[];
let currentLayer=0;


let idCount=0;

class TextItem{
  constructor(id,x,y){
    this.value='lorem';
    this.position=[x,y];
    this.font_family=fontData.font_family;
    this.font_size=fontData.font_size;
    this.font_style=fontData.font_style;
    this.font_weight=fontData.font_weight;
    this.layer=fontData.layer;
    this.id=id;

    focus.on=true;
    focus.item=this;
  }

  update(){

    this.updateNode();
    this.updateCanvas();
  }


  remove(){
    this.node.remove();
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


    // this.position[1]+'px';

  }

  focus(){
    document.querySelectorAll('.focus').forEach((item, i) => {
      item.classList.remove('focus');
    });
    this.node.classList.add('focus');
    focus.on=true;
    focus.item=this;

    updateTextPanel(this);

    composingColumn.classList.add('focus-text');
  }



  updateCanvas(){
    // ctx.font="400px 'Courier New'";
    ctx.font=`${this.font_weight} ${this.font_style} ${norm(this.font_size)}px '${this.font_family}'`;

    ctx.fillText(this.value, norm(this.position[0]), norm(this.position[1]));
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

  sizeInput.value=obj.font_size;
  sizeSlider.value=obj.font_size;

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

  setUpListeners();




  refreshCanvas();

  Promise.all([vert_shader_src,jfa_shader_src,frag_shader_src]).then((values) => {
      let effects={test:1};
      shader=new Shader(inputs, gl, resolution, effects, values);
      window.requestAnimationFrame(draw);
  });
})



function addTextItem(x,y){
  items.push(new TextItem(idCount,x,y));
  console.log(items);
  idCount++;
}



function setUpListeners(){
  window.addEventListener('click',function(){
    switch(event.target.dataset.type){
      case 'node':
      let item=items.find(a=>a.id==event.target.dataset.id);
      item.focus();
      break;
      case 'workspace':
      if(mode=='text'){

        if(!focus.on){
          const x=event.clientX - fontData.font_size*2;
          const y=event.clientY-230 + document.querySelector('.col').scrollTop;
          addTextItem(x,y);
          refreshCanvas();
          resetFocus();
          displayUpdate=true;
        }else{
          focus.on=false;
          resetFocus();
        }

      }else{
        focus.on=false;
        resetFocus();
      }
      break;
      default:
      // focus.on=false;
      // resetFocus();

    }

  })

  function resetFocus(){

    items.forEach((item, i) => {
      if(item.node){
        item.node.classList.remove('focus');
      }
      if(item.value.length==0){
        item.remove();
      }
    });
    composingColumn.classList.remove('focus-text');

    if(focus.item&&focus.on){
      focus.item.node.classList.add('focus');
      composingColumn.classList.add('focus-text');
    }
  }


  window.addEventListener('mousedown',function(){

    if(event.target.dataset.type=='node'){
      let item=items.find(a=>a.id==event.target.dataset.id);
      item.focus();
      focus.item.node.classList.add('drag')
      dragMode=true;
    }

  })

  const toolTableButtons=document.querySelectorAll('#tool-table button');

  toolTableButtons.forEach((item, i) => {
    item.addEventListener('click',function(){
      document.querySelector('#tool-table .selected').classList.remove('selected');
      item.classList.add('selected');
      composingColumn.dataset.mode=item.dataset.val;
      mode=item.dataset.val;
    })

  });


  document.querySelectorAll('.dropdown').forEach((item, i) => {
    item.addEventListener('click',function(){
      item.classList.toggle('dropped');
    })
  });

  document.querySelectorAll('.dropdown li').forEach((item, i) => {
    item.addEventListener('click',function(){
      const ul = item.parentNode;
      ul.querySelectorAll('li').forEach((li) => {
        li.classList.remove('selected')
      });
      item.classList.add('selected');
      switch(ul.dataset.select){
        case 'aspect-ratio':
        item.dataset.value;
        document.querySelector('#page-wrap').style.setProperty('--aspect-ratio', item.dataset.value);
        resolutionChange();
        refreshCanvas();
        break;
        case 'font-family':
        if(focus.on){
          focus.item.font_family=item.dataset.value;
          displayUpdate=true;
          refreshCanvas();
        }
        fontData.font_family=item.dataset.value;
        break;
        case 'font-style':
        if(focus.on){
          focus.item.font_style=item.dataset.value;
          displayUpdate=true;
          refreshCanvas();
        }
        fontData.font_style=item.dataset.value;
        break;
        case 'font-weight':
        if(focus.on){
          focus.item.font_weight=parseInt(item.dataset.value);
          displayUpdate=true;
          refreshCanvas();
        }
        fontData.font_weight=parseInt(item.dataset.value);
        break;
        case 'font-layer':
        if(focus.on){
          focus.item.layer=parseInt(item.dataset.value);
          displayUpdate=true;
          refreshCanvas();
        }
        fontData.layer=parseInt(item.dataset.value);
        break;
      }

      // item.classList.toggle('dropped');
    })
  });




  window.addEventListener('mouseup',function(){
    dragMode=false;
    if(focus.on){
      focus.item.node.classList.remove('drag')
    }
  })

  window.addEventListener('mousemove',function(){
    if(dragMode){
      // console.log(event);
      focus.item.position=[
        focus.item.position[0] + event.movementX,
        focus.item.position[1] + event.movementY
      ]
      refreshCanvas();
      displayUpdate=true;
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


  sizeSlider.addEventListener('change',function(){
    sizeInput.value=sizeSlider.value;
    updateFontSize(sizeSlider.value)

  })
  sizeInput.addEventListener('input',function(){
    sizeSlider.value=sizeInput.value;
    updateFontSize(sizeInput.value)
  })

  function updateFontSize(val){
    if(focus.on){
      focus.item.font_size=parseInt(val);
      displayUpdate=true;
      refreshCanvas();
    }
    fontData.font_size=parseInt(val);
  }



  window.addEventListener('keydown',function(){
    if(focus.on&&!typingInField){
      // const node=document.querySelector(`.node[data-id="${focus.id}"]`);
      let item=focus.item;
      if(event.key.length<2){
        item.value=item.value+event.key;

        if(event.key==' '){
          event.preventDefault();
        }
      }else if(event.key=='Backspace'){
        item.value=item.value.substring(0,item.value.length-1);
      }
      item.updateNode();
      refreshCanvas();
      displayUpdate=true;
    }



  })


}







function draw(){
  if(resolutionUpdate){
    refreshCanvas();
    shader.resolution_update(inputs[0],gl,resolution,{test:1});
    resolutionUpdate=false;
  }else if(displayUpdate){
    shader.display_update(inputs[0],gl);
    displayUpdate=false;
  }

  shader.render();
  window.requestAnimationFrame(draw);
}


function refreshCanvas(){
  //loop through all the text items and draw them
  ctx.clearRect(0, 0, resolution[0],resolution[1]);

  items.forEach((item, i) => {
    item.update();
  });




  //
  // ctx.clearRect(0, 0, input.width, input.height);
  // ctx.font="400px 'Courier New'";
  // ctx.fillText('A', 120, 200);
}





window.addEventListener('resize',resolutionChange);

function resolutionChange(){
  console.log('updating resolution');
  inputs[0].width=inputs[0].offsetWidth;
  inputs[0].height=inputs[0].offsetHeight;
  output.width=output.offsetWidth;
  output.height=output.offsetHeight;
  resolution[0]=inputs[0].width;
  resolution[1]=inputs[0].height;
  resolutionUpdate=true;
}
