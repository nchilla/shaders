precision highp float;
uniform float u_time;
uniform vec2 u_resolution;


float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}


vec3 basic(){
    float r = rand(gl_FragCoord.xy * 0.001);
    return vec3(r);
}

vec3 blackAndRed(){
    float r = rand(gl_FragCoord.xy * 0.001);
   	vec3 mixed=mix(vec3(0.,0.,0.),vec3(1.,0.,0.),r);
    return mixed;
}

vec3 shifting(){
    float r = rand(gl_FragCoord.xy * 0.001 * u_time + 10.);
    return vec3(r);
}


void main() {
    vec3 rgb;
    rgb= basic();
    rgb=shifting();
    // rgb=blackAndRed();
    gl_FragColor = vec4(rgb, 1.0);
}
