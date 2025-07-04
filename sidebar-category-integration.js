// 사이드바에 카테고리 트리를 통합하는 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // EnhancedCategoryManager 초기화
    const manager = new EnhancedCategoryManager();
    
    // MY WORKSPACE 섹션 찾기
    const workspace = document.querySelector('.dynamic-dashboard, nav');
    if (!workspace) {
        console.error('Workspace section not found');
        return;
    }
    
    // 카테고리 섹션 생성
    const categorySection = document.createElement('div');
    categorySection.className = 'nav-section';
    categorySection.innerHTML = `
        <div class="nav-header" onclick="toggleSection(this)" style="margin-top: 20px; cursor: pointer;">
            <i class="fas fa-folder-tree"></i>
            <span style="margin-left: 10px;">카테고리</span>
            <i class="fas fa-chevron-down toggle-icon" style="float: right;"></i>
        </div>
        <ul class="nav-items" id="categoryTreeList" style="display: block;">
            ${manager.renderSidebarCategoryTree()}
        </ul>
    `;
    
    // MY WORKSPACE 다음에 카테고리 섹션 추가
    const contextualTools = document.querySelector('[data-section="contextual-tools"], .section-divider');
    if (contextualTools) {
        workspace.insertBefore(categorySection, contextualTools);
    } else {
        workspace.appendChild(categorySection);
    }
});

// 카테고리별 필터링 함수
window.filterByCategory = function(categoryId) {
    const manager = new EnhancedCategoryManager();
    const category = manager.findCategoryById(categoryId);
    
    if (category) {
        // 카테고리별 글 필터링
        const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
        const filteredPosts = posts.filter(post => post.category === categoryId);
        
        console.log(`Filtering posts by category: ${category.name} (${filteredPosts.length} posts)`);
        
        // 여기에 필터링된 글을 표시하는 로직 추가
        // 예: displayFilteredPosts(filteredPosts, category.name);
    }
};

// 섹션 토글 함수
window.toggleSection = function(element) {
    const section = element.parentElement;
    const items = section.querySelector('.nav-items');
    const icon = element.querySelector('.toggle-icon');
    
    if (items) {
        if (items.style.display === 'none') {
            items.style.display = 'block';
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-down');
        } else {
            items.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    }
};