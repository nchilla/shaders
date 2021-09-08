precision highp float;
uniform vec2 u_resolution;

vec3 basic(){
    float line = u_resolution.y/2.;
    //this just adds the remainder to a baseline. Mod functions, as we have seen, create a sawtooth graph.
    line += mod(gl_FragCoord.x, 50.0);
    
    //then all that is left is to direct it to turn everything under the line solid
    float g = step(line, gl_FragCoord.y);
    return vec3(g,g,g);
}

vec3 biggerTriangles(){
    float line = u_resolution.y/2.;
    line += mod(gl_FragCoord.x, 200.0);
    float g = step(line, gl_FragCoord.y);
    return vec3(g,g,g);
}

vec3 otherWay(){
    //with these inversions, you just have to flip the increase of the remainder into a decrease, which will still get you the sawtooth but going the other way.
    //You can tell it's a subtraction because it punches in instead of pushing out.
    float line = u_resolution.y/2.;
    line -= mod(gl_FragCoord.x, 200.0);
    float g = step(line, gl_FragCoord.y);
    return vec3(g,g,g);
}

void main() {
    vec3 rgb;
    rgb=basic();
    rgb=biggerTriangles();
    rgb=otherWay();
   
    gl_FragColor = vec4(rgb, 1.0);
}
