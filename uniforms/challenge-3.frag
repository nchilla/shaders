precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;

float clampStep(float edge1,float edge2,float val){
    float a=step(edge1,val);
    float b=step(edge2,val);
    return mod(a+b,2.);
}


void main(){
    float x = clampStep(u_mouse.x - 1.,u_mouse.x,gl_FragCoord.x);
    float y = clampStep(u_mouse.y -1.,u_mouse.y,gl_FragCoord.y);
    float comp=mod(x+y,2.);

    gl_FragColor=vec4(vec3(comp),1.);
}