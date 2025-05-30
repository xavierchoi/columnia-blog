module Jekyll
  class CategoryPageGenerator < Generator
    safe true
    priority :low

    def generate(site)
      site.categories.each do |category, posts|
        site.pages << CategoryPage.new(site, site.source, category, posts)
      end
    end
  end

  class CategoryPage < Page
    def initialize(site, base, category, posts)
      @site = site
      @base = base
      @dir = File.join('categories', category)
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      
      self.data['category'] = category
      self.data['posts'] = posts.sort_by { |post| -post.date.to_i }
      self.data['title'] = "#{category}"
      self.data['layout'] = 'category'
    end
  end
end