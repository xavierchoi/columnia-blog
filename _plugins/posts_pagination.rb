module Jekyll
  class PostsPaginationGenerator < Generator
    safe true
    priority :low

    def generate(site)
      posts_per_page = 10
      total_posts = site.posts.docs.size
      total_pages = (total_posts.to_f / posts_per_page).ceil
      
      return if total_pages <= 1
      
      # 2페이지부터 생성
      (2..total_pages).each do |page_num|
        site.pages << PostsPaginationPage.new(site, site.source, page_num, posts_per_page, total_posts)
      end
    end
  end

  class PostsPaginationPage < Page
    def initialize(site, base, page_num, posts_per_page, total_posts)
      @site = site
      @base = base
      @dir = "posts/#{page_num}"
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'posts_page.html')
      
      # 페이지 데이터 설정
      self.data['title'] = "전체 게시물 - #{page_num}페이지"
      self.data['page_num'] = page_num
      self.data['posts_per_page'] = posts_per_page
      self.data['total_posts'] = total_posts
      self.data['total_pages'] = (total_posts.to_f / posts_per_page).ceil
      
      # 현재 페이지의 포스트들 계산
      start_index = (page_num - 1) * posts_per_page
      end_index = [start_index + posts_per_page - 1, total_posts - 1].min
      
      # 포스트들을 날짜 내림차순(최신→오래된 순)으로 명시적 정렬
      sorted_posts = site.posts.docs.sort_by { |post| post.date }.reverse
      self.data['current_posts'] = sorted_posts[start_index..end_index] || []
    end
  end
end