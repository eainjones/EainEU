# Eain.EU Personal Website

A minimal, fast-loading personal website inspired by Anthropic's design guidelines. Built for easy content updates through markdown files.

## Features

- **Minimal & Fast** - Clean design with minimal dependencies
- **Markdown-Based** - Write content in simple markdown files
- **Auto-Deploy** - Push to GitHub and your site updates automatically
- **Anthropic-Inspired** - Warm color palette, generous spacing, clean typography
- **GitHub Pages** - Free, fast, and reliable hosting

## Project Structure

```
.
├── content/           # Your markdown content files
│   ├── index.md      # Home page
│   └── about.md      # About page
├── public/            # Generated site (auto-created)
├── template.html      # HTML template
├── build.js           # Build script
└── package.json       # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Git

### Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the site:
   ```bash
   npm run build
   ```
4. Preview locally:
   ```bash
   npm run dev
   ```
   Then open http://localhost:8000

### Adding Content

1. Create or edit markdown files in the `content/` directory
2. Add front matter at the top of each file:
   ```markdown
   ---
   title: Your Page Title
   subtitle: Optional subtitle
   description: Page description for SEO
   ---

   Your content here...
   ```
3. Commit and push to GitHub
4. Your site will automatically rebuild and deploy!

## Deployment

The site automatically deploys to GitHub Pages when you push to the main branch.

### Setup GitHub Pages (First Time)

1. Go to your repository settings
2. Navigate to **Pages** (under "Code and automation")
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Push to main branch - your site will deploy automatically!

Your site will be available at: `https://[username].github.io/[repository-name]/`

For a custom domain (like eain.eu):
1. Add a `CNAME` file in the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Enable custom domain in GitHub Pages settings

## Customization

### Colors

Edit the CSS variables in `template.html`:

```css
:root {
    --primary: #CC785C;        /* Main accent color */
    --background: #FAF7F5;     /* Page background */
    --text: #1A1A1A;          /* Main text color */
    /* ... */
}
```

### Navigation

Edit the navigation section in `template.html` to add/remove pages.

### Content

Simply edit markdown files in `content/` - that's it!

## Design Philosophy

This site embraces:
- **Minimalism** - Only what's necessary
- **Performance** - Fast loading, minimal JavaScript
- **Accessibility** - Clean, readable design
- **Simplicity** - Easy to maintain and update

## Technology Stack

- **Marked.js** - Markdown parsing
- **Node.js** - Build system
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting

No frameworks, no build complexity - just simple, fast, and effective.

## License

Feel free to use this template for your own site!
