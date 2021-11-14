
precision highp float;


uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform float u_time;
uniform float u_pass;



float img_width=500.;
float img_height=500.;



vec2 mapping(vec2 coord){
  // scales the texture to the canvas coordinates — not sure why I had to do this
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

  //offset neighbors according to pass number
  float offset=exp2(log2(img_width)  - pass - 1.);

  vec4 rgba=vec4(0.,0.,0.,0.);
  float bestDist=900000.;

    // loop through P and 8 surrounding neighbor pixels
  for(float x = -1.; x <= 1.; x++) {
    for(float y = -1.; y <= 1.; y++) {
      vec2 nCoord=pCoord;
      nCoord.x+=x*offset;
      nCoord.y+=y*offset;

      // if the loop item Q exists
      if(nCoord.x>0.&&nCoord.x<=img_width&&nCoord.y>0.&&nCoord.y<=img_height){
        vec4 neighbor=load0(nCoord);
        //if Q is a seed
        if(neighbor.a>0.){
          // compute the distance of P to Q's saved origin
          vec2 nOrigin=vec2(neighbor.rg);
          float d=distance(pCoord,nOrigin);
          if(d<bestDist){
            // if it's shorter than the currently saved distance record, overwrite the saved origin in P.
            bestDist=d;
            rgba.rg=nOrigin.rg;
            rgba.a=1.;

          } //endif----------------------

        } //endif----------------------

      } //endif----------------------
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
    vec4 texturePixel;
    if(jump_pass<0.){
      texturePixel=jfaPrep(mapped_coord);
    }else{
      texturePixel=step_jfa(mapped_coord,jump_pass);
    }


    gl_FragColor=texturePixel;
}
