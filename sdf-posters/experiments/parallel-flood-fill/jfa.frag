
precision highp float;


uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform float u_time;
uniform float u_pass;



float img_width=500.;
float img_height=500.;
vec2 img_size=vec2(500.,500.);



vec2 norm(vec2 p){
  return p/img_size;
}

vec2 denorm(vec2 p){
  return p*img_size;
}




vec4 load0(vec2 p) {
    vec2 uv = (p-0.5) / img_size.xy;
    return texture2D(u_sampler, uv);
}


vec4 step_jfa(float pass){
  // vec2 pCoord=(gl_FragCoord.xy-0.5) / img_size.xy;
  vec2 pCoord=gl_FragCoord.xy;

  // looking at pixel P:

  //offset neighbors according to pass number
  float offset=exp2(log2(img_width)  - pass - 1.);

  vec4 rgba=vec4(0.,0.,0.,1.);
  float bestDist=900000.;

    // loop through P and 8 surrounding neighbor pixels
  for(float x = -1.; x <= 1.; x++) {
    for(float y = -1.; y <= 1.; y++) {
      vec2 nCoord=pCoord;
      nCoord.x+=x*offset;
      nCoord.y+=y*offset;
      vec4 neighbor=load0(nCoord);
      neighbor.rg=denorm(neighbor.rg);

      vec2 nOrigin=vec2(neighbor.rg);
      float d=distance(pCoord,nOrigin);
      if((nOrigin.x != 0.0 || nOrigin.y != 0.0)&&d<bestDist){
        // if it's shorter than the currently saved distance record, overwrite the saved origin in P.
        bestDist=d;
        rgba.rg=norm(nOrigin.rg);
        // rgba.a=1.;

      }





    }
  }


  return rgba;

}




vec4 jfaPrep(){
  vec4 texturePixel=load0(gl_FragCoord.xy);
  texturePixel.rg=vec2(0.,0.);
  if(texturePixel.a>0.){
    // texturePixel.rg=(gl_FragCoord.xy-0.5) / img_size.xy;
    texturePixel.rg=norm(gl_FragCoord.xy);
  }
  texturePixel.a=1.;
  return texturePixel;
}




void main(){
    float jump_pass=u_pass-1.;
    vec4 texturePixel;
    if(jump_pass<0.){
      texturePixel=jfaPrep();
    }else{
      texturePixel=step_jfa(jump_pass);
    }


    gl_FragColor=texturePixel;
}
