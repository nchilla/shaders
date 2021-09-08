precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float random (float i) {
    return fract(sin(dot(vec2(i * .01, .123), vec2(12.9898,78.233))) * 43758.5453123);
}

float map(float v, float a, float b, float y, float z) {
    float n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec2 map(vec2 v, vec2 a, vec2 b, vec2 y, vec2 z) {
    vec2 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

float floor_to(float v, float m) {
    return floor(v/m)*m;
}

float max(float a, float b, float c) {
    return max(max(a, b), c);
}

float random(float i, float min, float max) {
    return random(i) * (max - min) + min;
}

float random(float i, float min, float max, float step) {
    
	// random gives you a number between 0 and 1, and multiplying it to max-min scales it to the height range we want. Then, that's passed to floor_to, which rounds the value down to the nearest step increment
	// finally the result is added to min, so it starts where it's supposed to start
    
    return floor_to(random(i) * (max - min), step) + min;
}

//I think this is called "grid width" because there's a grid inside each building for determining the window placement. But this is something like the building width, although it doesn't seem like it's 50px exactly.
float grid_width = 50.0;


void main()
{	
    vec4 frag_coord = gl_FragCoord;
    
    // scroll
    frag_coord.x += u_time * 20.; 

    // horizontal grid
    //so if the coord is less than 50px, i is 0
    //less than 100 but more than 50, 1, and etc
    float i = floor(frag_coord.x / grid_width);
    float f = fract(frag_coord.x / grid_width);
    
    // create some buildings
    
    float building_top = random(i, 100., 400., 30.);
    //this calculates the top of the building within a horizontal step range i
    //the last value is the vertical step increment
    // float building_top = 100. + random(i, 0., 300., 30.);
    //the 100. in the above original is sort of redundant because there's already a min built into the random function
    
    
    //this compares the y position with the building top, and decides whether or not the building needs to be filled in.
    float building_mask = step(building_top, frag_coord.y);

    // create a sky gradient
    vec4 sky_color = vec4(
        0.,
        0.,
        map(frag_coord.y, 0., u_resolution.y, 1., 0.3),
        1.);

    // create windows
    //which row and column of window, depending on x and y
    //at this point not actually dependent on the building location or size
    vec2 window_i = floor(frag_coord.xy / vec2(grid_width / 5., 20.));
    
    // this gets the fractional portion of i
    vec2 window_f = fract(frag_coord.xy / vec2(grid_width / 5., 20.));
    // why is the x index multiplied by 1002?
    //this generates a random value for a quadrant of the page as divided above
    float window_mask = random(window_i.x * 1002.0 + window_i.y);
    // window_mask = random((window_i.x + window_i.y) * 2432.432345 );
    
    //this filters out all the values below 0.7, and makes the rest 1
    window_mask = step(.7, window_mask);

    //these create a border around the quadrants
    window_mask *= step(.3, window_f.x);
    window_mask *= step(.5,window_f.y);


    window_mask *= step(.2, f)-step(.8, f);
    // window_mask = 0.;
    
    
    // combine colors
    

    //where there is no building, there should be a sky
    vec4 out_color = building_mask * sky_color;
    
    // where there is a building, there may be a window, and it should have this RGB
    out_color.rgb += (1. - building_mask) * window_mask * vec3(.9, .9, .7);
    // resets opacity
    out_color.a = 1.;

    // return
    gl_FragColor = out_color;
}