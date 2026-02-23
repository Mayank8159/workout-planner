# Professional App Icons for WorkoutPlanner

## Overview

Professional app icons have been created for your Workout Planner app with a modern glassmorphism design system. The icons feature:

- **Dumbbell Design**: Fitness-focused icon representing strength and exercise
- **Gradient Colors**: Purple (#a78bfa → #6d28d9) and Blue (#3b82f6 → #1e40af) gradients
- **Dark Theme**: Matching the app's dark mode aesthetic (#0f172a slate background)
- **Professional Style**: Glassmorphism effects with glows and accent details

## Icon Variants

The following icon files have been created (SVG format):

1. **icon.svg** - Main app icon (1024x1024)
2. **android-icon-foreground.svg** - Android adaptive icon foreground (512x512)
3. **android-icon-background.svg** - Android adaptive icon background (512x512)
4. **android-icon-monochrome.svg** - Android monochrome icon for widgets (512x512)
5. **favicon.svg** - Web favicon (192x192)

## Converting SVG to PNG

To generate PNG files from the SVG icons, run:

```bash
npm run generate-icons
```

This command will:
1. Install `sharp` (image processing library) if not already installed
2. Convert all SVG icons to PNG format with proper dimensions
3. Generate files in `assets/images/` directory

### Manual Conversion (Alternative)

If you prefer to convert manually, you can use:

**Online Tools:**
- https://cloudconvert.com/ - Upload SVG, convert to PNG
- https://ezgif.com/image-to-png - Quick online converter
- https://convertio.co/svg-png/ - Browser-based converter

**Command Line (requires imagemagick):**
```bash
# Install on Windows: choco install imagemagick
# Install on macOS: brew install imagemagick
# Then run:
convert -background '#0f172a' -density 300 icon.svg -flatten icon.png
```

## Generated PNG Files

After running the generation script, the following PNG files will be created:

- `icon.png` (1024x1024) - iOS app icon
- `android-icon-foreground.png` (512x512) - Android adaptive foreground
- `android-icon-background.png` (512x512) - Android adaptive background
- `android-icon-monochrome.png` (512x512) - Android widget icon
- `favicon.png` (192x192) - Web favicon
- `splash-icon.png` (200x200) - Splash screen icon

## Design Details

### Color Scheme
- **Primary Gradient**: Purple to Deep Purple (`#a78bfa` → `#6d28d9`)
- **Secondary Gradient**: Blue to Dark Blue (`#3b82f6` → `#1e40af`)
- **Background**: Dark Slate (`#0f172a`)
- **Accent**: Light Purple (`#a78bfa`)

### Design Elements
- Left dumbbell plate with gradient fill and border accent
- Center bar with gradient and detail lines
- Right dumbbell plate matching left side
- Shadow and glow effects for depth
- Corner accent lines for modern touch

### Usage
The PNG files have already been referenced in `app.json`:
- iOS uses `icon.png`
- Android uses adaptive icons (foreground/background)
- Web uses `favicon.png`
- Splash screen uses `splash-icon.png`

## Next Steps

1. Run `npm run generate-icons` to create all PNG files
2. Test the app on iOS/Android devices to verify icons display correctly
3. The icons will automatically appear in app stores and on device home screens

## Notes

- SVG files are preserved for future editing/modifications
- PNG files can be regenerated anytime by running `npm run generate-icons`
- All icons maintain the Workout Planner brand consistency
- Supports both light and dark themed Android launchers
