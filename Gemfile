source "https://rubygems.org"

# Jekyll 메인 gem (버전 유지)
gem "jekyll", "~> 4.3.4"

# 기본 테마 (사용하지 않지만 호환성을 위해 유지)
gem "minima", "~> 2.5"

# Ruby 3.4+ 호환성을 위한 필수 gem들
gem "csv"
gem "logger"
gem "ostruct"
gem "base64"

# Jekyll 플러그인 그룹
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-seo-tag", "~> 2.8"
  
  # 주의: jekyll-paginate-v2는 GitHub Pages에서 지원되지 않음
  # 커스텀 플러그인(_plugins/posts_pagination.rb)을 사용하므로 GitHub Actions 필요
  gem "jekyll-paginate-v2", "~> 3.0"
end

# Windows 및 JRuby 플랫폼 지원
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# 플랫폼별 성능 최적화
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# 개발 및 서버 실행용
gem "webrick", "~> 1.8"

# 개발 환경 전용 도구
group :development do
  gem "jekyll-admin", "~> 0.11"
end

# 프로덕션 환경 최적화 (GitHub Actions에서 사용)
group :production do
  # CSS/JS 압축 (선택사항)
  # gem "jekyll-compress-images"
  # gem "jekyll-minifier"
end