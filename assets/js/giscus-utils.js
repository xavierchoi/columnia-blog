// Giscus 유틸리티 - 댓글 수 및 인기 댓글 기능
class GiscusUtils {
    constructor() {
        this.repo = window.giscusConfig?.repo || '';
        this.categoryId = window.giscusConfig?.categoryId || '';
        this.commentCounts = new Map();
        this.popularDiscussions = [];
        
        // 초기화
        this.init();
    }
    
    async init() {
        // GitHub API를 사용하여 댓글 수 가져오기
        if (this.repo && this.repo !== '') {
            await this.fetchCommentCounts();
            this.updateCommentCountDisplays();
            await this.fetchPopularDiscussions();
        }
    }
    
    // GitHub GraphQL API를 사용하여 댓글 수 가져오기
    async fetchCommentCounts() {
        try {
            // Public API 사용 (인증 없이)
            const [owner, repoName] = this.repo.split('/');
            
            // REST API 사용 (GraphQL은 인증 필요)
            const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/discussions`);
            
            if (!response.ok) {
                console.warn('GitHub API 호출 실패:', response.status);
                return;
            }
            
            const discussions = await response.json();
            
            // 각 discussion의 댓글 수 저장
            discussions.forEach(discussion => {
                const pathname = discussion.title; // pathname을 제목으로 사용
                const commentCount = discussion.comments;
                this.commentCounts.set(pathname, commentCount);
            });
            
        } catch (error) {
            console.warn('댓글 수 가져오기 실패:', error);
            // 실패 시 로컬 스토리지 캐시 사용
            this.loadFromCache();
        }
    }
    
    // 인기 댓글/토론 가져오기
    async fetchPopularDiscussions() {
        try {
            const [owner, repoName] = this.repo.split('/');
            const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/discussions?sort=comments&direction=desc`);
            
            if (!response.ok) return;
            
            const discussions = await response.json();
            
            // 상위 5개 인기 토론
            this.popularDiscussions = discussions
                .filter(d => d.comments > 0)
                .slice(0, 5)
                .map(d => ({
                    title: d.title,
                    url: d.html_url,
                    comments: d.comments,
                    reactions: d.reactions?.total_count || 0
                }));
                
            // 캐시에 저장
            this.saveToCache();
            
        } catch (error) {
            console.warn('인기 댓글 가져오기 실패:', error);
            this.loadFromCache();
        }
    }
    
    // 로컬 스토리지 캐싱
    saveToCache() {
        const cacheData = {
            commentCounts: Array.from(this.commentCounts.entries()),
            popularDiscussions: this.popularDiscussions,
            timestamp: Date.now()
        };
        localStorage.setItem('giscus_cache', JSON.stringify(cacheData));
    }
    
    loadFromCache() {
        const cached = localStorage.getItem('giscus_cache');
        if (!cached) return;
        
        const cacheData = JSON.parse(cached);
        const cacheAge = Date.now() - cacheData.timestamp;
        
        // 1시간 이내의 캐시만 사용
        if (cacheAge < 60 * 60 * 1000) {
            this.commentCounts = new Map(cacheData.commentCounts);
            this.popularDiscussions = cacheData.popularDiscussions || [];
        }
    }
    
    // 포스트 카드에 댓글 수 표시
    updateCommentCountDisplays() {
        // 모든 포스트 카드 찾기
        const postCards = document.querySelectorAll('.post-card, .post-list-item, .search-result-item');
        
        postCards.forEach(card => {
            const linkElement = card.querySelector('a[href]');
            if (!linkElement) return;
            
            const postUrl = new URL(linkElement.href, window.location.origin).pathname;
            const commentCount = this.commentCounts.get(postUrl) || 0;
            
            // 기존 댓글 수 표시 요소 찾기 또는 생성
            let commentElement = card.querySelector('.post-comments');
            if (!commentElement) {
                // 메타 정보 영역 찾기
                const metaElement = card.querySelector('.post-meta, .post-info');
                if (metaElement) {
                    commentElement = document.createElement('span');
                    commentElement.className = 'post-comments';
                    metaElement.appendChild(commentElement);
                }
            }
            
            if (commentElement) {
                commentElement.innerHTML = `<span class="comment-icon">💬</span> ${commentCount}`;
                commentElement.title = `${commentCount}개의 댓글`;
            }
        });
    }
    
    // 인기 댓글 위젯 렌더링
    renderPopularWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (this.popularDiscussions.length === 0) {
            container.innerHTML = '<p class="no-discussions">아직 댓글이 없습니다.</p>';
            return;
        }
        
        const html = `
            <div class="popular-discussions">
                <h3 class="widget-title">🔥 인기 토론</h3>
                <ul class="popular-list">
                    ${this.popularDiscussions.map(d => `
                        <li class="popular-item">
                            <a href="${d.url}" target="_blank" rel="noopener" class="popular-link">
                                <span class="popular-title">${this.truncateTitle(d.title)}</span>
                                <span class="popular-stats">
                                    <span class="comment-count">💬 ${d.comments}</span>
                                    ${d.reactions > 0 ? `<span class="reaction-count">👍 ${d.reactions}</span>` : ''}
                                </span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    // 긴 제목 줄이기
    truncateTitle(title) {
        // 경로 형식의 제목에서 포스트 이름 추출
        const match = title.match(/\/posts\/\d{4}-\d{2}-\d{2}-(.*)\//);
        if (match) {
            return match[1].replace(/-/g, ' ');
        }
        return title.length > 50 ? title.substring(0, 50) + '...' : title;
    }
}

// 전역 인스턴스 생성
let giscusUtils;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    if (window.giscusConfig && window.giscusConfig.repo) {
        giscusUtils = new GiscusUtils();
        
        // 개발자 도구 명령어
        window.refreshCommentCounts = () => {
            giscusUtils.fetchCommentCounts().then(() => {
                giscusUtils.updateCommentCountDisplays();
            });
        };
        
        window.showPopularDiscussions = () => {
            console.log('인기 토론:', giscusUtils.popularDiscussions);
        };
    }
});