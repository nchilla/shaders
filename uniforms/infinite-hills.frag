precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

vec3 basic(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.y /= u_resolution.x / u_resolution.y;

    
    coord_N.x += u_time *2.;
    float hill1 = sin(coord_N.x * 1.1) * 0.20;
    float hill2 = sin(coord_N.x * 15.0) * 0.05;
    float hill3 = sin(coord_N.x * 21.1) * 0.02;
    
    vec3 sky = mix(vec3(0.7, 0.7, 1.0), vec3(0.0, 0.2, 1.0), coord_N.y);
    vec3 scene = mix(sky, vec3(0.0, 0.9, 0.0), step(coord_N.y, 0.3 + hill1 + hill2 + hill3));
    return scene;
    
}


vec3 sun(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.y /= u_resolution.x / u_resolution.y;
    
        
    float d = distance(vec2(0.5, 0.4), coord_N);
    float sun = step(d, 0.2);
    
    coord_N.x += u_time *1.;
    float hill1 = sin(coord_N.x * 1.1) * 0.20;
    float hill2 = sin(coord_N.x * 15.0) * 0.05;
    float hill3 = sin(coord_N.x * 21.1) * 0.02;
    
    vec3 sky = mix(vec3(0.7, 0.7, 1.0), vec3(0.0, 0.2, 1.0), coord_N.y);
    vec3 scene=mix(sky,vec3(1.,1.000,0.0),sun);
    scene = mix(scene,vec3(0.0, 0.9, 0.0),step(coord_N.y, 0.3 + hill1 + hill2 + hill3) );
        
    // vec3 scene = mix(sky, vec3(0.0, 0.9, 0.0), step(coord_N.y, 0.3 + hill1 + hill2 + hill3));
    return scene;
}

vec3 faster(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.y /= u_resolution.x / u_resolution.y;
    
    coord_N.x += u_time *5.;
    float hill1 = sin(coord_N.x * 1.1) * 0.20;
    float hill2 = sin(coord_N.x * 15.0) * 0.05;
    float hill3 = sin(coord_N.x * 21.1) * 0.02;
    
    vec3 sky = mix(vec3(0.7, 0.7, 1.0), vec3(0.0, 0.2, 1.0), coord_N.y);
    vec3 scene = mix(sky, vec3(0.0, 0.9, 0.0), step(coord_N.y, 0.3 + hill1 + hill2 + hill3));
    return scene;
}


void main() {
    vec3 rgb;
    rgb=basic();
    rgb=faster();
    rgb=sun();
    
    gl_FragColor = vec4(rgb, 1.0);
}
