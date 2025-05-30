// 조회수 카운터
class ViewCounter {
    constructor() {
        this.storageKey = 'blog_post_views';
        this.sessionKey = 'viewed_posts_session';
        this.views = this.loadViews();
        this.sessionViews = this.getSessionViews();
        
        // 페이지 로드 시 조회수 업데이트
        if (this.isPostPage()) {
            this.updatePostView();
        }
        
        // 모든 페이지에서 조회수 표시 업데이트
        this.updateViewDisplays();
    }
    
    // 로컬 저장소에서 조회수 데이터 로드
    loadViews() {
        try {
            const stored = sessionStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('조회수 데이터 로드 실패:', error);
            return {};
        }
    }
    
    // 세션에서 이미 조회한 포스트 목록 가져오기
    getSessionViews() {
        try {
            const stored = sessionStorage.getItem(this.sessionKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    }
    
    // 조회수 데이터 저장
    saveViews() {
        try {
            sessionStorage.setItem(this.storageKey, JSON.stringify(this.views));
            sessionStorage.setItem(this.sessionKey, JSON.stringify(this.sessionViews));
        } catch (error) {
            console.warn('조회수 데이터 저장 실패:', error);
        }
    }
    
    // 현재 페이지가 포스트 페이지인지 확인
    isPostPage() {
        // URL 패턴으로 포스트 페이지 판단
        const path = window.location.pathname;
        return path !== '/' && 
               path !== '/posts/' && 
               !path.startsWith('/posts/') && 
               !path.startsWith('/categories/') && 
               !path.startsWith('/search/') && 
               path !== '/about/' &&
               !path.endsWith('.html');
    }
    
    // 현재 포스트의 조회수 업데이트
    updatePostView() {
        const postUrl = window.location.pathname;
        
        // 이미 이 세션에서 조회한 포스트인지 확인
        if (this.sessionViews.includes(postUrl)) {
            return; // 중복 조회 방지
        }
        
        // 조회수 증가
        this.views[postUrl] = (this.views[postUrl] || 0) + 1;
        this.sessionViews.push(postUrl);
        
        // 저장
        this.saveViews();
        
        // 화면에 즉시 반영
        this.updateCurrentPostView(postUrl);
        
        console.log(`포스트 조회수 업데이트: ${postUrl} = ${this.views[postUrl]}`);
    }
    
    // 특정 포스트의 조회수 가져오기
    getPostViews(postUrl) {
        return this.views[postUrl] || 0;
    }
    
    // 현재 포스트의 조회수 표시 업데이트
    updateCurrentPostView(postUrl) {
        const viewElements = document.querySelectorAll('.post-views, .view-count');
        const currentViews = this.getPostViews(postUrl);
        
        viewElements.forEach(element => {
            element.textContent = `👁️ ${currentViews} views`;
        });
    }
    
    // 모든 페이지의 조회수 표시 업데이트
    updateViewDisplays() {
        // 포스트 카드의 조회수 업데이트
        const postCards = document.querySelectorAll('.post-card, .post-list-item, .search-result-item');
        
        postCards.forEach(card => {
            const linkElement = card.querySelector('a[href]');
            if (!linkElement) return;
            
            const postUrl = new URL(linkElement.href).pathname;
            const viewElement = card.querySelector('.post-views, [class*="view"]');
            
            if (viewElement) {
                const views = this.getPostViews(postUrl);
                viewElement.textContent = `👁️ ${views} views`;
            }
        });
        
        // 개별 포스트 페이지의 조회수 업데이트
        if (this.isPostPage()) {
            const currentUrl = window.location.pathname;
            this.updateCurrentPostView(currentUrl);
        }
    }
    
    // 조회수 초기화 (개발/테스트용)
    resetViews() {
        this.views = {};
        this.sessionViews = [];
        this.saveViews();
        this.updateViewDisplays();
        console.log('모든 조회수가 초기화되었습니다.');
    }
    
    // 전체 조회수 통계
    getTotalViews() {
        return Object.values(this.views).reduce((sum, count) => sum + count, 0);
    }
    
    // 인기 포스트 목록 (조회수 기준)
    getPopularPosts(limit = 5) {
        return Object.entries(this.views)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([url, views]) => ({ url, views }));
    }
}

// 전역 인스턴스 생성
let viewCounter;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    viewCounter = new ViewCounter();
    
    // 개발자 도구에서 사용할 수 있도록 전역 함수 등록
    window.resetViewCounts = () => viewCounter.resetViews();
    window.getViewStats = () => ({
        total: viewCounter.getTotalViews(),
        popular: viewCounter.getPopularPosts(),
        current: viewCounter.views
    });
});

// 페이지 변경 감지 (SPA 방식 지원)
let lastUrl = window.location.href;
new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        if (viewCounter) {
            setTimeout(() => {
                if (viewCounter.isPostPage()) {
                    viewCounter.updatePostView();
                }
                viewCounter.updateViewDisplays();
            }, 100);
        }
    }
}).observe(document, { subtree: true, childList: true });