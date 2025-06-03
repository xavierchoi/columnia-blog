# CLAUDE.md

Before start reading this, PLEASE DO CHECK and read guideline_dear_claude.md and guideline_dear_claude_2.md files in order. The file is important to understand what is in user's mind and update log of project.
사용자가 "버전 빌드를 종료합니다" 라고 말하면 guideline_dear_claude_2.md 파일의 마지막 부분에 지금까지 채팅에서 진행한 업데이트 및 변경사항 로그를 정리합니다. 사용자의 별도 제안이 없는 한 가장 마이너한 버전 넘버로 업데이트합니다. 이후 현재 버전을 커밋 코멘트에 적어 커밋 후 푸시합니다. 커밋은 Claude 명의로 합니다. #important

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Setup and Installation
```bash
bundle install                  # Install Ruby dependencies
bundle update                   # Update dependencies
```

### Development
```bash
bundle exec jekyll serve --config _config.yml,_config_local.yml  # Local development server
bundle exec jekyll build                                          # Build static site
bundle exec jekyll clean                                          # Clean build artifacts
```

### Deployment
- Site is deployed via GitHub Actions to GitHub Pages
- Push to main branch triggers automatic deployment
- Custom plugins require GitHub Actions (not supported by GitHub Pages default build)

## Architecture

### Layout System
The site uses a sophisticated center-alignment system with absolute positioning:
- Posts are centered in a 800px fixed-width container
- Sidebar appears on wider screens (>1350px)
- TOC (Table of Contents) is dynamically positioned
- All layouts inherit from `_layouts/default.html`

### Custom Plugins

**category_pages.rb**: Generates individual pages for each category
- Creates `/categories/[category-name]/` URLs
- Uses `category.html` layout
- Handles Korean category names with URL encoding

**posts_pagination.rb**: Custom pagination implementation
- 10 posts per page
- Generates `/posts/page/[n]/` URLs
- Works around GitHub Pages limitations

### JavaScript Architecture

**main.js**: Core functionality including:
- Theme switching with localStorage persistence
- Real-time search with scoring algorithm
- Reading progress bar
- Dynamic TOC generation with smooth scrolling
- Share functionality (Twitter, Facebook, LinkedIn)
- Tag navigation (all tags redirect to search)

**view-counter.js**: Analytics without external dependencies
- Uses sessionStorage to prevent duplicate counts
- Tracks views per post
- Developer console functions for stats

### Styling System
- Single main SASS file at `assets/css/main.scss`
- CSS custom properties for theme switching
- Pretendard font with CDN and local fallback
- Dark/light theme color systems defined in `:root`

## Development Workflow

### Creating Posts
1. Add markdown file to `_posts/` with format: `YYYY-MM-DD-title.md`
2. Include required frontmatter:
   ```yaml
   ---
   layout: post
   title: "Post Title"
   category: "category-name"
   tags: [tag1, tag2]
   date: YYYY-MM-DD HH:MM:SS +0900
   ---
   ```

### Working with Categories
- Only one category per post
- Categories automatically generate archive pages
- New categories create URLs at `/categories/[name]/`

### Local vs Production
- Local: Uses `_config_local.yml` to override baseurl
- Production: Uses full baseurl for GitHub Pages deployment
- Always test with both configs before deploying

## Key Features Implementation

### Perfect Center Layout
Posts use absolute positioning for pixel-perfect centering:
```css
.post-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
}
```

### Search System
- Full-text search across title, excerpt, category, and tags
- Scoring algorithm prioritizes title matches
- Real-time filtering on homepage
- Search page at `/search/`

### View Counter
- Increments on page load (once per session)
- Data stored in sessionStorage
- Access stats via browser console: `window.getPopularPosts()`

## Performance Optimizations
- Lazy loading with Intersection Observer
- Compressed CSS output
- Minimal JavaScript (no heavy frameworks)
- Static site benefits (no server-side processing)

## Common Issues

### Pagination Not Working
- GitHub Pages doesn't support jekyll-paginate-v2
- Must use GitHub Actions for deployment
- Check `.github/workflows/` for build configuration

### Categories with Korean Names
- URL encoding handled automatically
- Use Korean names in frontmatter
- Plugin converts to URL-safe format

### Theme Switching
- Persisted in localStorage as 'theme'
- Defaults to light theme
- Applied before render to prevent flash

## Debugging

### Visual Layout Debugging
Add `?debug=true` to URL for:
- Red borders on layout containers
- Console logs for positioning
- Grid overlay helpers

### JavaScript Debugging
- All major functions log to console
- Check sessionStorage for view counts
- Theme state in localStorage

## Notes
- No automated tests or linting setup currently
- Ruby 3.2+ required for sass-embedded gem
- Jekyll 4.3.4 (newer than GitHub Pages default)
- Designed for Korean content but multilingual-ready