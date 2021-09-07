#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec4 vertBlackToRed(){
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
    float x = fragCoord_N.x;
    float y = fragCoord_N.y;
    return vec4(1. - y,0.,0,1);
}

vec4 vertRedtoBlacktoRedSine(){
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
    float x = fragCoord_N.x;
    float y = fragCoord_N.y;
    float redDeg=y*180.;
    float redRad=radians(redDeg);
    float redSine=sin(redRad);
    float redUse = abs(1. - redSine);
    return vec4(redUse,0.,0,1);
}

vec4 vertRedtoBlacktoRed(){
    // I don't know why I made it stupidly complicated the first time but here's one using just abs
     vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
     float y = fragCoord_N.y*2.;
     float final = abs(1. - y);
     return vec4(final,0.,0,1);
}

vec4 vertRedtoBlacktoBlue(){
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
    float y = fragCoord_N.y * 2.;
    float r = max(1. - y,0.);
    float b = max(y - 1.,0.);
    return vec4(r,0.,b,1);
}


vec4 horiWhiteToBlue(){
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
    float x = fragCoord_N.x;
    float y = fragCoord_N.y;
    return vec4(x,x,1.,1);
}



void main() {
    //uncomment these to see the different versions
	// gl_FragColor = vertBlackToRed();
    // gl_FragColor = horiWhiteToBlue();
    // gl_FragColor = vertRedtoBlacktoRedSine();
    // gl_FragColor = vertRedtoBlacktoRed();
    gl_FragColor=vertRedtoBlacktoBlue();
}
