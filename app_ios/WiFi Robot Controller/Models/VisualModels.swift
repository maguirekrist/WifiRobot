//
//  VisualModels.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/13/23.
//

import Foundation

struct OccupancyGrid: Codable {
    var width: Int
    var height: Int
    var data: [UInt8]
}

struct Vector3D: Hashable, Codable {
    var x: Int
    var y: Int
    var z: Int
}