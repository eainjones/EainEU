const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Directories
const contentDir = './content';
const publicDir = './public';
const templatePath = './template.html';

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
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

// Get all markdown files
function getMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Content directory '${dir}' not found. Creating with default files...`);
        return [];
    }

    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.md'));
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

    const mdFiles = getMarkdownFiles(contentDir);

    if (mdFiles.length === 0) {
        console.log('No markdown files found. Site will be empty.');
    }

    mdFiles.forEach(file => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const { frontMatter, content } = parseFrontMatter(fileContent);
        const htmlContent = marked(content);

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
    });

    console.log(`\nBuild complete! ${mdFiles.length} pages generated in ${publicDir}/`);
}

build();
