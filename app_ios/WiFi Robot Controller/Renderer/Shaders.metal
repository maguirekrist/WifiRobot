//
//  Shaders.metal
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/11/23.
//

#include <metal_stdlib>
using namespace metal;

#include "definitions.h"

struct Fragment {
    float4 position [[position]];
    float2 texCoord;
};

vertex Fragment vertexShader(const device Vertex *vertexArray[[buffer(0)]], unsigned int vid [[vertex_id]]) {
    Vertex input = vertexArray[vid];
    
    Fragment output;
    output.position = float4(input.position.x, input.position.y, 0, 1);
    output.texCoord = input.texCoord;
    
    return output;
}

fragment float4 fragmentShader(Fragment input [[stage_in]], texture2d<uint> texture [[texture(0)]]) {
    constexpr sampler textureSampler(mag_filter::linear, min_filter::linear);
    
    uint4 pixelValue = texture.sample(textureSampler, input.texCoord);
    float colorValue = pixelValue.r / 255.0;
    
    return float4(colorValue, colorValue, colorValue, 1.0);
}
