
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
uniform float u_time;
uniform float u_pass;



uniform int u_layer;
uniform float u_mixer;
uniform vec3 u_colors[3];
uniform float u_effects[3];
uniform float u_spreads[3];
uniform float u_active[3];



// vec2 img_size=u_resolution;


vec2 norm(vec2 coord){
  vec2 uv =(coord.xy-0.5) / u_resolution.xy;
  return uv;
}

float trimTransform(vec4 texturePixel,float spread){
  float dist=length((texturePixel.rg*u_resolution)-gl_FragCoord.xy)/200.;
  float edge=step(spread/500.,dist);
  dist=mix(dist,1.,edge);
  return dist;
}




float e_topograph(float dist,float spread){
  float fill= mod(dist, u_resolution.x/5000.) * 10.0;
  fill = step(0.1, fill+0.02);
  float edge=step(spread/u_resolution.x,dist);
  fill=mix(fill,1.,edge);
  float innerEdge=step(0.01,dist);
  fill=mix(0.,fill,innerEdge);
  return fill;
}

float e_spiky(float dist,float spread, float angle){
  float fill =mod(angle, u_resolution.x/2000.)*5.;
  fill = step(0.1, fill*dist);
  float edge=step(spread/u_resolution.x,dist);
  fill=mix(fill,1.,edge);
  float innerEdge=step(0.01,dist);
  fill=mix(0.,fill,innerEdge);
  return fill;
}


vec3 f_multiply(vec3 l0,vec3 l1,vec3 l2){
  vec3 rgb=l0*l1*l2;
  return rgb;
}


void main(){


    //needs a way to quickly decide which layers to display
    //should happen in blending mode functions





    vec2 mapped_coord=norm(gl_FragCoord.xy);
    vec4 samples[3];
    samples[0]=texture2D(u_sampler,mapped_coord);
    samples[1]=texture2D(u_sampler1,mapped_coord);
    samples[2]=texture2D(u_sampler2,mapped_coord);

    //for loop checks which effect has been chosen for each shader and applies it accordingly
    //returns vec3 per layer
    vec3 layers[3];
    for(int i=0;i<3;++i){
      layers[i]=vec3(1.);
      vec2 scaledCoord=samples[i].rg*u_resolution;
      float dist=length(scaledCoord.xy-gl_FragCoord.xy)/200.;
      float angle=atan((scaledCoord.y-gl_FragCoord.y)/(scaledCoord.x-gl_FragCoord.x));
      if(u_effects[i]==0.){
        layers[i]=mix(u_colors[i],vec3(1.),e_topograph(dist,u_spreads[i]));
      }else if(u_effects[i]==1.){
        layers[i]=mix(u_colors[i],vec3(1.),e_spiky(dist,u_spreads[i],angle));
      }
      layers[i]=mix(layers[i],vec3(1.),u_active[i]);

    }


    vec3 rgb=vec3(1.);
    if(u_layer==0){
      //only show layer 0
      rgb=layers[0];
    }else if(u_layer==1){
      //only show layer 1
      rgb=layers[1];
    }else if(u_layer==2){
      //only show layer 2
      rgb=layers[2];
    }else if(u_layer==4){
      //if composite mode is on, do a blending pass
      if(u_mixer==0.){
        rgb=f_multiply(layers[0],layers[1],layers[2]);
      }
    }




    gl_FragColor=vec4(rgb,1.);





}
