# BangoBongo Shopify Theme

A custom Shopify theme for the BangoBongo music platform.

## Features

- Modern, responsive design optimized for music and merchandise
- Clean typography and professional layout
- Mobile-first approach
- Accessible design following WCAG guidelines
- Optimized for performance
- Easy customization through theme settings

## Installation

### Method 1: GitHub Integration (Recommended)

1. **Connect GitHub to Shopify**:
   - Go to your Shopify admin: `admin.shopify.com/store/bangobongo-music/themes`
   - Click "Add theme" → "Connect from GitHub"
   - Authorize GitHub access to your Shopify store

2. **Select Repository and Branch**:
   - Repository: `elicharlese/bangobongo`
   - Branch: `main`
   - Path: `shopify-theme/` (this ensures only the theme files are synced)

3. **Auto-sync Setup**:
   - Enable auto-sync to automatically deploy changes when you push to the main branch
   - This allows for continuous deployment of theme updates

### Method 2: Manual Upload

1. **Zip the Theme**:
   ```bash
   cd shopify-theme
   zip -r bangobongo-theme.zip . -x "*.git*" "*.DS_Store*" "node_modules/*"
   ```

2. **Upload to Shopify**:
   - Go to Online Store → Themes in your Shopify admin
   - Click "Add theme" → "Upload zip file"
   - Select the `bangobongo-theme.zip` file

### Method 3: Shopify CLI (Development)

1. **Install Shopify CLI**:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Connect and Deploy**:
   ```bash
   cd shopify-theme
   shopify theme dev --store=bangobongo-music
   ```

## Theme Structure

```
shopify-theme/
├── assets/           # CSS, JS, and other static files
│   ├── base.css     # Main stylesheet
│   ├── global.js    # Theme JavaScript
│   └── ...
├── config/          # Theme settings and configuration
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/          # Theme layout files
│   └── theme.liquid # Main layout template
├── locales/         # Translation files
│   └── en.default.json
├── sections/        # Reusable theme sections
├── snippets/        # Reusable code snippets
└── templates/       # Page templates
    ├── index.liquid      # Homepage
    ├── product.liquid    # Product pages
    └── collection.liquid # Collection pages
```

## Customization

### Theme Settings

Access theme settings in your Shopify admin:
- Online Store → Themes → Customize
- Modify colors, typography, layout options
- Configure social media links
- Set up navigation menus

### Code Customization

1. **Colors**: Edit CSS variables in `assets/base.css`
2. **Typography**: Update font settings in `config/settings_schema.json`
3. **Layout**: Modify `layout/theme.liquid` for overall structure
4. **Product Pages**: Customize `templates/product.liquid`

### Adding Sections

Create new sections in the `sections/` directory:

```liquid
{% comment %}
  Custom section example
{% endcomment %}

<section class="custom-section">
  <div class="page-width">
    <h2>{{ section.settings.heading }}</h2>
    <p>{{ section.settings.text }}</p>
  </div>
</section>

{% schema %}
{
  "name": "Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Custom Section"
    },
    {
      "type": "textarea",
      "id": "text",
      "label": "Text",
      "default": "Add your content here"
    }
  ],
  "presets": [
    {
      "name": "Custom Section"
    }
  ]
}
{% endschema %}
```

## GitHub Integration Setup

### Why GitHub Integration Fails

The error "Branch isn't a valid theme" typically occurs when:

1. **Missing required files**: Shopify requires specific files to recognize a valid theme
2. **Incorrect directory structure**: Theme files must be in the repository root or specified path
3. **Invalid Liquid syntax**: Syntax errors prevent theme validation

### Fixed in This Theme

✅ **Complete file structure**: All required Shopify theme files included
✅ **Valid Liquid templates**: Proper syntax and structure
✅ **Proper schema definitions**: Valid JSON schema for theme settings
✅ **Essential assets**: CSS, JavaScript, and configuration files

### Connecting to GitHub

1. **Repository Structure**: 
   - Theme files are in `/shopify-theme/` directory
   - Specify this path when connecting to GitHub

2. **Branch Selection**:
   - Use `main` branch (or your preferred branch)
   - Ensure the branch contains the complete theme structure

3. **Auto-sync Benefits**:
   - Automatic deployment on git push
   - Version control for theme changes
   - Collaborative development workflow
   - Easy rollback to previous versions

### Troubleshooting

**If GitHub connection still fails:**

1. **Check file permissions**: Ensure repository is public or Shopify has access
2. **Verify file structure**: All required files present and valid
3. **Test locally**: Use Shopify CLI to validate theme locally first
4. **Manual upload**: Use zip upload method as fallback

**Common issues:**
- Missing `layout/theme.liquid` file
- Invalid JSON in `config/` files
- Liquid syntax errors in templates
- Incomplete `assets/` directory

## Development Workflow

### Local Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/elicharlese/bangobongo.git
   cd bangobongo/shopify-theme
   ```

2. **Start development server**:
   ```bash
   shopify theme dev --store=bangobongo-music
   ```

3. **Make changes and test locally**

4. **Deploy to production**:
   ```bash
   git add .
   git commit -m "Update theme"
   git push origin main
   ```

### Production Deployment

With GitHub integration enabled:
- Changes pushed to `main` branch automatically deploy
- Use pull requests for code review before deployment
- Tag releases for version management

## Support

For theme support and customization:
- Create issues in the GitHub repository
- Refer to [Shopify theme documentation](https://shopify.dev/themes)
- Check [Liquid template language guide](https://shopify.github.io/liquid/)

## License

This theme is part of the BangoBongo music platform and follows the project's licensing terms.
