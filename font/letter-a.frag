precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float drawLine(vec2 start,vec2 end,float stroke,vec2 pos){
    vec2 delta=end - start;
    float increment=delta.y/delta.x;
    float line_y=increment*(pos.x - start.x) + start.y;
    float angle = atan(delta.y/delta.x);
    float vert_stroke=abs(stroke/2. / cos(angle));
    float line= step(line_y, pos.y + vert_stroke) - step(line_y, pos.y - vert_stroke);
    float perpendicular=delta.x/delta.y*-1.;
    float cap1_y=perpendicular*(pos.x - start.x) + start.y;
    float cap1=abs(step(pos.y,cap1_y) - step(start.y,end.y));
    float cap2_y=perpendicular*(pos.x - end.x) + end.y;
    float cap2= abs(step( pos.y,cap2_y) - step(end.y,start.y));
    line=line*cap1*cap2;
    line=1.-line;

    return line;
}

float circle(vec2 frag_coord, float radius) {
    return max(length(frag_coord) - radius,0.);
}


void main() {
    vec3 rgb;
    vec2 start=vec2(u_resolution.x/2.,u_resolution.y/2.);
    vec2 end=u_mouse;

    float g = drawLine(vec2(50.,50.),vec2(300.,600.),20.,gl_FragCoord.xy);
    g = g* drawLine(vec2(500.,50.),vec2(280.,600.),60.,gl_FragCoord.xy);
    g = g* drawLine(vec2(120.,200.),vec2(450.,200.1),40.,gl_FragCoord.xy);

    // g=drawLine(vec2(20.,200.),vec2(30.,200.),60.,gl_FragCoord.xy);



    rgb=vec3(g,g,g);

    gl_FragColor = vec4(rgb, 1.0);
}
