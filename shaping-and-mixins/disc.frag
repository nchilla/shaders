precision highp float;
uniform vec2 u_resolution;
vec2 center=u_resolution.xy/2.;


vec3 basic(){
    float d = distance(center, gl_FragCoord.xy);
    float g = smoothstep(100.0, 150.0, d);
    return vec3(g,g,g);
}

vec3 lessBlurry(){
    float d = distance(center, gl_FragCoord.xy);
    float g = smoothstep(100.0, 120.0, d);
    return vec3(g,g,g);
}

vec3 inverted(){
    float d = distance(center, gl_FragCoord.xy);
    float g = smoothstep(100.0, 150.0, d);
    g= 1. - g;
    return vec3(g,g,g);
}

void main() {

    vec3 rgb;
    rgb=basic();
    rgb=lessBlurry();
    rgb=inverted();
    
    gl_FragColor = vec4(rgb, 1.0);
}
