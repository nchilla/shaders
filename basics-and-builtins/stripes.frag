precision highp float;


vec3 basic(){
    //so the step float dictates the stroke width, and the float inside the mod dictates the gap.
    // Mod gets the remainder of the x value divided by 50. 
    // Mod graphs have a sort of sawtooth look, because as x gets larger the remainder gets larger until its able to fit another 50 in, at which point the remainder returns to 0 and restarts its ascension. The output of mod will always be a number between 0 and 50. And then with the step we can say, if that output is larger than a certain minimum, output 1, and otherwise output 0.
    float x = step(20., mod(gl_FragCoord.x, 50.));
    return vec3(x,x,x);
}

vec3 horizontal(){
    float y = step(20., mod(gl_FragCoord.y, 50.));
    return vec3(y,y,y);
}

vec3 wideWhiteThinBlack(){
    float x = step(5., mod(gl_FragCoord.x, 100.));
    return vec3(x,x,x);
}

void main() {
    
    vec3 rgb;
    rgb=basic();
    rgb=horizontal();
    rgb=wideWhiteThinBlack();
    
    gl_FragColor = vec4(rgb, 1.0);
}

