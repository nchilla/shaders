precision highp float;

vec3 basic(){
    vec2 f;
    //either fract or mod, the idea here is we create a sawtooth pattern in both directions.
    f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    // f = mod(gl_FragCoord.xy , vec2(1.02,1.02));
    
	//within a box, the fractions f.xy will go from zero to 1, like a mini coordinate plane.
    //therefore we can calculate their distance from a center point in that plane.
    float d = distance(vec2(0.5, 0.5), f);
    //if the distance is less than the radius, make the circle black
    float g = step(0.3, d);
    
    return vec3(g,g,g);
}

vec3 justSeeingWhatFractDoesAlone(){
    vec2 f;

    f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));

    float d = distance(vec2(0.5, 0.5), f);
    float g = step(0.3, d);
    
    float s=f.x * f.y;
    return vec3(g,s,s);
}

vec3 biggerDots(){
    vec2 f;
    f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));    
    float d = distance(vec2(0.5, 0.5), f);
    float g = step(0.5, d);
    
    return vec3(g,g,g);
}

vec3 closerDots(){
    vec2 f;
    float incr= 40.0;
    f = fract(gl_FragCoord.xy / incr);    
    float d = distance(vec2(0.5, 0.5), f);
    //d is a fraction, so the radius normally changes when the box becomes smaller. Instead, lets make it absolute by scaling the distance by the size of the box.
    d=incr*d;
    float g = step(15., d);
    
    return vec3(g,g,g);
}





void main() {
	
  	vec3 rgb;
    rgb=basic();
    rgb=justSeeingWhatFractDoesAlone();
    rgb=biggerDots();
    rgb=closerDots();
    
    gl_FragColor = vec4(rgb, 1.0);
}
