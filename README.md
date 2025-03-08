# Interactive 3D Bio

An immersive 3D bio featuring two dynamic scenes: a serene countryside environment and an interactive solar system. Built with Three.js, this project showcases both natural beauty and astronomical accuracy.

## Features

### Space Scene

#### Solar System
- Realistic sun with shader-based glow effects
- Detailed planets with proper:
  - Relative sizes and distances
  - Orbital speeds and paths
  - Axial tilts
  - Surface textures and materials
  - Saturn's rings
- Interactive UFO that:
  - Spins on its axis
  - Bounces when clicked
  - Emits dynamic lighting

#### Visual Effects
- Dynamic star field (20,000 stars) with:
  - Varying colors (white to blue-ish tints)
  - Slow rotation effect
  - Proper 3D distribution
- Custom sun shader with pulsing glow
- Proper lighting and shadows

### Earth Scene

#### Lake and Houses
- Centered lake with reflective water surface
- Two cozy houses with:
  - Detailed architecture
  - Front doors and windows
  - Chimneys
  - Proper materials and lighting

#### Dynamic Nature Elements
- **Trees (80)**:
  - Smart positioning system
  - Avoids overlapping with houses, lake, and other trees
  - Natural multi-axis swaying animation
  - Individual branch movements

- **Grass Patches (1000)**:
  - Multi-axis blade movement
  - Random sway speeds and amounts
  - Color variations for realism
  - Natural wind response

- **Butterflies**:
  - Smooth flying patterns
  - Wing flapping animations
  - Random flight paths and heights

#### Environmental Effects
- Ambient and directional lighting
- Dynamic shadows
- Wind simulation affecting vegetation
- Proper object shadows and reflections

## Technical Implementation

### Core Technologies
- **Three.js**: Main 3D rendering engine
- **JavaScript**: Core programming language
- **HTML5 Canvas**: Rendering context

### Key Components

#### Scene Management
- **SpaceScene** (`js/scenes/spaceScene.js`):
  - Solar system simulation
  - Interactive UFO controls
  - Custom shader effects
  - Efficient star field rendering

- **EarthScene** (`js/scenes/earthScene.js`):
  - Countryside environment
  - Natural animation systems
  - Physics-based wind effects
  - Optimized vegetation rendering

#### Performance Optimizations
- Efficient geometry instancing
- Shader-based effects
- Smart asset loading
- Memory management
- Scene-specific optimizations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Use mouse/touch controls to explore the scenes:
   - Left click + drag: Rotate camera
   - Right click + drag: Pan camera
   - Scroll: Zoom in/out
   - Use the scene buttons to manually switch between Earth and Space scenes

## Browser Support
- Modern browsers with WebGL support
- Responsive design for different screen sizes

## Mobile Version
A dedicated mobile version is available with:
- Optimized layout for smaller screens
- Responsive design for both portrait and landscape orientations
- Touch-friendly interface
- Same immersive 3D experience as desktop version

## Social Links
- GitHub: https://github.com/Ghostrayu
- Flickr: https://www.flickr.com/photos/iranrayu/
- SoundCloud: https://soundcloud.com/ghostrayu
- Tune.FM: https://tune.fm/@GhostRayu/music
- YouTube: https://www.youtube.com/channel/UCXPxIHvf7T81Z_nr-W2fklQ
- GMC: https://www.goodmoneycollective.com

## Contributing
Feel free to submit issues and enhancement requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits
WWW.GOODMONEYCOLLECTIVE.COM
