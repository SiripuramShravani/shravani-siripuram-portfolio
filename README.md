# 🚀 Shravani Siripuram - Portfolio Website

A clean, modern, professional portfolio website showcasing the work of Shravani Siripuram - SAP Consultant & AI Engineer.

## ✏️ Editing Content — content.md

**All page content lives in [`content.md`](content.md).** You never need to touch `index.html`, `styles.css`, or
`script.js` to update your bio, experience, projects, skills, education, awards, or contact details — just edit
`content.md` and reload the page. `script.js` fetches it, parses it, and renders every section automatically.

The file is organized into `# SECTION` blocks (SITE, HERO, ACHIEVEMENTS, ABOUT, SKILLS, EXPERIENCE, PROJECTS,
LINKEDIN, EDUCATION, AWARDS, CONTACT). A few conventions to know when editing:

- `Key: value` lines set simple fields (e.g. `Email: you@example.com`).
- `## Heading | extra | info` starts a new entry inside a section (an experience role, a project, a skill category,
  an award, etc.). The parts after `|` vary by section — follow the existing examples for that section.
- Lines starting with `- ` are bullet points (responsibilities, contributions).
- In the EXPERIENCE section, a lone `---` line marks where the bullets below it become the collapsed "View Details"
  items instead of always-visible ones.
- `Tech: A, B, C` (comma-separated) becomes the tech-tag pills on experience/project cards.
- `**bold text**` inside paragraphs/bullets renders as bold.

Because content is fetched with JavaScript, **the site must be served over http(s)**, not opened directly as a
`file://` path — see [Local Testing](#-local-testing) below. If `content.md` fails to load, the page shows a banner
explaining this. GitHub Pages (the deployment target here) serves it correctly out of the box.

## ✨ Features

### Design & Aesthetics
- **Professional, Light Theme**: Clean slate/white surfaces with a confident blue + teal accent system
- **Content-Driven**: Every section renders from `content.md` — no code edits needed for content changes
- **Smooth Animations**: Fade-in, reveal-on-scroll, count-up, and hover effects (respects reduced-motion)
- **Consistent Card System**: Skills, experience, projects, awards, and LinkedIn cards all share one visual language
- **Subtle Gradient Accents**: Soft radial gradients and gradient text for a modern, professional feel

### Sections
1. **Navigation Bar** - Fixed top navigation with blur effect
2. **Hero Section** - Animated greeting, title, and profile photo
3. **Achievement Counters** - Animated statistics with count-up effect
4. **About Me** - Professional summary with highlighted achievements
5. **Technical Skills** - Interactive skill cards with animated progress bars
6. **Professional Experience** - Timeline layout with detailed achievements
7. **Featured Projects** - Showcase of major projects with impact metrics
8. **LinkedIn Highlights** - Featured posts and achievements
9. **Education & Awards** - Academic background and recognitions
10. **Call-to-Action** - Download resume and schedule call buttons
11. **Contact Section** - Interactive form with validation
12. **Footer** - Quick links and social media

### Interactive Features
- ✅ Smooth scroll navigation with active section highlighting
- ✅ Scroll progress indicator at the top
- ✅ Hamburger menu for mobile devices
- ✅ Animated counters (count up when scrolled into view)
- ✅ Skill bars that fill on scroll
- ✅ Typing animation for hero tagline
- ✅ Intersection Observer for scroll animations
- ✅ Form validation with success/error messages
- ✅ Back-to-top button (appears after scrolling)
- ✅ Ripple effect on buttons
- ✅ Hover effects on all interactive elements

### Responsive Design
- **Mobile First**: Optimized for 320px and up
- **Breakpoints**: 768px (tablet), 1024px (desktop), 1440px (large desktop)
- **Touch-Friendly**: Large tap targets for mobile
- **Adaptive Layouts**: Grid layouts that stack on mobile

### Accessibility
- Semantic HTML5 elements
- ARIA labels for screen readers
- Alt text for all images
- Keyboard navigation support
- Focus indicators
- WCAG AA color contrast compliance

## 📁 File Structure

```
portfolio/
├── index.html          # Container skeleton (rendered by content.md via script.js)
├── content.md           # ✏️ ALL page content — edit this, not the code
├── styles.css          # Complete CSS styling
├── script.js           # content.md parser/renderer + interactive features
├── README.md           # Documentation (this file)
└── assets/             # Profile & work photos
```

## 🎨 Color Palette

```css
Primary Blue:    #2563EB  (Brand, links, CTAs)
Primary Dark:    #1D4ED8  (Hover states)
Accent Teal:     #0D9488  (Secondary accent, gradients)
Deep Slate:      #0B1220  (Footer / CTA section background)
LinkedIn Blue:   #0A66C2  (LinkedIn elements)
Heading Text:    #0F172A  (Headings)
Body Text:       #475569  (Body copy)
Muted Text:      #94A3B8  (Meta / labels)
Surface:         #FFFFFF  (Cards)
Page Background: #F8FAFC  (Base background)
Amber Gold:      #D97706  (Awards, "Ongoing" badge)
```

## 🖼️ Updating Photos

Replace the files in `assets/` with new photos, keeping the same filenames (or update the `src` paths in the
Hero/About `<img>` tags in `index.html` if you rename them):

- `assets/shravani-pic.jpeg` — Hero section profile photo
- `assets/shravani-work.jpeg` — About section workspace photo

## 🔗 Update Links & Information

All of these live in the `# SITE` block at the top of **[`content.md`](content.md)** — edit the values there, no
HTML required:

```
Resume: https://drive.google.com/...
Email: you@example.com
LinkedIn: https://www.linkedin.com/in/your-profile
GitHub: https://github.com/your-username
Location: City, State, Country
```

### LinkedIn Post URLs
Each post lives under `# LINKEDIN` in `content.md` as its own `## Title | badgeType | badgeLabel` entry with a
`Link:` line — update that line with the real post URL.

**How to get a LinkedIn post URL:**
1. Go to your LinkedIn post
2. Click the three dots (⋯) on the post
3. Click "Copy link to post"
4. Paste it as the `Link:` value for that entry in `content.md`

## 🚀 Deployment

### Option 1: GitHub Pages (Recommended)
1. Create a GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select main branch
5. Save and wait for deployment
6. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Netlify
1. Sign up at netlify.com
2. Drag and drop your portfolio folder
3. Site goes live instantly
4. Get a free custom domain

### Option 3: Vercel
1. Sign up at vercel.com
2. Connect your GitHub repository
3. Automatic deployments on every push

## 💻 Local Testing

1. Open `index.html` in a web browser
2. For best results, use a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click on index.html
- Select "Open with Live Server"

## 🎯 Performance Optimization Tips

### Image Optimization
1. Compress images before uploading:
   - Use TinyPNG.com or ImageOptim
   - Target: <200KB per image
   - Format: JPG for photos, PNG for graphics

2. Consider WebP format for better compression:
   ```html
   <picture>
     <source srcset="photo1.webp" type="image/webp">
     <img src="photo1.jpg" alt="Description">
   </picture>
   ```

### SEO Improvements
1. Update meta tags in `<head>`:
   ```html
   <meta name="description" content="Your custom description">
   <meta property="og:image" content="URL_to_preview_image">
   ```

2. Add Google Analytics:
   ```html
   <!-- Add before </head> -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
   ```

## 🛠️ Customization Guide

### Change Colors
Edit the design tokens at the top of `styles.css`:
```css
:root {
    --primary: #YOUR_COLOR;
    --accent: #YOUR_COLOR;
    /* etc. */
}
```

### Change Fonts
Replace Google Fonts link in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap">
```

Update CSS:
```css
body {
    font-family: 'YOUR_FONT', sans-serif;
}
```

### Add New Sections
1. Add HTML structure in `index.html`
2. Add corresponding styles in `styles.css`
3. Update navigation if needed

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Common Issues & Fixes

**Issue**: Page looks empty / shows a red "content failed to load" banner
- **Fix**: You opened `index.html` directly as a `file://` path. Serve it via a local server (see Local Testing
  above) or view the deployed GitHub Pages URL — `fetch('content.md')` requires http(s).

**Issue**: Animations not working
- **Fix**: Make sure JavaScript is enabled in browser

**Issue**: Images not showing
- **Fix**: Check file paths are correct and images are in the `assets/` directory

**Issue**: Mobile menu not closing
- **Fix**: Clear browser cache and reload

## 📝 Checklist Before Going Live

- [ ] Review every section in `content.md` for accuracy
- [ ] Update resume link, email, LinkedIn, GitHub in the `# SITE` block
- [ ] Update LinkedIn post URLs under `# LINKEDIN`
- [ ] Test on mobile device
- [ ] Test in different browsers
- [ ] Compress photos in `assets/`
- [ ] Add Google Analytics (optional)
- [ ] Test all links work
- [ ] Proofread all content

## 📄 License

This portfolio template is created for Shravani Siripuram. Feel free to customize and use for your personal portfolio.

## 🙏 Credits

- **Design & Development**: Custom built with HTML, CSS, JavaScript
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter, Sora)
- **Content**: Driven entirely by [`content.md`](content.md)

---

**Built with ❤️ for Shravani Siripuram**

## 📞 Support

If you need help customizing this portfolio:
- Email: ssiripuram46@gmail.com

---

### Quick Start Summary

1. ✅ Files: `index.html` (skeleton), `styles.css` (design), `script.js` (loads + renders `content.md`)
2. ✏️ Edit `content.md` for any content change — bio, experience, projects, skills, links, everything
3. 📸 Drop new photos into `assets/` to replace the hero/about images
4. 🚀 Push to `main` — GitHub Actions deploys to GitHub Pages automatically
5. 🎉 Share your portfolio!
