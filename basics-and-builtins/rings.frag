precision highp float;
uniform vec2 u_resolution;


vec3 basic(){
    //distance is a trig function to compute the distance between two points,
    vec2 center=u_resolution.xy/2.;
    float d = distance(center.xy, gl_FragCoord.xy);
    //this is like the stripes function. Mod gives you a sawtooth graph, and 40 becomes the range. Then you can use step to chop off as much of that as you want
    float g = step(20.0, mod(d, 40.0));
    return vec3(g,g,g);
}


vec3 wider(){
    vec2 center=u_resolution.xy/2.;
    float d = distance(center.xy, gl_FragCoord.xy);
    float g = step(30.0, mod(d, 40.0));
    return vec3(g,g,g);
}


vec3 offsetCenter(){
    vec2 center=vec2(0.,0.);
    float d = distance(center.xy, gl_FragCoord.xy);
    float g = step(20.0, mod(d, 40.0));
    return vec3(g,g,g);
}

void main() {
    vec3 rgb;
    rgb=basic();
    rgb=wider();
    rgb =offsetCenter();
    gl_FragColor = vec4(rgb, 1.0);
}

