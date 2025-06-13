class SpaceNavigation {
    constructor() {
        this.currentPage = 'main';
        this.slideContainer = document.getElementById('slide-container');
        this.contentFrame = document.getElementById('content-frame');
        this.navSpaceship = document.querySelector('.nav-spaceship');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.isAnimating = false;
        
        // 性能優化：減少重複計算
        this.meteorInterval = null;
        
        // 滾動控制相關變量
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.lastScrollTop = 0;
        this.scrollSensitivity = 0.3; // 降低滾動敏感度
        
        this.pages = {
            left: 0,    // 第一個slide的位置
            main: 1,    // 第二個slide的位置
            right: 2    // 第三個slide的位置
        };
        
        this.init();
    }
    
    init() {
        // 初始化滑動容器位置 - 默認顯示中間頁面
        this.slideContainer.style.transform = 'translateX(-33.333%)';
        
        // 初始化導航條
        this.initNavigationBar();
        
        // 初始化各種功能
        this.bindEvents();
        this.addTouchSupport();
        this.initSpaceEffects();
        this.initScrollSnap(); // 新增滾動定格功能
        
        // 監聽所有iframe載入完成，調整高度
        const iframes = this.slideContainer.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.addEventListener('load', () => {
                this.adjustContainerHeight();
            });
        });
    }
    
    // 動態調整容器高度以適應內容
    adjustContainerHeight() {
        try {
            const iframes = this.slideContainer.querySelectorAll('iframe');
            
            // 計算可用空間，大幅增加顯示高度
            const viewportHeight = window.innerHeight;
            const headerHeight = document.querySelector('header').offsetHeight || 0;
            const navHeight = document.querySelector('.navigation-bar').offsetHeight || 0;
            const margins = 40; // 減少邊距，給內容更多空間
            
            // 計算最適合的高度 - 大幅增加顯示區域
            let optimalHeight;
            if (viewportHeight >= 800) {
                // 大螢幕：使用更大比例，幾乎全螢幕
                optimalHeight = Math.max(viewportHeight - headerHeight - navHeight - margins, 700);
            } else if (viewportHeight >= 600) {
                // 中等螢幕：使用更大比例
                optimalHeight = Math.max(viewportHeight * 0.85, 600);
            } else {
                // 小螢幕：也要確保足夠的顯示空間
                optimalHeight = Math.max(viewportHeight * 0.75, 500);
            }
            
            // 為所有 iframe 設置統一的高度
            iframes.forEach(iframe => {
                iframe.style.height = optimalHeight + 'px';
            });
            
            // 設置容器高度
            this.slideContainer.style.height = optimalHeight + 'px';
            
            console.log(`設置增強高度為: ${optimalHeight}px (視窗高度: ${viewportHeight}px)`);
            
        } catch (error) {
            console.warn('調整高度時發生錯誤:', error);
            // 設置更大的預設高度
            const defaultHeight = Math.max(window.innerHeight * 0.85, 700);
            this.slideContainer.style.height = defaultHeight + 'px';
            
            const iframes = this.slideContainer.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                iframe.style.height = defaultHeight + 'px';
            });
        }
    }
    
    // 初始化太空效果
    initSpaceEffects() {
        // 定期創建流星效果
        this.meteorInterval = setInterval(() => {
            this.createMeteor();
        }, 5000 + Math.random() * 10000); // 5-15秒隨機間隔
    }
    
    // 創建流星效果
    createMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // 隨機起始位置
        meteor.style.left = Math.random() * 50 + '%';
        meteor.style.top = Math.random() * 50 + '%';
        
        document.body.appendChild(meteor);
        
        // 觸發動畫
        setTimeout(() => {
            meteor.classList.add('meteor-animation');
        }, 100);
        
        // 清理元素
        setTimeout(() => {
            if (meteor.parentNode) {
                meteor.parentNode.removeChild(meteor);
            }
        }, 3500);
    }
    
    // 初始化導航條
    initNavigationBar() {
        // 為每個導航點添加點擊事件
        this.navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetPage = dot.getAttribute('data-page');
                if (targetPage !== this.currentPage && !this.isAnimating) {
                    this.navigateToPage(targetPage);
                }
            });
        });
        
        // 設置初始位置
        this.updateNavigationBar('main');
    }
    
    // 更新導航條狀態
    updateNavigationBar(targetPage) {
        // 更新點的活動狀態
        this.navDots.forEach(dot => {
            const dotPage = dot.getAttribute('data-page');
            if (dotPage === targetPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 移動小飛船到對應位置
        this.navSpaceship.className = `nav-spaceship position-${targetPage}`;
    }
    
    bindEvents() {
        // 鍵盤導航
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            if (this.currentPage === 'main') {
                if (e.key === 'ArrowLeft') this.navigateToPage('left');
                if (e.key === 'ArrowRight') this.navigateToPage('right');
            } else {
                if (e.key === 'Escape' || e.key === 'Backspace') {
                    this.navigateToPage('main');
                }
            }
        });
    }
    
    navigateToPage(targetPage) {
        if (this.isAnimating || targetPage === this.currentPage) return;
        
        this.isAnimating = true;
        
        // 計算滑動位置
        const targetPosition = this.pages[targetPage];
        const translateX = -targetPosition * 33.333; // 每個頁面佔33.333%
        
        // 執行滑動動畫
        this.slideContainer.style.transform = `translateX(${translateX}%)`;
        
        // 更新當前頁面
        this.currentPage = targetPage;
        
        // 更新導航條
        this.updateNavigationBar(targetPage);
        
        // 動畫完成後解除鎖定
        setTimeout(() => {
            this.isAnimating = false;
            this.adjustContainerHeight();
        }, 600); // 與CSS transition時間一致
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.slideContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.slideContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY || this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const deltaTime = endTime - startTime;
            
            // 判斷是否為有效的滑動手勢
            if (Math.abs(deltaX) > Math.abs(deltaY) && 
                Math.abs(deltaX) > 50 && 
                deltaTime < 300) {
                
                if (this.currentPage === 'main') {
                    if (deltaX > 0) {
                        // 向左滑動，顯示右頁面
                        this.navigateToPage('right');
                    } else {
                        // 向右滑動，顯示左頁面
                        this.navigateToPage('left');
                    }
                } else {
                    // 在非主頁面時，滑動返回主頁
                    this.navigateToPage('main');
                }
            }
            
            startX = 0;
            startY = 0;
            startTime = 0;
        }, { passive: true });
    }
    
    // 初始化滾動定格功能
    initScrollSnap() {
        let isThrottled = false;
        let snapTimeout = null;
        let userScrollIntent = false; // 追蹤用戶滾動意圖
        let lastScrollDirection = null;
        let scrollStartTime = null;
        
        // 監聽滾動事件
        window.addEventListener('scroll', () => {
            if (isThrottled) return;
            
            isThrottled = true;
            requestAnimationFrame(() => {
                this.handleScroll();
                isThrottled = false;
            });
        }, { passive: true });
        
        // 監聽滾動開始
        window.addEventListener('scroll', () => {
            if (!scrollStartTime) {
                scrollStartTime = Date.now();
                userScrollIntent = true;
            }
            
            clearTimeout(snapTimeout);
            
            // 較長的延遲，讓用戶有時間查看內容
            snapTimeout = setTimeout(() => {
                if (!this.isScrolling) {
                    const scrollDuration = Date.now() - scrollStartTime;
                    // 只有在快速滾動或停留時間短時才執行吸附
                    if (scrollDuration < 500 || this.shouldSnapToSection()) {
                        this.snapToNearestSection();
                    }
                    scrollStartTime = null;
                    userScrollIntent = false;
                }
            }, 300); // 增加延遲時間
        }, { passive: true });
        
        // 監聽滾動結束事件（現代瀏覽器支援）
        if ('onscrollend' in window) {
            window.addEventListener('scrollend', () => {
                const scrollDuration = scrollStartTime ? Date.now() - scrollStartTime : 0;
                if (scrollDuration < 500 || this.shouldSnapToSection()) {
                    this.snapToNearestSection();
                }
                scrollStartTime = null;
                userScrollIntent = false;
            });
        }
    }
    
    // 判斷是否應該執行吸附
    shouldSnapToSection() {
        const currentScrollTop = window.pageYOffset;
        const contentArea = document.querySelector('.content-area');
        
        if (!contentArea) return true;
        
        const contentRect = contentArea.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // 如果內容區域完全可見，不執行吸附
        if (contentRect.top <= 0 && contentRect.bottom >= viewportHeight) {
            return false;
        }
        
        // 如果用戶明顯想要查看內容區域（滾動到內容區域中間），不執行吸附
        const contentMiddle = contentArea.offsetTop + contentArea.offsetHeight / 2;
        const distanceToContentMiddle = Math.abs(currentScrollTop + viewportHeight / 2 - contentMiddle);
        
        if (distanceToContentMiddle < viewportHeight * 0.3) {
            return false; // 用戶正在查看內容區域
        }
        
        return true; // 其他情況執行吸附
    }
    
    // 處理滾動事件
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 降低滾動敏感度，避免過度觸發
        if (Math.abs(currentScrollTop - this.lastScrollTop) < 5) {
            return;
        }
        
        this.lastScrollTop = currentScrollTop;
        this.isScrolling = true;
        
        // 清除之前的timeout
        clearTimeout(this.scrollTimeout);
        
        // 設置較長的滾動結束檢測時間
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 150);
    }
    
    // 定格到最近的區域
    snapToNearestSection() {
        if (this.isScrolling) return;
        
        const header = document.querySelector('header');
        const navigationBar = document.querySelector('.navigation-bar');
        const contentArea = document.querySelector('.content-area');
        
        if (!header || !navigationBar || !contentArea) return;
        
        const currentScrollTop = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        // 定義各區域的位置
        const sections = [
            {
                element: header,
                top: 0,
                name: 'header'
            },
            {
                element: navigationBar,
                top: header.offsetTop + header.offsetHeight,
                name: 'navigation'
            },
            {
                element: contentArea,
                top: navigationBar.offsetTop + navigationBar.offsetHeight,
                name: 'content'
            }
        ];
        
        // 檢查當前是否在內容區域內
        const contentRect = contentArea.getBoundingClientRect();
        const isViewingContent = contentRect.top <= viewportHeight * 0.2 && contentRect.bottom >= viewportHeight * 0.8;
        
        if (isViewingContent) {
            console.log('用戶正在查看內容，跳過吸附');
            return; // 如果用戶正在查看內容區域，不執行吸附
        }
        
        // 找出最適合的吸附目標
        let bestMatch = null;
        let minDistance = Infinity;
        
        sections.forEach(section => {
            const distance = Math.abs(currentScrollTop - section.top);
            const threshold = viewportHeight * 0.4; // 增加閾值，減少強制吸附
            
            // 如果在合理範圍內且距離最近
            if (distance < threshold && distance < minDistance) {
                minDistance = distance;
                bestMatch = section;
            }
        });
        
        // 如果沒有找到合適的吸附目標，不強制吸附
        if (!bestMatch) {
            return;
        }
        
        // 執行平滑滾動到目標位置，但只有在距離足夠大時
        if (bestMatch && minDistance > 30) { // 增加最小距離閾值
            window.scrollTo({
                top: bestMatch.top,
                behavior: 'smooth'
            });
            
            console.log(`吸附到 ${bestMatch.name} 區域`);
        }
    }
    
    // 清理資源
    destroy() {
        if (this.meteorInterval) {
            clearInterval(this.meteorInterval);
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.spaceNavigation = new SpaceNavigation();
});

// 頁面卸載時清理資源
window.addEventListener('beforeunload', () => {
    if (window.spaceNavigation) {
        window.spaceNavigation.destroy();
    }
});