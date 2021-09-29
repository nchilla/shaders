
precision highp float;


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_brush[100];

vec3 iterateBasic(){
  float comp=0.0;
  for(int i = 0; i < 100; i++)
  {
    float dist = distance(u_brush[i].xy,gl_FragCoord.xy);
    comp+=1.-step(10.,dist);
  }
  return mix(vec3(1.,1.,1.),vec3(1.,0.,0.),comp);
}

vec3 iterateMin(){
  float comp=0.0;
  for(int i = 0; i < 100; i++)
  {
    float dist = distance(u_brush[i].xy,gl_FragCoord.xy);
    if(i==0){
      comp=dist*10.;
    }else{
      comp=min(comp,dist*10.);
    }
  }
  // return 1.-(comp/u_resolution.x);
  return mix(vec3(1.,0.,0.),vec3(1.,1.,1.),comp/u_resolution.x);
}

vec3 blobby(){
  float comp=0.0;
  for(int i = 0; i < 100; i++)
  {
    float dist = distance(u_brush[i].xy/u_resolution.x,gl_FragCoord.xy/u_resolution.x)*4.;
    if(i==0){
      comp=dist;
    }else{
      comp=comp*dist;
    }
  }
  // return 1.-comp;
  return mix(vec3(1.,0.,0.),vec3(1.,1.,1.),comp);
}

vec3 tester(){
  float comp=0.0;
  float comp2=0.0;
  float comp3=0.0;
  for(int i = 0; i < 100; i++)
  {
    float dist = distance(u_brush[i].xy/u_resolution.x,gl_FragCoord.xy/u_resolution.x)*0.005*u_resolution.x;
    if(i==0){
      comp=dist;
      comp2=dist;
      comp3=dist;
    }else{
      comp=comp*dist;
      if(i<30){
        comp2=comp2*dist;
      }else if(i<60){
        comp3=comp3*dist;
      }
    }


  }
  // return 1.-comp;
  // return mix(vec3(1.,0.,0.),vec3(1.,1.,1.),comp);
  return vec3(comp,comp2,comp3);
}


void main(){

    vec3 epicMix=vec3(0.,0.,0.);
    // epicMix=iterateBasic();
    // epicMix=iterateMin();
    // epicMix=blobby();
    epicMix=tester();

    // comp/=u_resolution.x;
    // comp=1.-comp;
    // comp=step(0.1,comp);
    gl_FragColor=vec4(epicMix,1.);
    // gl_FragColor=vec4(vec3(comp),1.);
}
