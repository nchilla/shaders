
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform float u_time;
uniform float u_pass;

const float c_maxSteps = 10.0;


vec2 mapping(vec2 coord){
  vec2 mapped_coord=coord;
  mapped_coord-=u_resolution/2.;
  float scale=500.;
  float img_width=500.;
  float img_height=500.;
  mapped_coord+=vec2(img_width/2.,img_height/2.);
  mapped_coord = mapped_coord/scale;
  mapped_coord.y=mapped_coord.y;
  return mapped_coord;
}

vec4 load0(vec2 p) {
    return texture2D(u_sampler, p);
}


vec4 step_alt_jfa(vec4 texturePixel,vec2 mapped_coord){

  float offset=pow(2.,log2(2.) - floor(u_pass/10.) - 1.);
  // float offset=10.;

  // float iter = mod(u_time,13.0);
  // float level = clamp(iter-1.0,0.0,11.0);
  // float offset = exp2(11.0 - level);

  // float max_steps=4.0;
  // float delay=7.;
  // float level=floor(u_pass/delay);
  // level = clamp(level-1.0, 0.0, max_steps);
  // float offset=floor(exp2(max_steps - level)+0.5);


  // float offset=floor(8.5/exp2(u_pass));


  //check if the pixel is seed point already(if its a value is 1)
  if(u_pass<1.){
    if(texturePixel.a>0.){
      texturePixel.rg=mapped_coord;
    }
  }else if(texturePixel.a<1.){

    //will store closest seed coordinates and distance
    vec2 closest_coord=vec2(0.0);
    float closest_dist=999999.;
    vec3 closest_val=vec3(0.,0.,0.);



    //loop through offset neighbors
    for(int x=-1; x <= 1;x++){
      for(int y=-1; y <= 1;y++){
        vec2 neighbor_coord=mapped_coord + vec2(x,y)*offset;
        vec4 neighbor_val=texture2D(u_sampler,neighbor_coord);
        // vec4 neighbor_val=load0(neighbor_coord);
        //check if the neighbor is a seed
        if(neighbor_val.a>0.){
          float d=length(neighbor_val.rg-mapped_coord);

          if((x != 0 || y != 0) && d<closest_dist){
            // coord_pass=neighbor_coord;

            closest_dist=d;
            closest_coord=neighbor_coord;
            closest_val= neighbor_val.rgb;

          }
        }

      }
    }
    //if there was at least one seed point, store its coords and distance in the vec
    if(closest_dist<999999.){
      texturePixel.rg=closest_val.rg;
      // texturePixel.rg=closest_coord.xy;
      // texturePixel.b=closest_dist/500.;
      texturePixel.a=1.;
    }
  }

  // texturePixel.a=1. - offset/10.;



  return texturePixel;

}



vec4 step_jfa(vec4 texturePixel,vec2 mapped_coord){
  // vec2 mapped_coord=mapping(gl_FragCoord.xy);
  //thank you to users paniq and demofox on shadertoy for inspiring this implementation of JFA
  // https://www.shadertoy.com/view/4syGWK
  // https://www.shadertoy.com/view/lsKGDV

  // float offset=pow(2.,log2(10.) - u_pass - 1.);
  // float offset=10.;

  // float iter = mod(u_time,13.0);
  // float level = clamp(iter-1.0,0.0,11.0);
  // float offset = exp2(11.0 - level);

  float max_steps=4.0;
  float delay=7.;
  float level=floor(u_pass/delay);
  level = clamp(level-1.0, 0.0, max_steps);
  float offset=floor(exp2(max_steps - level)+0.5)/100000.;


  // float offset=floor(8.5/exp2(u_pass));


  //check if the pixel is seed point already(if its a value is 1)
  if(texturePixel.a<1.){

    //will store closest seed coordinates and distance
    vec2 closest_coord=vec2(0.0);
    float closest_dist=9999.;
    vec3 closest_val=vec3(0.,0.,0.);



    //loop through offset neighbors
    for(int x=-1; x <= 1;x++){
      for(int y=-1; y <= 1;y++){
        vec2 neighbor_coord=mapped_coord + vec2(x,y)*offset;
        vec4 neighbor_val=texture2D(u_sampler,neighbor_coord);
        // vec4 neighbor_val=load0(neighbor_coord);
        //check if the neighbor is a seed
        if(neighbor_val.a>0.){
          float d=length(neighbor_coord-mapped_coord);

          if((x != 0 || y != 0) && d<closest_dist){
            // coord_pass=neighbor_coord;

            closest_dist=d;
            closest_coord=neighbor_coord;
            closest_val= neighbor_val.rgb;

          }
        }

      }
    }
    //if there was at least one seed point, store its coords and distance in the vec
    if(closest_dist<9999.){

      texturePixel.rg=closest_coord.xy;
      // texturePixel.b=closest_dist/500.;
      texturePixel.a=1.;
    }
  }

  // texturePixel.a=1. - offset/10.;



  return texturePixel;

}


void main(){
    vec2 mapped_coord=mapping(gl_FragCoord.xy);
    vec4 texturePixel=texture2D(u_sampler,mapped_coord);
    vec4 jfa=step_alt_jfa(texturePixel,mapped_coord);


    gl_FragColor=jfa;
    // gl_FragColor=texturePixel;
}
