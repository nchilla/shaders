for(int i = 0; i < 100; i++)
{


  // comp+=1.-step(0.05,dist);


  float dist = distance(u_brush[i].xy,gl_FragCoord.xy);
  if(i==0){
    comp=dist*2.;
  }else{
    comp=min(comp,dist*2.);
  }


  //THIS WORKS
  // float dist = distance(u_brush[i].xy,gl_FragCoord.xy);
  // comp+=1.-step(10.,dist);

  //ALSO MAKES SOMETHING INTERESTING
  // float dist = distance(u_brush[i].xy/u_resolution.x,gl_FragCoord.xy/u_resolution.x);
  // comp=max(comp,dist);

  //this is the closest thing to a brush I've gotten so far
  // float dist = distance(u_brush[i].xy/u_resolution.x,gl_FragCoord.xy/u_resolution.x);
  // if(i==0){
  //   comp=dist*10.;
  // }else{
  //   comp=min(comp,dist*10.);
  // }




  // if(u_brush[i].x > gl_FragCoord.x && u_brush[i].y > gl_FragCoord.y){
  //   comp+=1.;
  // }
  // if(u_brush[i].xy == gl_FragCoord.xy){
  //   comp+=1.;
  // }

}
