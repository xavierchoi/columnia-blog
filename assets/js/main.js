// 간단화된 main.js - 핵심 기능만 포함

// 태그 클릭 이벤트
function initTagClickEvents() {
    console.log('🏷️ 태그 클릭 이벤트 초기화');
    
    // 이벤트 델리게이션 사용
    document.body.addEventListener('click', function(e) {
        // 클릭된 요소가 태그인지 확인
        if (e.target.classList.contains('tag-clickable') || 
            e.target.classList.contains('post-tag') ||
            e.target.classList.contains('post-list-tag')) {
            
            e.preventDefault();
            
            const tagName = e.target.getAttribute('data-tag') || e.target.textContent.trim();
            console.log('태그 클릭됨:', tagName);
            
            if (tagName) {
                const searchUrl = `/search/?q=${encodeURIComponent(tagName)}`;
                console.log('이동할 URL:', searchUrl);
                window.location.href = searchUrl;
            }
        }
    });
    
    // 태그 요소들에 커서 스타일 적용
    function applyTagStyles() {
        const tagElements = document.querySelectorAll('.tag-clickable, .post-tag, .post-list-tag');
        console.log('태그 요소 개수:', tagElements.length);
        
        tagElements.forEach(tag => {
            tag.style.cursor = 'pointer';
            tag.style.transition = 'all 0.2s ease';
            
            // 호버 효과 추가
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // 초기 적용
    applyTagStyles();
    
    // 새로 추가된 요소들에도 적용
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                applyTagStyles();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ 태그 클릭 이벤트 초기화 완료');
}

// 헤더 검색 기능
function initHeaderSearch() {
    const headerSearchInput = document.getElementById('searchInput');
    if (!headerSearchInput) return;
    
    // Enter 키 이벤트
    headerSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            }
        }
    });
    
    // 검색 아이콘 클릭
    const searchIcon = document.querySelector('.header-search .search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const query = headerSearchInput.value.trim();
            if (query) {
                window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            } else {
                window.location.href = '/search/';
            }
        });
        
        searchIcon.style.cursor = 'pointer';
        searchIcon.style.pointerEvents = 'auto';
    }
}

// 공유 기능
function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform') || 
                           this.getAttribute('title')?.toLowerCase() || 
                           this.textContent.trim();
            const url = this.getAttribute('data-url') || window.location.href;
            const title = this.getAttribute('data-title') || document.title;
            
            sharePost(platform, url, title);
        });
    });
}

function sharePost(platform, url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    
    switch(platform.toLowerCase()) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
        case 'x':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case 'kakao':
        case 'kakaotalk':
            showNotification('카카오톡 공유 기능은 실제 구현 시 Kakao SDK가 필요합니다.', 'info');
            return;
        default:
            console.warn('Unknown sharing platform:', platform);
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        showNotification('공유 창이 열렸습니다!', 'success');
    }
}

// 알림 시스템
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    }
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 스크롤 애니메이션
function initScrollAnimations() {
    if (!window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const elementsToAnimate = [
        ...document.querySelectorAll('.post-card'),
        ...document.querySelectorAll('.sidebar-section'),
        ...document.querySelectorAll('.category-card'),
        ...document.querySelectorAll('.post-list-item')
    ];
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Back to Top 버튼
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Reading Progress Bar (포스트 페이지만)
function initReadingProgress() {
    if (!document.querySelector('.post-single')) return;
    
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const maxScrollTop = documentHeight - windowHeight;
        const progress = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * 100 : 0;
        
        progressBar.style.width = Math.max(0, Math.min(100, progress)) + '%';
    }, { passive: true });
}

// 목차 기능 (포스트 페이지만)
function initTableOfContents() {
    if (!document.querySelector('.post-single')) return;
    
    const postContent = document.querySelector('.post-content');
    const tocContainer = document.querySelector('.table-of-contents');
    
    if (!postContent || !tocContainer) return;
    
    const headings = postContent.querySelectorAll('h2, h3');
    
    if (headings.length < 1) {
        const tocSection = tocContainer.closest('.sidebar-section');
        if (tocSection) {
            tocSection.style.display = 'none';
        }
        return;
    }
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        if (!heading.id) {
            const headingText = heading.textContent.toLowerCase()
                .replace(/[^\w\s-가-힣]/g, '')
                .replace(/\s+/g, '-')
                .trim();
            heading.id = headingText || `heading-${index}`;
        }
        
        const listItem = document.createElement('li');
        listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = heading.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    tocContainer.innerHTML = '';
    tocContainer.appendChild(tocList);
}

// 홈페이지 실시간 검색
function initHomePageSearch() {
    if (!document.querySelector('.posts-grid')) return;
    
    const searchInput = document.getElementById('searchInput');
    const posts = document.querySelectorAll('.post-card');
    
    if (!searchInput || posts.length === 0) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let visibleCount = 0;
        
        posts.forEach(post => {
            const titleElement = post.querySelector('.post-title a');
            const excerptElement = post.querySelector('.post-excerpt');
            const categoryElement = post.querySelector('.post-category');
            const tagElements = post.querySelectorAll('.post-tag');
            
            if (!titleElement || !excerptElement) return;
            
            const title = titleElement.textContent.toLowerCase();
            const excerpt = excerptElement.textContent.toLowerCase();
            const category = categoryElement ? categoryElement.textContent.toLowerCase() : '';
            const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const isMatch = searchTerm === '' || 
                          title.includes(searchTerm) || 
                          excerpt.includes(searchTerm) ||
                          category.includes(searchTerm) ||
                          tags.includes(searchTerm);
            
            if (isMatch) {
                post.style.display = 'block';
                post.classList.add('fade-in');
                visibleCount++;
            } else {
                post.style.display = 'none';
                post.classList.remove('fade-in');
            }
        });
    });
}

// ================================================================
// 🌓 테마 토글 관련 기능 추가 (기존 코드는 건드리지 않음)
// ================================================================

// 다크/라이트 모드 토글 함수
function toggleTheme() {
    console.log('🌓 테마 토글 시작');
    
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log('현재 테마:', currentTheme, '→ 새 테마:', newTheme);
    
    // 테마 변경
    html.setAttribute('data-theme', newTheme);
    
    // localStorage에 저장
    try {
        localStorage.setItem('theme', newTheme);
        console.log('테마 저장됨:', newTheme);
    } catch (e) {
        console.warn('localStorage 사용 불가:', e);
    }
}

// 언어 드롭다운 토글 함수
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Back to Top 함수 (HTML에서 호출용)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 페이지 로드 시 저장된 테마 적용
function initTheme() {
    console.log('🎨 테마 초기화');
    
    let savedTheme = 'light';
    
    try {
        savedTheme = localStorage.getItem('theme') || 'light';
    } catch (e) {
        console.warn('localStorage 읽기 실패:', e);
    }
    
    console.log('저장된 테마:', savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 외부 클릭 시 언어 드롭다운 닫기
document.addEventListener('click', function(e) {
    const languageSwitcher = document.querySelector('.language-switcher');
    const dropdown = document.getElementById('languageDropdown');
    
    if (languageSwitcher && dropdown && !languageSwitcher.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ================================================================
// 기존 초기화 코드 (테마 초기화만 추가)
// ================================================================

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 블로그 초기화 시작');
    
    // 🌓 테마 초기화 (가장 먼저 실행)
    initTheme();
    
    // 기존 핵심 기능들 초기화 (변경 없음)
    initTagClickEvents();
    initHeaderSearch();
    initShareButtons();
    initScrollAnimations();
    initBackToTop();
    initReadingProgress();
    initTableOfContents();
    initHomePageSearch();
    
    console.log('✅ 블로그 초기화 완료');
});

// 리사이즈 이벤트 (기존 코드 유지)
window.addEventListener('resize', function() {
    // 필요한 경우 리사이즈 처리
}, { passive: true });