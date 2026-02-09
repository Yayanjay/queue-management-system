# Tailwind CSS v4 Configuration Notes

This project uses **Tailwind CSS v4**, which has significant changes from v3.x.

## Key Differences from v3.x

### 1. PostCSS Plugin Package
- **v3**: Used `tailwindcss` directly as PostCSS plugin
- **v4**: Uses separate `@tailwindcss/postcss` package

### 2. CSS Import Syntax
- **v3**: 
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- **v4**: 
  ```css
  @import "tailwindcss";
  ```

### 3. Configuration File
- **v3**: Used `tailwind.config.js` (JavaScript)
- **v4**: CSS-based configuration (no config file needed for basic setup)
- **v4**: Content paths are auto-detected from your project structure

## Current Configuration

### postcss.config.js
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### main.css
```css
@import "tailwindcss";

/* Your custom CSS here */
```

## Custom Utilities

The project includes custom utility classes defined in `src/assets/main.css`:

```css
@layer utilities {
  .btn { /* Button base styles */ }
  .btn-primary { /* Primary button */ }
  .btn-secondary { /* Secondary button */ }
  .btn-success { /* Success button */ }
  .btn-danger { /* Danger button */ }
  .btn-lg { /* Large button */ }
  .card { /* Card component */ }
}
```

## Installing Tailwind v4 in New Projects

If starting fresh or adding to another project:

```bash
npm install tailwindcss@latest @tailwindcss/postcss
```

## Migration from v3 to v4

If you need to migrate an existing v3 project:

1. Install new package:
   ```bash
   npm install @tailwindcss/postcss
   ```

2. Update `postcss.config.js`:
   ```diff
   - tailwindcss: {},
   + '@tailwindcss/postcss': {},
   ```

3. Update CSS imports:
   ```diff
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
   ```

4. Remove `tailwind.config.js` (optional, for basic setups)

## Documentation

- Tailwind v4 Docs: https://tailwindcss.com/docs
- v4 Migration Guide: https://tailwindcss.com/docs/upgrade-guide

## Troubleshooting

### Error: "tailwindcss directly as a PostCSS plugin"
- **Cause**: Using v4 with v3 configuration
- **Fix**: Install `@tailwindcss/postcss` and update config (see above)

### Styles not applying
- **Check**: CSS import is `@import "tailwindcss"` not `@tailwind`
- **Check**: `@tailwindcss/postcss` is in postcss.config.js
- **Try**: Clear Vite cache and restart dev server

### Custom @apply directives not working
- **Check**: Custom classes are inside `@layer utilities` or `@layer components`
- **Try**: Restart dev server after adding new custom utilities
