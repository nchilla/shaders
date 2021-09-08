precision highp float;


vec3 dots(){
    vec2 f;
    float incr= 50.0;
    f = fract(gl_FragCoord.xy / incr);    
    float d = distance(vec2(0.5, 0.5), f);
    d=incr*d;
    float g = step(0.04 * gl_FragCoord.x, d);
    return vec3(g,g,g);
}

void main() {
    vec3 rgb;
    rgb=dots();
    gl_FragColor = vec4(rgb, 1.0);
}