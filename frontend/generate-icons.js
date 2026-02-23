/**
 * Icon Generation Script
 * Converts SVG icons to PNG format
 * 
 * Usage: node generate-icons.js
 * 
 * Prerequisites:
 * npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'assets', 'images');

// Icon configurations: { svg, output, width, height }
const icons = [
  {
    svg: path.join(iconsDir, 'icon.svg'),
    output: path.join(iconsDir, 'icon.png'),
    width: 1024,
    height: 1024,
  },
  {
    svg: path.join(iconsDir, 'android-icon-foreground.svg'),
    output: path.join(iconsDir, 'android-icon-foreground.png'),
    width: 512,
    height: 512,
  },
  {
    svg: path.join(iconsDir, 'android-icon-background.svg'),
    output: path.join(iconsDir, 'android-icon-background.png'),
    width: 512,
    height: 512,
  },
  {
    svg: path.join(iconsDir, 'android-icon-monochrome.svg'),
    output: path.join(iconsDir, 'android-icon-monochrome.png'),
    width: 512,
    height: 512,
  },
  {
    svg: path.join(iconsDir, 'favicon.svg'),
    output: path.join(iconsDir, 'favicon.png'),
    width: 192,
    height: 192,
  },
  {
    svg: path.join(iconsDir, 'icon.svg'),
    output: path.join(iconsDir, 'splash-icon.png'),
    width: 200,
    height: 200,
  },
];

async function generateIcons() {
  console.log('🎨 Starting icon generation...\n');

  for (const icon of icons) {
    try {
      // Check if SVG exists
      if (!fs.existsSync(icon.svg)) {
        console.warn(`⚠️  SVG not found: ${icon.svg}`);
        continue;
      }

      // Read SVG and convert to PNG
      await sharp(icon.svg)
        .resize(icon.width, icon.height, {
          fit: 'contain',
          background: { r: 15, g: 23, b: 42, alpha: 1 },
        })
        .png()
        .toFile(icon.output);

      console.log(`✅ Generated: ${path.basename(icon.output)} (${icon.width}x${icon.height})`);
    } catch (error) {
      console.error(`❌ Error generating ${icon.output}:`, error.message);
    }
  }

  console.log('\n✨ Icon generation complete!');
}

// Run if executed directly
if (require.main === module) {
  generateIcons().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateIcons };
