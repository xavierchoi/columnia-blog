// 간단화된 main.js - 핵심 기능만 포함

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (!mobileMenu) {
        // 모바일 메뉴가 없으면 생성
        createMobileMenu();
        return;
    }
    
    mobileMenu.classList.toggle('show');
    menuToggle.classList.toggle('active');
    body.classList.toggle('menu-open');
}

// 모바일 메뉴 생성
function createMobileMenu() {
    const nav = document.querySelector('.header nav');
    if (!nav) return;
    
    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.onclick = toggleMobileMenu;
    document.body.appendChild(overlay);
    
    // 모바일 메뉴 컨테이너 생성
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-nav-menu';
    
    // 메뉴 헤더
    const menuHeader = document.createElement('div');
    menuHeader.className = 'mobile-menu-header';
    menuHeader.innerHTML = `
        <span class="mobile-menu-title">메뉴</span>
        <button class="mobile-menu-close" onclick="toggleMobileMenu()">×</button>
    `;
    
    // 네비게이션 메뉴 복사
    const navClone = nav.cloneNode(true);
    navClone.className = 'mobile-nav-content';
    
    mobileMenu.appendChild(menuHeader);
    mobileMenu.appendChild(navClone);
    document.body.appendChild(mobileMenu);
    
    // 첫 생성 후 즉시 토글
    setTimeout(() => toggleMobileMenu(), 10);
}

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
    console.log('📤 공유 기능 시작:', platform, url, title);
    
    // Web Share API를 우선적으로 사용 (share 플랫폼이거나 Web Share API 사용 가능한 경우)
    if ((platform.toLowerCase() === 'share' || platform.toLowerCase() === '공유') && navigator.share) {
        console.log('🌐 Web Share API 사용');
        
        navigator.share({
            title: title,
            url: url,
            text: `${title} - 흥미로운 글을 발견했습니다!`
        }).then(() => {
            console.log('✅ Web Share API 공유 성공');
            showNotification('공유가 완료되었습니다!', 'success');
        }).catch((error) => {
            console.warn('❌ Web Share API 공유 실패:', error);
            // Web Share API 실패 시 폴백으로 클립보드 복사
            fallbackToClipboard(url, title);
        });
        return;
    }
    
    // 기존 플랫폼별 공유 로직
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
        case 'share':
        case '공유':
            // Web Share API가 지원되지 않는 경우 클립보드 복사로 폴백
            fallbackToClipboard(url, title);
            return;
        default:
            console.warn('Unknown sharing platform:', platform);
            return;
    }
    
    if (shareUrl) {
        console.log('🔗 플랫폼별 공유 URL 열기:', shareUrl);
        window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        showNotification('공유 창이 열렸습니다!', 'success');
    }
}

// Web Share API 폴백: 클립보드 복사
function fallbackToClipboard(url, title) {
    console.log('📋 클립보드 복사 폴백 실행');
    
    if (navigator.clipboard && window.isSecureContext) {
        // 현대적인 Clipboard API 사용
        navigator.clipboard.writeText(url).then(() => {
            console.log('✅ 클립보드 복사 성공 (Clipboard API)');
            showNotification(`"${title}" 링크가 클립보드에 복사되었습니다!`, 'success');
        }).catch((error) => {
            console.warn('❌ 클립보드 복사 실패 (Clipboard API):', error);
            legacyClipboardCopy(url, title);
        });
    } else {
        // 레거시 방식 폴백
        legacyClipboardCopy(url, title);
    }
}

// 레거시 클립보드 복사 방식
function legacyClipboardCopy(text, title) {
    console.log('📋 레거시 클립보드 복사 시도');
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        // @ts-ignore - execCommand는 deprecated이지만 폴백용으로 사용
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('✅ 클립보드 복사 성공 (레거시)');
            showNotification(`"${title || '링크'}"가 클립보드에 복사되었습니다!`, 'success');
        } else {
            console.warn('❌ 클립보드 복사 실패 (레거시)');
            showNotification('링크 복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
        }
    } catch (error) {
        console.warn('❌ 클립보드 복사 오류 (레거시):', error);
        showNotification('링크 복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
    } finally {
        document.body.removeChild(textArea);
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

// 홈페이지 검색 - 엔터키만 지원
function initHomePageSearch() {
    if (!document.querySelector('.posts-grid')) return;
    
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    // 엔터키를 눌렀을 때만 검색 페이지로 이동
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            } else {
                window.location.href = '/search/';
            }
        }
    });
    
    // 검색 아이콘 클릭 시에도 검색 페이지로 이동
    const searchIcon = document.querySelector('.header-search .search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            } else {
                window.location.href = '/search/';
            }
        });
    }
}

// ================================================================
// 🌓 테마 토글 관련 기능 추가 (기존 코드는 건드리지 않음)
// ================================================================

// 다크/라이트 모드 토글 함수
function toggleTheme() {
    console.log('🌓 테마 토글 시작');
    
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const currentMode = localStorage.getItem('themeMode') || 'auto';
    
    let newTheme, newMode;
    
    // 현재 모드에 따라 다음 상태 결정
    if (currentMode === 'auto') {
        // auto → light (수동)
        newTheme = 'light';
        newMode = 'manual';
    } else if (currentTheme === 'light') {
        // light → dark (수동)
        newTheme = 'dark';
        newMode = 'manual';
    } else {
        // dark → auto (시스템 따라가기)
        newTheme = getSystemTheme();
        newMode = 'auto';
    }
    
    console.log('테마 변경:', currentTheme, '→', newTheme, '(모드:', newMode + ')');
    
    // 테마 변경
    html.setAttribute('data-theme', newTheme);
    
    // localStorage에 저장
    try {
        localStorage.setItem('theme', newTheme);
        localStorage.setItem('themeMode', newMode);
        console.log('테마 저장됨:', newTheme, '모드:', newMode);
    } catch (e) {
        console.warn('localStorage 사용 불가:', e);
    }
    
    // 버튼 상태 업데이트
    updateThemeButtonState(newMode, newTheme);
}

// 테마 버튼 상태 업데이트
function updateThemeButtonState(mode, theme) {
    const themeButton = document.querySelector('.dark-light-toggle');
    if (!themeButton) return;
    
    // 버튼에 현재 상태 표시 (선택적)
    themeButton.setAttribute('data-mode', mode);
    themeButton.setAttribute('title', 
        mode === 'auto' 
            ? '테마: 자동 (시스템 설정 따름)' 
            : `테마: ${theme === 'dark' ? '다크' : '라이트'} 모드`
    );
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

// 시스템 테마 감지 함수
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// 시스템 테마 변경 감지 및 자동 적용
function watchSystemTheme() {
    if (!window.matchMedia) return;
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeQuery.addEventListener('change', (e) => {
        const themeMode = localStorage.getItem('themeMode') || 'auto';
        
        if (themeMode === 'auto') {
            const newTheme = e.matches ? 'dark' : 'light';
            console.log('🌓 시스템 테마 변경 감지:', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
}

// 페이지 로드 시 저장된 테마 적용
function initTheme() {
    console.log('🎨 테마 초기화');
    
    let themeMode = 'auto';  // 기본값: auto (시스템 테마 따라가기)
    let theme = 'light';
    
    try {
        themeMode = localStorage.getItem('themeMode') || 'auto';
        
        if (themeMode === 'auto') {
            // 시스템 테마 감지
            theme = getSystemTheme();
            console.log('시스템 테마 사용:', theme);
        } else {
            // 수동으로 설정된 테마 사용
            theme = localStorage.getItem('theme') || 'light';
            console.log('수동 설정 테마 사용:', theme);
        }
    } catch (e) {
        console.warn('localStorage 읽기 실패:', e);
        theme = getSystemTheme();
    }
    
    console.log('적용할 테마:', theme, '(모드:', themeMode + ')');
    document.documentElement.setAttribute('data-theme', theme);
    
    // 버튼 상태 업데이트
    updateThemeButtonState(themeMode, theme);
    
    // 시스템 테마 변경 감지 시작
    watchSystemTheme();
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