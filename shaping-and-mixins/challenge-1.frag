precision highp float;
uniform vec2 u_resolution;
vec2 center=u_resolution.xy/2.;
float radius=150.;
float blur=50.;
vec2 composite=vec2(radius,radius + blur);
float shiftedRadius=radius + blur;

float makeCircle(float x,float y){
    vec2 c=vec2(x,y);
    float d = distance(c, gl_FragCoord.xy);
    float g = smoothstep(composite.x,composite.y, d);
    return g;
}


vec3 blurTogether(){
    float circle1=makeCircle(center.x - composite.x,center.y);
    float circle2=makeCircle(center.x + composite.x,center.y);
    float g = circle1;
    g*=circle2;
    return vec3(g,g,g);
}

vec3 mirror(){
    float circle1=makeCircle(center.x - composite.x,center.y);
    float circle2=makeCircle(center.x + composite.x,center.y);
    float ohalf=step(0.5,gl_FragCoord.x/u_resolution.x);
    float color=mix(circle1,circle2,ohalf);
    return vec3(color,color,color);
    // return vec3(ohalf,ohalf,ohalf);
}



void main() {

    vec3 rgb;
    rgb=blurTogether();
    rgb=mirror();

    gl_FragColor = vec4(rgb, 1.0);
}