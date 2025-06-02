# Product Requirements Document - Columnia Jekyll Theme

## Executive Summary

Columnia is a sophisticated Jekyll blog theme designed specifically for Korean content creators and developers. It combines modern web technologies with a focus on performance, aesthetics, and user experience, while maintaining the simplicity of static site generation.

## Product Overview

### Vision
To create the most elegant and performant Jekyll theme for Korean technical bloggers, providing a perfect balance between functionality and simplicity.

### Mission
Empower content creators with a beautiful, fast, and feature-rich blogging platform that requires minimal configuration while offering maximum customization potential.

### Target Users
- Korean developers and technical writers
- Content creators seeking a professional blog platform
- Jekyll enthusiasts looking for a modern, feature-rich theme
- Privacy-conscious bloggers who prefer client-side analytics

## Core Features

### 1. Content Management System

#### 1.1 Post Management
- **Markdown-based content creation** with full Kramdown support
- **Rich frontmatter system** including categories, tags, featured flags, and custom metadata
- **Automatic excerpt generation** with manual override capability
- **Reading time estimation** based on content length
- **Multi-language support structure** (Korean-first, English/Japanese ready)

#### 1.2 Category & Tag System
- **Dynamic category pages** with automatic generation via custom Ruby plugin
- **Clickable tags** that redirect to search with pre-filled queries
- **Category-based URL structure** for better SEO
- **Korean category name support** with proper URL encoding

#### 1.3 Pagination
- **Custom pagination plugin** supporting 10 posts per page
- **Clean URL structure** (/posts/page/2/)
- **Works with GitHub Actions** (bypasses GitHub Pages limitations)
- **Responsive pagination controls** with mobile optimization

### 2. User Interface & Experience

#### 2.1 Design System
- **Columnia Blue (#0064FF)** as primary brand color
- **Complete dark/light mode** with smooth transitions
- **Pretendard font** optimized for Korean typography
- **Responsive design** with breakpoints at 480px, 768px, 1000px, 1350px
- **Pixel-perfect center alignment** for optimal reading experience

#### 2.2 Layout Architecture
- **Fixed 800px content width** for optimal readability
- **Dynamic sidebar system** (280px) that appears on screens > 1350px
- **Sticky Table of Contents** with smooth scrolling
- **Independent layout positioning** ensuring content stays centered

#### 2.3 Interactive Elements
- **Reading progress bar** showing article completion
- **Smooth scroll animations** for better navigation
- **Share buttons** for Twitter, Facebook, LinkedIn
- **Back to top button** with fade-in animation
- **Tag hover effects** with underline animations

### 3. Search & Discovery

#### 3.1 Full-Text Search
- **Client-side search** across title, content, categories, and tags
- **Weighted scoring algorithm**:
  - Title matches: 10 points
  - Category matches: 7 points
  - Tag matches: 5 points
  - Content matches: 1 point
- **Real-time filtering** with 500ms debounce
- **Search term highlighting** in results
- **Search page** with popular categories display

#### 3.2 Related Posts
- **Smart algorithm** considering:
  - Same category (highest priority)
  - Common tags
  - Title keyword matches
  - Post recency
- **Maximum 4 related posts** displayed
- **Visual hints** showing relationship type

#### 3.3 Navigation
- **Breadcrumb navigation** on post pages
- **Previous/Next post links** with titles
- **Category sidebar** on homepage
- **Mobile-optimized menu** with slide-in animation

### 4. Analytics & Engagement

#### 4.1 View Counter
- **Privacy-focused** client-side implementation
- **Session-based tracking** using sessionStorage
- **No duplicate counting** within same session
- **Popular posts tracking** via JavaScript API
- **Developer console access** for statistics

#### 4.2 Social Features
- **One-click sharing** to major platforms
- **Copy link functionality** with notification
- **Newsletter subscription** placeholder
- **Comment system ready** (Disqus integration prepared)

### 5. Performance & Technical

#### 5.1 Build System
- **Jekyll 4.3.4** with Ruby 3.2+ support
- **GitHub Actions deployment** for custom plugins
- **Automated builds** on push to main branch
- **Sass compression** for minimal CSS size
- **Incremental builds** support

#### 5.2 Performance Optimizations
- **Lazy loading** with Intersection Observer
- **Font display swap** for faster text rendering
- **Minimal JavaScript** (no heavy frameworks)
- **CSS custom properties** for efficient theming
- **Will-change hints** for smooth animations

#### 5.3 SEO & Metadata
- **Jekyll SEO Tag** integration
- **Automatic sitemap** generation
- **RSS feed** support
- **Open Graph** and Twitter Card meta tags
- **Structured data** ready

## Technical Architecture

### Frontend Stack
- **HTML5** with semantic markup
- **Liquid templating** for dynamic content
- **Sass/SCSS** with modular architecture
- **Vanilla JavaScript** for maximum performance
- **CSS Grid & Flexbox** for modern layouts

### Backend/Build
- **Jekyll 4.x** static site generator
- **Ruby plugins** for extended functionality
- **GitHub Pages** compatible with Actions
- **Markdown** content management
- **YAML** configuration

### Development Philosophy
- **Component-based** layout system
- **Mobile-first** responsive design
- **Progressive enhancement** approach
- **Accessibility** considerations (ARIA labels, keyboard navigation)
- **Performance-first** mindset

## Unique Value Propositions

1. **Korean-Optimized Typography**: First Jekyll theme specifically designed for Korean content with Pretendard font
2. **Perfect Center Layout**: Mathematical precision in content alignment for optimal reading
3. **Privacy-First Analytics**: Client-side view counting without external dependencies
4. **Modern Yet Simple**: Advanced features without complexity overhead
5. **Developer-Friendly**: Clean code structure with extensive documentation
6. **GitHub Actions Ready**: Full custom plugin support beyond GitHub Pages limitations

## Version History

### Current Version: v0.1.3
- Perfect center layout system
- TOC implementation with ScrollSpy
- Responsive sidebar system
- View counter functionality
- Dark/light mode toggle
- Full-text search
- Related posts algorithm

### Roadmap
- **v0.2.0**: Complete multilingual support (Korean, English, Japanese)
- **v0.3.0**: AI translation workflow integration
- **v0.4.0**: Advanced analytics dashboard
- **v1.0.0**: Ruby Gem package release

## Success Metrics

### User Engagement
- Average session duration
- Pages per session
- Search usage rate
- Share button clicks
- Dark mode adoption rate

### Technical Performance
- Page load time < 2 seconds
- Lighthouse score > 90
- Build time < 3 minutes
- Zero JavaScript errors
- Cross-browser compatibility

### Content Creation
- Time to publish new post
- Category/tag usage rate
- Featured post engagement
- Related post click-through rate

## Implementation Guidelines

### For Developers
1. Clone repository and run `bundle install`
2. Use `bundle exec jekyll serve` for local development
3. Configure `_config.yml` for site settings
4. Add posts to `_posts/` with proper frontmatter
5. Deploy via GitHub Actions to GitHub Pages

### For Content Creators
1. Write posts in Markdown format
2. Use YYYY-MM-DD-title.md naming convention
3. Include required frontmatter fields
4. Add images to `/assets/images/`
5. Use categories and tags consistently

### For Designers
1. Modify Sass variables in `main.scss`
2. Follow BEM naming convention
3. Maintain responsive breakpoints
4. Test dark/light mode thoroughly
5. Ensure accessibility compliance

## Support & Documentation

### Documentation
- Comprehensive README.md
- CLAUDE.md for AI assistance
- Inline code comments
- Update logs in guideline_dear_claude.md

### Community
- GitHub Issues for bug reports
- Pull requests welcome
- Feature requests via discussions
- Email support available

## Conclusion

Columnia represents a new standard for Jekyll themes, specifically tailored for Korean content creators while maintaining international compatibility. Its focus on performance, aesthetics, and user experience makes it an ideal choice for developers and writers who value both form and function.

The theme's unique combination of advanced features and simplicity ensures that users can focus on what matters most: creating great content. With continued development and community support, Columnia aims to become the go-to Jekyll theme for technical blogging in Korea and beyond.