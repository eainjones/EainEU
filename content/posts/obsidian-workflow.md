---
title: Setting Up Your Obsidian Workflow
date: 2025-10-23
description: How to configure Obsidian for seamless blogging with this site
---

If you're using [Obsidian](https://obsidian.md) for writing, here's how to set it up for seamless blogging:

## Setup Steps

### 1. Open Your Repository as a Vault

In Obsidian:
- Click "Open folder as vault"
- Select your `EainEU` repository folder

### 2. Create Your Writing Space

Navigate to `content/posts/` in your vault. This is where all your blog posts will live.

### 3. Use This Template

Create each new post with this front matter:

```markdown
---
title: Your Post Title
date: 2025-10-23
description: A short description for SEO and post previews
---

Your content here...
```

### 4. Obsidian Git Plugin (Optional but Recommended)

Install the **Obsidian Git** plugin to push directly from Obsidian:

1. Settings → Community plugins
2. Browse and install "Obsidian Git"
3. Configure it to auto-commit and push

Now you can write and publish without ever leaving Obsidian!

## File Naming

Name your files descriptively:
- `my-first-post.md` → becomes `/posts/my-first-post.html`
- Use hyphens, not spaces
- Keep it URL-friendly

## Tips

- **Drafts**: Keep draft posts outside the `content/posts/` directory until ready to publish
- **Images**: Store in `content/posts/images/` (you'll need to add image handling to the build script)
- **Links**: Use relative links between posts

Happy writing!
