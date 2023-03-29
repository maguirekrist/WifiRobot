//
//  MetalViewController.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/23/23.
//

import Foundation
import UIKit

class MetalViewController {
    var viewMatrix: matrix_float4x4
    public var lastTranslation: SIMD2<Float>?
    public var lastScaleFactor: Float?
        
    
    init() {
        self.viewMatrix = MakeScaleMatrix(xScale: 1, yScale: 1)
    }

    func scaleView(_ factor: Float) {
        self.viewMatrix = MakeScaleMatrix(xScale: factor, yScale: factor);
        print(self.viewMatrix)
    }
    
    func translateView2d(_ translate: SIMD2<Float>)
    {
        self.viewMatrix[3, 0] = translate.x
        self.viewMatrix[3, 1] = translate.y
        print(self.viewMatrix)
    }
    
}
