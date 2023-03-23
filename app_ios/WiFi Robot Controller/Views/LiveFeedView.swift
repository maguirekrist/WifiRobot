//
//  LiveFeedView.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/16/23.
//

import Foundation
import SwiftUI

//This represents the streamed feedback part of the application
struct LiveFeedView: View {
    
    var body: some View {
                VStack {
                    MetalView()
                        .frame(height: 300)
//                    WifiListView()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .edgesIgnoringSafeArea(.top)
    }
}
