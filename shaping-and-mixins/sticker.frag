precision highp float;

uniform vec2 u_resolution;

vec3 annotated(){
    //defines the center of the circle and measures the distance between it and the current pixel
    float d = distance(u_resolution/2., gl_FragCoord.xy);
    float background = gl_FragCoord.y / u_resolution.y;
    background = background * 0.3 + 0.4;
    
    
    float foreground = gl_FragCoord.x / u_resolution.x + (gl_FragCoord.y - u_resolution.y/2.) / 200.0;
    foreground = 1.0 - abs(foreground - 0.5) * 2.0;
    foreground = clamp(foreground, 0.0, 1.0);
    foreground = pow(foreground, 4.0);
    
    float g = mix(foreground, background, step(200.0, d));

    return vec3(g,g,g);
}

vec3 justTheGradientAnnotated(){

    float foreground;
    float horizontalGradient=gl_FragCoord.x / u_resolution.x;
    float verticalGradient=(gl_FragCoord.y - u_resolution.y/2.)/200. ;

    //the horizontal gradient is shifted vertically, not by a uniform amount, but by an amount based on the pixel's y coord
    //the gradient is like a linear vector, its angle determined by the proportion of the Y to the X
    foreground=horizontalGradient + verticalGradient;
    //this uses an abs to halt and flip the gradient value progression
    foreground = 1.0 - abs(foreground - 0.5) * 2.0;

    //I think this is necessary because the foreground value has the capacity to be negative,
    //so if you don't limit it at 0, the power of 4 line can turn it positive and thus give you whites
    //I tried it with a max() instead of a clamp and it produces the same result, so I don't think the upper limit is technically necessary.
    foreground = clamp(foreground, 0.0, 1.0);
    foreground = pow(foreground, 4.0);

   return vec3(foreground);
}

vec3 moveStripeUp(){
    float d = distance(u_resolution/2., gl_FragCoord.xy);
    float background = gl_FragCoord.y / u_resolution.y;
    background = background * 0.3 + 0.4;
    
    float foreground = gl_FragCoord.x / u_resolution.x + (gl_FragCoord.y - u_resolution.y/2.) / 200.0;
    foreground = 1.0 - abs(foreground - 0.8) * 2.0;
    foreground = clamp(foreground, 0.0, 1.0);
    foreground = pow(foreground, 4.0);
    
    float g = mix(foreground, background, step(200.0, d));

    return vec3(g,g,g);
}

vec3 invert(){
    float d = distance(u_resolution/2., gl_FragCoord.xy);
    float background = gl_FragCoord.y / u_resolution.y;
    background = background * 0.3 + 0.4;
    
    float foreground = gl_FragCoord.x / u_resolution.x + (gl_FragCoord.y - u_resolution.y/2.) / 200.0;
    foreground = 1.0 - abs(foreground - 0.5) * 2.0;
    foreground = clamp(foreground, 0.0, 1.0);
    foreground = pow(foreground, 4.0);
    foreground=1. - foreground;
    
    float g = mix(foreground, background, step(200.0, d));

    return vec3(g,g,g);
}




void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=justTheGradientAnnotated();
    rgb=moveStripeUp();
    rgb=invert();
    
    gl_FragColor = vec4(rgb, 1.0);
}
