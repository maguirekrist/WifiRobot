//
//  MetalView.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/11/23.
//

import Foundation
import MetalKit
import SwiftUI

struct MetalView: UIViewRepresentable {
    @ObservedObject var mapModel = GridProvider()
    
    init() {
        print("Metal View initialized!")
    }
    
    func makeCoordinator() -> Renderer {
        return Renderer(self)
    }
    
    func makeUIView(context: Context) -> MTKView {
        let metalView = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())
        metalView.delegate = context.coordinator
        metalView.clearColor = MTLClearColor(red: 0.0, green: 0.5, blue: 0.0, alpha: 1.0)
        return metalView
    }
    
    func updateUIView(_ uiView: MTKView, context: Context) {
        
    }
}
