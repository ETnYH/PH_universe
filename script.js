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
            
            // 先重置所有高度到預設值，避免累積
            this.slideContainer.style.height = '';
            
            // 使用視窗高度作為基準，而不是動態計算
            const viewportHeight = window.innerHeight;
            const headerHeight = document.querySelector('header').offsetHeight || 0;
            const navHeight = document.querySelector('.navigation-bar').offsetHeight || 0;
            const availableHeight = viewportHeight - headerHeight - navHeight - 40; // 40px for margins
            
            // 為所有 iframe 設置統一的固定高度
            iframes.forEach(iframe => {
                iframe.style.height = Math.max(availableHeight, 400) + 'px';
            });
            
            // 設置容器高度為固定值
            this.slideContainer.style.height = Math.max(availableHeight, 400) + 'px';
            
            console.log(`設置固定容器高度為: ${Math.max(availableHeight, 400)}px`);
            
        } catch (error) {
            console.warn('調整高度時發生錯誤:', error);
            // 設置預設固定高度
            const defaultHeight = Math.max(window.innerHeight * 0.7, 400);
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
        
        // 監聽滾動事件
        window.addEventListener('scroll', () => {
            if (isThrottled) return;
            
            isThrottled = true;
            requestAnimationFrame(() => {
                this.handleScroll();
                isThrottled = false;
            });
        }, { passive: true });
        
        // 監聽滾動結束事件
        window.addEventListener('scrollend', () => {
            this.snapToNearestSection();
        });
        
        // 為了兼容性，也監聽滾動停止
        window.addEventListener('scroll', () => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.snapToNearestSection();
            }, 150);
        }, { passive: true });
    }
    
    // 處理滾動事件
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = currentScrollTop > this.lastScrollTop ? 'down' : 'up';
        
        // 降低滾動速度的影響
        if (Math.abs(currentScrollTop - this.lastScrollTop) < 5) {
            return; // 忽略微小的滾動
        }
        
        this.lastScrollTop = currentScrollTop;
        this.isScrolling = true;
        
        // 清除之前的timeout
        clearTimeout(this.scrollTimeout);
        
        // 設置滾動結束檢測
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
            this.snapToNearestSection();
        }, 100);
    }
    
    // 定格到最近的區域
    snapToNearestSection() {
        if (this.isScrolling) return;
        
        const header = document.querySelector('header');
        const navigationBar = document.querySelector('.navigation-bar');
        const contentArea = document.querySelector('.content-area');
        
        const headerRect = header.getBoundingClientRect();
        const navRect = navigationBar.getBoundingClientRect();
        const contentRect = contentArea.getBoundingClientRect();
        
        const viewportHeight = window.innerHeight;
        const threshold = viewportHeight * 0.3; // 30% 的視窗高度作為閾值
        
        // 判斷哪個區域最接近視窗頂部
        let targetElement = null;
        let minDistance = Infinity;
        
        const elements = [
            { element: header, rect: headerRect, name: 'header' },
            { element: navigationBar, rect: navRect, name: 'navigation' },
            { element: contentArea, rect: contentRect, name: 'content' }
        ];
        
        elements.forEach(({ element, rect, name }) => {
            const distance = Math.abs(rect.top);
            if (distance < minDistance && rect.top < threshold && rect.bottom > -threshold) {
                minDistance = distance;
                targetElement = element;
            }
        });
        
        // 如果找到目標元素，平滑滾動到該位置
        if (targetElement) {
            const targetTop = targetElement.offsetTop;
            
            // 使用平滑滾動
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
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