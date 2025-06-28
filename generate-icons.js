const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Android icon sizes
const androidSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// iOS icon sizes (base size and scale)
const iosSizes = [
  { size: 20, scale: 1 },
  { size: 20, scale: 2 },
  { size: 20, scale: 3 },
  { size: 29, scale: 1 },
  { size: 29, scale: 2 },
  { size: 29, scale: 3 },
  { size: 40, scale: 1 },
  { size: 40, scale: 2 },
  { size: 40, scale: 3 },
  { size: 60, scale: 2 },
  { size: 60, scale: 3 },
  { size: 1024, scale: 1 }
];

async function generateAndroidIcons() {
  console.log('Generating Android icons...');
  
  for (const [folder, size] of Object.entries(androidSizes)) {
    const outputDir = path.join('android', 'app', 'src', 'main', 'res', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate regular launcher icon
    await sharp('assets/icons.png')
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, 'ic_launcher.png'));
    
    // Generate round launcher icon (same image)
    await sharp('assets/icons.png')
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_round.png'));
    
    console.log(`✓ Generated ${folder} icons (${size}x${size})`);
  }
}

async function generateIOSIcons() {
  console.log('Generating iOS icons...');
  
  const outputDir = path.join('ios', 'Weather', 'Images.xcassets', 'AppIcon.appiconset');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const contentsJson = {
    images: [],
    info: {
      author: 'xcode',
      version: 1
    }
  };
  
  for (const { size, scale } of iosSizes) {
    const actualSize = size * scale;
    let filename, idiom, sizeStr, scaleStr;
    
    if (size === 1024) {
      filename = 'AppIcon-1024.png';
      idiom = 'ios-marketing';
      sizeStr = '1024x1024';
      scaleStr = '1x';
    } else {
      filename = `AppIcon-${size}@${scale}x.png`;
      idiom = 'iphone';
      sizeStr = `${size}x${size}`;
      scaleStr = `${scale}x`;
    }
    
    // Generate icon
    await sharp('assets/icons.png')
      .resize(actualSize, actualSize)
      .png()
      .toFile(path.join(outputDir, filename));
    
    // Add to Contents.json
    contentsJson.images.push({
      filename: filename,
      idiom: idiom,
      scale: scaleStr,
      size: sizeStr
    });
    
    console.log(`✓ Generated ${filename} (${actualSize}x${actualSize})`);
  }
  
  // Write Contents.json
  fs.writeFileSync(
    path.join(outputDir, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );
  
  console.log('✓ Generated Contents.json');
}

async function main() {
  try {
    console.log('🎨 Starting icon generation from assets/icons.png...');
    console.log('=' * 50);
    
    // Check if source image exists
    if (!fs.existsSync('assets/icons.png')) {
      console.error('❌ Source image assets/icons.png not found!');
      process.exit(1);
    }
    
    await generateAndroidIcons();
    console.log('');
    await generateIOSIcons();
    
    console.log('');
    console.log('=' * 50);
    console.log('✅ Icon generation complete!');
    console.log('💡 Remember to clean and rebuild your project.');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

main();
