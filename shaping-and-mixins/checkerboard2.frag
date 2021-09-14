precision highp float;

uniform vec2 u_resolution;


vec3 annotated(){
    //divide page into increments of 50 used to determine the color
    float x = floor(gl_FragCoord.x / 50.0);
    float y = floor(gl_FragCoord.y / 50.0);
    
    //this gives alternating returns of 0 and 1 based on the remainder of the stepped x and y divided by 2
    float mask = mod(x + y, 2.0);
    
    //if these were given as constants like 1 and 0, the squares would be solid colors
    //using the y val and resolution, halved:
        //light gradates from 1 to 0.5
        //and dark gradates from 0.5 to 0
    float light = 1.0 - gl_FragCoord.y / (u_resolution.y * 2.);
    float dark = 0.5 - gl_FragCoord.y / (u_resolution.y * 2.);
   
    //this just alternates between the dark and light values
    //because mask, which is just 0 or 1, is the number used to interpolate the two values in mix.
    float g = mix(dark, light, mask);

    return vec3(g);
}


vec3 allDarkAsMiddleGray(){
    float x = floor(gl_FragCoord.x / 50.0);
    float y = floor(gl_FragCoord.y / 50.0);
    

    float mask = mod(x + y, 2.0);

    float light = 1.0 - gl_FragCoord.y / (u_resolution.y * 2.);
    float dark = 0.5;
   
    float g = mix(dark, light, mask);

    return vec3(g);
}

vec3 whiteAllTheWayToBlack(){
    float x = floor(gl_FragCoord.x / 50.0);
    float y = floor(gl_FragCoord.y / 50.0);
    

    float mask = mod(x + y, 2.0);

    float light = 1.0 - gl_FragCoord.y / u_resolution.y;
    float dark = 0.5 - gl_FragCoord.y / (u_resolution.y * 2.);
   
    float g = mix(dark, light, mask);

    return vec3(g);
}

vec3 kindOfCoolComposite(){
    float x = floor(gl_FragCoord.x / 50.0);
    float y = floor(gl_FragCoord.y / 50.0);
    

    float mask = mod(x + y, 2.0);

    float light = 1.0 - gl_FragCoord.y / u_resolution.y;
    float dark = 0.5;
   
    float g = mix(dark, light, mask);

    return vec3(g);
}


void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=allDarkAsMiddleGray();
    rgb=whiteAllTheWayToBlack();
    rgb=kindOfCoolComposite();
    
    gl_FragColor = vec4(rgb, 1.0);
}
