precision highp float;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

float circle(vec2 i,vec2 f, float incr,float size){
    vec2 offset=vec2(
        rand(i),
        rand(i+4.)
    );
    // offset*=0.5;
    float jscale=1.2;
    vec2 jitter=jscale/2. - offset * jscale;
    float d=distance(vec2(0.5) + jitter,f);
    float fill=step(0.4,d);

    return fill;
}

vec3 drawingBoard(){
    float incr=120.;
    float size= 50.;
    vec2 i = floor(gl_FragCoord.xy/incr);
    vec2 f = fract(gl_FragCoord.xy/incr);

    float checkers=mod(i.x+i.y,2.);

    vec2 up=vec2(0.,1.);
    
    float g_0 = circle(i,f,incr,size);
    float g_1 = circle(i + up,f - up,incr,size);

    vec3 rgb;
    rgb.r=g_0;
    rgb.g=g_1;


    return rgb;
}




void main() {
    vec3 rgb;
    rgb=drawingBoard();
 

    gl_FragColor = vec4(rgb, 1.0);
}
