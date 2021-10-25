precision highp float;
attribute vec4 aVertexPosition;

attribute vec2 a_texture_coord;
varying highp vec2 v_texture_coord;
// v_texture_coord=a_texture_coord;

void main(void){
    gl_Position = aVertexPosition;
    v_texture_coord=a_texture_coord;
}
