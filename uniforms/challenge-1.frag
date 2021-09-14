precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

vec3 basic(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.y /= u_resolution.x / u_resolution.y;

    
    coord_N.x += 7.;
    float hill1 = sin(coord_N.x * 1.1) * 0.20;
    float hill2 = sin(coord_N.x * 15.0) * 0.05;
    float hill3 = sin(coord_N.x * 21.1) * 0.02;
    
    // float composite=smoothstep(coord_N.y-0.1,coord_N.y, 0.3 + hill1 + hill2 + hill3);
    float composite=step(coord_N.y, 0.3 + hill1 + hill2 + hill3);
    float outline=step(coord_N.y - 0.015, 0.3 + hill1 + hill2 + hill3);

    vec3 sky = mix(vec3(0.7, 0.7, 1.0), vec3(0.0, 0.2, 1.0), coord_N.y);
    vec3 scene = mix(sky, vec3(0.0, 0.0, 0.0), outline);
    scene = mix(scene, vec3(0.0, 0.9, 0.0), composite);
    return scene;
    
}

void main() {
    vec3 rgb;
    rgb=basic();
  
    gl_FragColor = vec4(rgb, 1.0);
}