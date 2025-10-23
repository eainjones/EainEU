const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Directories
const contentDir = './content';
const postsDir = './content/posts';
const publicDir = './public';
const templatePath = './template.html';

// Ensure directories exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
}

// Read template
const template = fs.readFileSync(templatePath, 'utf-8');

// Simple template engine
function render(template, data) {
    let result = template;

    // Replace simple {{variable}} patterns
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key] || '');
    });

    // Handle conditional {{#if subtitle}}...{{/if}}
    result = result.replace(/{{#if subtitle}}[\s\S]*?{{\/if}}/g, (match) => {
        return data.subtitle ? match.replace(/{{#if subtitle}}|{{\/if}}/g, '') : '';
    });

    return result;
}

// Get all markdown files (non-recursive, for pages)
function getMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Content directory '${dir}' not found. Creating with default files...`);
        return [];
    }

    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.md') && fs.statSync(path.join(dir, file)).isFile());
}

// Get all posts with metadata
function getAllPosts() {
    if (!fs.existsSync(postsDir)) {
        return [];
    }

    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    const posts = [];

    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { frontMatter, content } = parseFrontMatter(fileContent);
        const stats = fs.statSync(filePath);

        posts.push({
            filename: file,
            slug: file.replace('.md', ''),
            title: frontMatter.title || file.replace('.md', ''),
            date: frontMatter.date || stats.mtime.toISOString().split('T')[0],
            description: frontMatter.description || '',
            frontMatter,
            content
        });
    });

    // Sort by date, newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return posts;
}

// Generate post list HTML
function generatePostList(posts) {
    if (posts.length === 0) {
        return '<p>No posts yet. Add markdown files to <code>content/posts/</code> to get started!</p>';
    }

    let html = '<div class="post-list">';
    posts.forEach(post => {
        html += `
        <article class="post-preview">
            <h3><a href="posts/${post.slug}.html">${post.title}</a></h3>
            <time class="post-date">${post.date}</time>
            ${post.description ? `<p>${post.description}</p>` : ''}
        </article>`;
    });
    html += '</div>';
    return html;
}

// Parse front matter from markdown
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        return {
            frontMatter: {},
            content: content
        };
    }

    const frontMatterText = match[1];
    const markdownContent = match[2];

    const frontMatter = {};
    frontMatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            frontMatter[key.trim()] = valueParts.join(':').trim();
        }
    });

    return {
        frontMatter,
        content: markdownContent
    };
}

// Build the site
function build() {
    console.log('Building site...');

    let totalPages = 0;

    // Get all posts first
    const posts = getAllPosts();
    console.log(`Found ${posts.length} posts`);

    // Create posts directory in public
    const publicPostsDir = path.join(publicDir, 'posts');
    if (!fs.existsSync(publicPostsDir)) {
        fs.mkdirSync(publicPostsDir, { recursive: true });
    }

    // Build individual post pages
    posts.forEach(post => {
        const htmlContent = marked(post.content);
        const outputPath = path.join(publicPostsDir, `${post.slug}.html`);

        const pageData = {
            title: post.title,
            subtitle: post.date,
            description: post.description,
            content: htmlContent,
            year: new Date().getFullYear()
        };

        const html = render(template, pageData);
        fs.writeFileSync(outputPath, html);
        console.log(`✓ Built posts/${post.slug}.html`);
        totalPages++;
    });

    // Build regular pages from content/
    const mdFiles = getMarkdownFiles(contentDir);

    mdFiles.forEach(file => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const { frontMatter, content } = parseFrontMatter(fileContent);

        // Special handling for index page - inject post list
        let htmlContent = marked(content);
        if (file === 'index.md') {
            const postListHtml = generatePostList(posts);
            htmlContent += '\n<h2>Recent Posts</h2>\n' + postListHtml;
        }

        const outputFileName = file.replace('.md', '.html');
        const outputPath = path.join(publicDir, outputFileName);

        const pageData = {
            title: frontMatter.title || 'Untitled',
            subtitle: frontMatter.subtitle || '',
            description: frontMatter.description || '',
            content: htmlContent,
            year: new Date().getFullYear()
        };

        const html = render(template, pageData);
        fs.writeFileSync(outputPath, html);

        console.log(`✓ Built ${outputFileName}`);
        totalPages++;
    });

    console.log(`\n✨ Build complete! ${totalPages} pages generated (${posts.length} posts, ${mdFiles.length} pages)`);
}

build();
