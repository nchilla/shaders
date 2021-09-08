precision highp float;

uniform float u_time;
uniform vec2 u_resolution;


vec3 basic(){
    //these round the x and y values so all those in a certain 50pt interval are grouped together.

    vec2 fracCoord=gl_FragCoord.xy;
    float x = floor(fracCoord.x / 50.0);
    float y = floor(fracCoord.y / 50.0);
    
    //x and y are whole consecutive numbers (steps). The below line gives the remainder of the sum divided by 2. If both numbers are even or both are odd, the remainder is zero. But if you have even-odd or odd-even, you get 1 as the remainder. Thus you can use this to alternate elegantly.
    float g = mod(x + y, 2.0);
    return vec3(g,g,g);
}

vec3 smaller(){
    vec2 fracCoord=gl_FragCoord.xy;
    float x = floor(fracCoord.x / 20.0);
    float y = floor(fracCoord.y / 20.0);
    float g = mod(x + y, 2.0);
    return vec3(g,g,g);
}

vec3 wide(){
    vec2 fracCoord=gl_FragCoord.xy;
    float x = floor(fracCoord.x / 100.0);
    float y = floor(fracCoord.y / 50.0);
    float g = mod(x + y, 2.0);
    return vec3(g,g,g);
}

vec3 diag(){
    vec2 fracCoord=gl_FragCoord.xy;
    float x = floor(fracCoord.x / 50.0);
    float y = floor(fracCoord.y / 50.0);
    float g = mod(x+y, 4.0);
    return vec3(g,g,g);
}

vec3 diagInvert(){
    vec2 fracCoord=gl_FragCoord.xy;
    float x = floor(fracCoord.x / 50.0);
    float y = floor(fracCoord.y / 50.0);
    float g = mod(abs(x - y), 4.0);
    return vec3(g,g,g);
}


// vec2 fracCoord=gl_FragCoord.xy + u_time*20.;

void main() {   
    vec3 rgb;
    rgb=basic();
    rgb=smaller();
    rgb=wide();
    rgb = diag();
    rgb=diagInvert();
    
    gl_FragColor = vec4(rgb, 1.);
}
