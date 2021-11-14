
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform float u_time;
uniform float u_pass;



float img_width=500.;
float img_height=500.;



vec2 mapping(vec2 coord){
  vec2 mapped_coord=coord;
  mapped_coord-=u_resolution/2.;
  float scale=500.;

  mapped_coord+=vec2(img_width/2.,img_height/2.);
  mapped_coord = mapped_coord/scale;
  mapped_coord.y=mapped_coord.y;
  return mapped_coord;
}

vec4 load0(vec2 p) {
    return texture2D(u_sampler, p);
}






vec4 step_jfa(vec2 pCoord,float pass){
  // looking at pixel P:
  // loop through P and 8 surrounding neighbor pixels, offset according to pass number
  // if a loop item Q is a seed
  // compute the distance of P to Q's saved origin
  // if it's shorter than the currently saved distance record, overwrite it.
  vec4 rgba=vec4(0.,0.,0.,0.);


  float offset=exp2(img_width  - pass - 1.);



  float bestDist=900000.;

  for(float x = -1.; x <= 1.; x++) {
    for(float y = -1.; y <= 1.; y++) {
      vec2 nCoord=pCoord;
      nCoord.x+=x*offset;
      nCoord.y+=y*offset;
      //if----------------------
      if(nCoord.x>0.&&nCoord.x<=img_width&&nCoord.y>0.&&nCoord.y<=img_height){
        vec4 neighbor=load0(nCoord);
        //if----------------------
        if(neighbor.a>0.){
          vec2 nOrigin=vec2(neighbor.rg);
          float d=distance(pCoord,nOrigin);
          if(d<bestDist){
            bestDist=d;
            rgba.rg=nOrigin.rg;
            rgba.a=1.;
          }
        }
        //endif----------------------
      }
      //endif----------------------
    }
  }



  return rgba;

}


vec4 jfaPrep(vec2 mapped_coord){
  vec4 texturePixel=load0(mapped_coord);
  if(texturePixel.a>0.){
    texturePixel.rg=mapped_coord.xy;
  }

  return texturePixel;
}


void main(){
    float jump_pass=u_pass-1.;
    vec2 mapped_coord=mapping(gl_FragCoord.xy);
    // vec2 mapped_coord=gl_FragCoord.xy;
    vec4 texturePixel;
    if(jump_pass<0.){
      texturePixel=jfaPrep(mapped_coord);
    }else{
      texturePixel=step_jfa(mapped_coord,jump_pass);
    }




    gl_FragColor=texturePixel;
    // gl_FragColor=texturePixel;
}
