precision highp float;

uniform vec2 u_resolution;

uniform float u_time;
float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

//function that returns a circle mask
float circle(vec2 coord, vec2 loc, float radius, float blur) {
    return smoothstep(radius, radius + blur, distance(loc, coord));
    return 1.0;
}

vec3 annotated(){
    //changes every second I suppose? given u_time is mapped as 1 second = 1.
    float tick = floor(u_time);
    
    //obv changes background color
    vec3 background_color = vec3(
        rand(tick + vec2(0.1, 0.0)),
        rand(tick + vec2(0.2, 0.0)),
        rand(tick + vec2(0.3, 0.0))
    );
    
    //this makes the color a bit more subdued by mixing it with dark grey
    background_color = mix(background_color, vec3(0.3, 0.3, 0.3), 0.5);
    
    //makes the foreground using a different seed pattern
    vec3 foreground_color = vec3(
        rand(tick + vec2(0.1, 0.1)),
        rand(tick + vec2(0.2, 0.1)),
        rand(tick + vec2(0.3, 0.1))
    );
    
    //decides the center of the circle
    vec2 location = vec2(
        rand(tick + vec2(0.1, 0.2)),
        rand(tick + vec2(0.2, 0.2))
    ) * u_resolution;
    
    //decides the radius of the circle
    float size = rand(tick + vec2(0.1, 0.3)) * 300.0 + 100.0;
    
    vec3 scene = background_color;
    //masks foreground over background
    scene = mix(foreground_color, scene, circle(gl_FragCoord.xy, location, size, 40.0));

    return scene;
}

vec3 gradientBackground(){
    float tick = floor(u_time);

    vec3 bcolor1 = vec3(
        rand(tick + vec2(0.1, 0.0)),
        rand(tick + vec2(0.2, 0.0)),
        rand(tick + vec2(0.3, 0.0))
    );
    vec3 bcolor2 = vec3(
        rand(tick + vec2(0.4, 0.0)),
        rand(tick + vec2(0.5, 0.0)),
        rand(tick + vec2(0.6, 0.0))
    );
    vec3 background_color=mix(bcolor1,bcolor2,gl_FragCoord.y/u_resolution.y);
    background_color = mix(background_color, vec3(0.5, 0.5, 0.5), 0.7);

    vec3 foreground_color = vec3(
        rand(tick + vec2(0.1, 0.1)),
        rand(tick + vec2(0.2, 0.1)),
        rand(tick + vec2(0.3, 0.1))
    );

    vec2 location = vec2(
        rand(tick + vec2(0.1, 0.2)),
        rand(tick + vec2(0.2, 0.2))
    ) * u_resolution;

    float size = rand(tick + vec2(0.1, 0.3)) * 300.0 + 100.0;
    
    vec3 scene = background_color;
    scene = mix(foreground_color, scene, circle(gl_FragCoord.xy, location, size, 40.0));

    return scene;
}

vec3 secondCircle(){
    float tick = floor(u_time);

    vec3 background_color = vec3(
        rand(tick + vec2(0.1, 0.0)),
        rand(tick + vec2(0.2, 0.0)),
        rand(tick + vec2(0.3, 0.0))
    );
    background_color = mix(background_color, vec3(0.3, 0.3, 0.3), 0.7);

    vec3 fcolor1 = vec3(
        rand(tick + vec2(0.1, 0.1)),
        rand(tick + vec2(0.2, 0.1)),
        rand(tick + vec2(0.3, 0.1))
    );
     vec3 fcolor2 = vec3(
        rand(tick + vec2(0.4, 0.1)),
        rand(tick + vec2(0.5, 0.1)),
        rand(tick + vec2(0.6, 0.1))
    );

    vec2 location1 = vec2(
        rand(tick + vec2(0.1, 0.2)),
        rand(tick + vec2(0.2, 0.2))
    ) * u_resolution;
    vec2 location2 = vec2(
        rand(tick + vec2(0.3, 0.2)),
        rand(tick + vec2(0.4, 0.2))
    ) * u_resolution;

    float size1 = rand(tick + vec2(0.1, 0.3)) * 300.0 + 100.0;
    float size2 = rand(tick + vec2(0.3, 0.1)) * 300.0 + 100.0;
    
    vec3 scene = background_color;
    scene = mix(fcolor1, scene, circle(gl_FragCoord.xy, location1, size1, 40.0));
    scene = mix(fcolor2, scene, circle(gl_FragCoord.xy, location2, size2, 40.0));

    return scene;
}

void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=gradientBackground();
    rgb=secondCircle();
    gl_FragColor = vec4(rgb, 1.0);
}
