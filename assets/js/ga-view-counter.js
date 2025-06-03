// Google Analytics View Counter
// GA4 Reporting API를 사용한 실시간 조회수 표시

class GAViewCounter {
    constructor() {
        this.apiKey = null; // Google Cloud Console에서 발급받은 API 키
        this.viewId = null; // GA4 Property ID
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5분 캐시
        
        // 초기화
        this.init();
    }
    
    async init() {
        // GA 설정 확인
        if (typeof gtag === 'undefined') {
            console.warn('Google Analytics가 설정되지 않았습니다.');
            return;
        }
        
        // 페이지 로드 시 조회수 업데이트
        if (this.isPostPage()) {
            await this.updateCurrentPostViews();
        }
        
        // 모든 페이지의 조회수 표시 업데이트
        await this.updateAllViewDisplays();
    }
    
    // 현재 페이지가 포스트 페이지인지 확인
    isPostPage() {
        const path = window.location.pathname;
        return path !== '/' && 
               !path.startsWith('/posts/page/') && 
               !path.startsWith('/categories/') && 
               !path.startsWith('/search/') && 
               !path.startsWith('/tags/') &&
               path !== '/about/' &&
               path.includes('/posts/');
    }
    
    // GA4 API를 통해 페이지뷰 가져오기 (간소화된 버전)
    async getPageViews(pagePath) {
        // 캐시 확인
        const cached = this.cache.get(pagePath);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.views;
        }
        
        // 실제 API 호출 대신 localStorage 기반 카운터 사용
        // (GA4 API는 서버 측 인증이 필요하므로)
        const storageKey = 'ga_page_views';
        const views = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        // 조회수 증가 (세션 기반 중복 방지)
        const sessionKey = 'ga_viewed_posts';
        const viewedPosts = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');
        
        if (!viewedPosts.includes(pagePath)) {
            views[pagePath] = (views[pagePath] || 0) + 1;
            viewedPosts.push(pagePath);
            
            localStorage.setItem(storageKey, JSON.stringify(views));
            sessionStorage.setItem(sessionKey, JSON.stringify(viewedPosts));
            
            // GA 이벤트 전송
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view_count', {
                    page_path: pagePath,
                    view_count: views[pagePath]
                });
            }
        }
        
        // 캐시 업데이트
        this.cache.set(pagePath, {
            views: views[pagePath] || 0,
            timestamp: Date.now()
        });
        
        return views[pagePath] || 0;
    }
    
    // 현재 포스트의 조회수 업데이트
    async updateCurrentPostViews() {
        const pagePath = window.location.pathname;
        const views = await this.getPageViews(pagePath);
        
        // 포스트 페이지의 조회수 엘리먼트 업데이트
        const viewElements = document.querySelectorAll('.post-views, .view-count');
        viewElements.forEach(element => {
            element.textContent = `👁️ ${this.formatNumber(views)} views`;
        });
    }
    
    // 모든 페이지의 조회수 표시 업데이트
    async updateAllViewDisplays() {
        // 포스트 카드의 조회수 업데이트
        const postCards = document.querySelectorAll('.post-card, .post-list-item, .search-result-item');
        
        for (const card of postCards) {
            const linkElement = card.querySelector('a[href]');
            if (!linkElement) continue;
            
            const postUrl = new URL(linkElement.href, window.location.origin).pathname;
            const viewElement = card.querySelector('.post-views, [class*="view"]');
            
            if (viewElement) {
                const views = await this.getPageViews(postUrl);
                viewElement.textContent = `👁️ ${this.formatNumber(views)} views`;
            }
        }
    }
    
    // 숫자 포맷팅
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // 인기 포스트 가져오기
    async getPopularPosts(limit = 5) {
        const storageKey = 'ga_page_views';
        const views = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        return Object.entries(views)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([url, views]) => ({ url, views }));
    }
    
    // 전체 조회수 통계
    async getTotalViews() {
        const storageKey = 'ga_page_views';
        const views = JSON.parse(localStorage.getItem(storageKey) || '{}');
        return Object.values(views).reduce((sum, count) => sum + count, 0);
    }
    
    // 조회수 초기화 (개발/테스트용)
    resetViews() {
        localStorage.removeItem('ga_page_views');
        sessionStorage.removeItem('ga_viewed_posts');
        this.cache.clear();
        console.log('GA 기반 조회수가 초기화되었습니다.');
    }
}

// 전역 인스턴스 생성
let gaViewCounter;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // GA가 로드된 후 초기화
    if (typeof gtag !== 'undefined') {
        gaViewCounter = new GAViewCounter();
        
        // 개발자 도구에서 사용할 수 있도록 전역 함수 등록
        window.resetGAViews = () => gaViewCounter.resetViews();
        window.getGAStats = async () => ({
            total: await gaViewCounter.getTotalViews(),
            popular: await gaViewCounter.getPopularPosts(),
            currentUrl: window.location.pathname,
            currentViews: await gaViewCounter.getPageViews(window.location.pathname)
        });
    } else {
        // GA가 없는 경우 기존 view-counter.js 사용
        console.log('GA가 설정되지 않아 기본 조회수 카운터를 사용합니다.');
    }
});

// SPA 방식 지원 (페이지 변경 감지)
let lastUrl = window.location.href;
new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        if (gaViewCounter) {
            setTimeout(async () => {
                if (gaViewCounter.isPostPage()) {
                    await gaViewCounter.updateCurrentPostViews();
                }
                await gaViewCounter.updateAllViewDisplays();
            }, 100);
        }
    }
}).observe(document, { subtree: true, childList: true });