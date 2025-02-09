# Interactive 3D Bio

An immersive 3D bio featuring two dynamic scenes: a serene countryside environment and an interactive solar system. Built with Three.js, this project showcases both natural beauty and astronomical accuracy.

## Features

### Space Scene

#### Solar System
- Accurate representation of our solar system
- Sun with dynamic glow effects and rotation
- All eight planets with proper:
  - Relative sizes and distances
  - Orbital speeds and paths
  - Axial tilts
  - Surface colors and textures
  - Visible orbit paths for each planet

#### Visual Effects
- Dynamic star field (3000+ stars)
- Stars with varying:
  - Sizes (0.1 to 0.3 units)
  - Colors (white, warm, and cool tones)
  - Twinkle animations
- Sun glow with multiple layers
- Proper lighting and shadows

### Earth Scene

#### Lake and Houses
- Centered lake with reflective water surface
- Two cozy houses
- Each house features:
  - Simple body (6x5x4)
  - Cone-shaped roof
  - Front door and windows
  - Chimney
- Small rowboat on the lake with:
  - Wooden hull and sides
  - Three bench seats
  - Two oars with metal fittings
  - Decorative trim and details

#### Dynamic Nature Elements
- **Trees (80)**:
  - Randomly placed with smart positioning
  - Avoid overlapping with houses, lake, and other trees
  - Gentle swaying animation in the wind

- **Grass Patches (1000)**:
  - Individually animated blades
  - Color variations for realistic appearance
  - Dynamic wind response

- **Butterflies (30)**:
  - Smooth flying patterns
  - Wing flapping animations
  - Random flight paths and heights

- **Floating Leaves (50)**:
  - Falling and spinning animations
  - Automatic respawning when reaching ground
  - Natural floating patterns

#### Environmental Effects
- Day/night cycle with dynamic lighting
- Ambient and directional lighting
- Wind effects on vegetation
- Proper object shadows and reflections

## Technical Implementation

### Core Technologies
- **Three.js**: Main 3D rendering engine
- **JavaScript**: Core programming language
- **HTML5 Canvas**: Rendering context

### Key Components

#### Scene Management
- **SpaceScene** (`js/scenes/spaceScene.js`):
  - Solar system setup and management
  - Planetary orbits and rotations
  - Star field generation and animation
  - Lighting and space effects

- **EarthScene** (`js/scenes/earthScene.js`):
  - Countryside environment setup
  - Object creation and placement
  - Nature animation systems
  - Environmental lighting

#### Scene Transitions
- Smooth transitions between scenes
- Automatic scene switching every 6 seconds
- Manual scene selection via UI controls
- Camera position interpolation

#### Main Application (`js/main.js`)
- Application initialization
- Event handling
- Scene loading and management
- Camera and control setup

### Animation Systems
- **Space Animations**:
  - Planetary orbits and rotations
  - Star twinkling effects
  - Sun pulsing and rotation
  
- **Earth Animations**:
  - Tree and grass movement
  - Butterfly flight patterns
  - Leaf falling physics
  - Day/night cycle

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

## Performance Considerations
- Optimized geometry and material sharing
- Efficient animation systems
- Smart object culling
- Balanced number of animated elements
- Proper use of Three.js best practices

## Browser Compatibility
- Chrome (Recommended)
- Firefox
- Safari
- Edge

## Contributing
Feel free to submit issues and enhancement requests.

## License
ISC License - see LICENSE file for details
