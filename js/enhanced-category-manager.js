// 향상된 카테고리 관리 모듈 - 하위 카테고리 트리 구조 지원

class EnhancedCategoryManager {
    constructor() {
        this.categories = JSON.parse(localStorage.getItem('blog_categories_tree') || '[]');
        if (this.categories.length === 0) {
            this.initializeDefaultCategories();
        }
    }
    
    initializeDefaultCategories() {
        const defaultCategories = [
            { 
                id: 'tech', 
                name: '기술', 
                count: 0,
                children: [
                    { id: 'tech-ai', name: 'AI & 머신러닝', count: 0, parentId: 'tech', children: [] },
                    { id: 'tech-web', name: '웹 개발', count: 0, parentId: 'tech', children: [] },
                    { id: 'tech-mobile', name: '모바일', count: 0, parentId: 'tech', children: [] }
                ]
            },
            { 
                id: 'productivity', 
                name: '생산성', 
                count: 0,
                children: [
                    { id: 'prod-tools', name: '도구 리뷰', count: 0, parentId: 'productivity', children: [] },
                    { id: 'prod-tips', name: '팁 & 트릭', count: 0, parentId: 'productivity', children: [] }
                ]
            },
            { 
                id: 'life', 
                name: '라이프스타일', 
                count: 0,
                children: []
            }
        ];
        localStorage.setItem('blog_categories_tree', JSON.stringify(defaultCategories));
        this.categories = defaultCategories;
    }
    
    // 카테고리 추가 (부모 카테고리 지정 가능)
    addCategory(name, parentId = null) {
        const newCategory = {
            id: 'cat-' + Date.now().toString(),
            name: name,
            count: 0,
            parentId: parentId,
            children: []
        };
        
        if (parentId) {
            // 하위 카테고리로 추가
            const parent = this.findCategoryById(parentId);
            if (parent) {
                parent.children.push(newCategory);
            }
        } else {
            // 최상위 카테고리로 추가
            this.categories.push(newCategory);
        }
        
        this.save();
        return newCategory;
    }
    
    // ID로 카테고리 찾기 (재귀적)
    findCategoryById(id, categories = this.categories) {
        for (const category of categories) {
            if (category.id === id) {
                return category;
            }
            if (category.children && category.children.length > 0) {
                const found = this.findCategoryById(id, category.children);
                if (found) return found;
            }
        }
        return null;
    }
    
    // 카테고리 업데이트
    updateCategory(id, updates) {
        const category = this.findCategoryById(id);
        if (category) {
            Object.assign(category, updates);
            this.save();
        }
    }
    
    // 카테고리 삭제 (하위 카테고리 포함)
    deleteCategory(id) {
        const deleteFromArray = (categories, targetId) => {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].id === targetId) {
                    categories.splice(i, 1);
                    return true;
                }
                if (categories[i].children && deleteFromArray(categories[i].children, targetId)) {
                    return true;
                }
            }
            return false;
        };
        
        deleteFromArray(this.categories, id);
        this.save();
    }
    
    // 카테고리 이동 (드래그 앤 드롭용)
    moveCategory(categoryId, newParentId = null) {
        // 먼저 카테고리를 찾아서 제거
        const category = this.findCategoryById(categoryId);
        if (!category) return;
        
        // 현재 위치에서 제거
        this.deleteCategory(categoryId);
        
        // 새로운 위치에 추가
        category.parentId = newParentId;
        if (newParentId) {
            const parent = this.findCategoryById(newParentId);
            if (parent) {
                parent.children.push(category);
            }
        } else {
            this.categories.push(category);
        }
        
        this.save();
    }
    
    // 전체 카테고리 목록 가져오기 (플랫 구조)
    getAllCategoriesFlat(categories = this.categories, result = []) {
        for (const category of categories) {
            result.push({
                id: category.id,
                name: category.name,
                count: category.count,
                parentId: category.parentId || null,
                hasChildren: category.children && category.children.length > 0
            });
            if (category.children && category.children.length > 0) {
                this.getAllCategoriesFlat(category.children, result);
            }
        }
        return result;
    }
    
    // 카테고리 경로 가져오기 (브레드크럼용)
    getCategoryPath(categoryId) {
        const path = [];
        let current = this.findCategoryById(categoryId);
        
        while (current) {
            path.unshift(current);
            if (current.parentId) {
                current = this.findCategoryById(current.parentId);
            } else {
                break;
            }
        }
        
        return path;
    }
    
    // 저장
    save() {
        localStorage.setItem('blog_categories_tree', JSON.stringify(this.categories));
    }
    
    // 카테고리 트리 HTML 생성
    renderCategoryTree(categories = this.categories, level = 0) {
        let html = '<ul class="category-tree' + (level === 0 ? ' root' : '') + '">';
        
        for (const category of categories) {
            html += `
                <li class="category-item" data-id="${category.id}">
                    <div class="category-node" style="padding-left: ${level * 20}px">
                        ${category.children && category.children.length > 0 ? 
                            '<i class="fas fa-chevron-right toggle-icon" onclick="toggleCategoryTree(this)"></i>' : 
                            '<span class="no-toggle"></span>'
                        }
                        <i class="fas fa-folder category-icon"></i>
                        <span class="category-name" onclick="filterByCategory('${category.id}')">${category.name}</span>
                        <span class="category-count">(${category.count})</span>
                        <div class="category-actions">
                            <button onclick="editCategoryInTree('${category.id}')" class="btn-icon">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="addSubCategory('${category.id}')" class="btn-icon">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="deleteCategoryFromTree('${category.id}')" class="btn-icon">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${category.children && category.children.length > 0 ? 
                        this.renderCategoryTree(category.children, level + 1) : ''
                    }
                </li>
            `;
        }
        
        html += '</ul>';
        return html;
    }
    
    // 사이드바용 간단한 카테고리 트리 렌더링
    renderSidebarCategoryTree(categories = this.categories, level = 0) {
        let html = '';
        
        for (const category of categories) {
            const hasChildren = category.children && category.children.length > 0;
            const icon = hasChildren ? 'fa-folder-open' : 'fa-folder';
            const indent = 35 + (level * 15);
            
            html += `
                <li>
                    <a href="#" onclick="filterByCategory('${category.id}')" style="padding-left: ${indent}px;">
                        <i class="fas ${icon}" style="font-size: 12px;"></i> 
                        ${category.name} 
                        <span style="color: #7f8c8d; font-size: 11px;">(${category.count})</span>
                    </a>
                </li>
            `;
            
            if (hasChildren) {
                html += this.renderSidebarCategoryTree(category.children, level + 1);
            }
        }
        
        return html;
    }
}

// 전역 함수들
function toggleCategoryTree(element) {
    const li = element.closest('.category-item');
    const childTree = li.querySelector('.category-tree');
    
    if (childTree) {
        childTree.classList.toggle('collapsed');
        element.classList.toggle('fa-chevron-right');
        element.classList.toggle('fa-chevron-down');
    }
}

function filterByCategory(categoryId) {
    // 카테고리별 글 필터링 로직
    const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const manager = new EnhancedCategoryManager();
    const category = manager.findCategoryById(categoryId);
    
    if (category) {
        const filteredPosts = posts.filter(post => post.category === categoryId);
        displayFilteredPosts(filteredPosts, category.name);
    }
}

function editCategoryInTree(categoryId) {
    const manager = new EnhancedCategoryManager();
    const category = manager.findCategoryById(categoryId);
    
    if (category) {
        const newName = prompt('카테고리 이름 수정:', category.name);
        if (newName && newName.trim()) {
            manager.updateCategory(categoryId, { name: newName.trim() });
            updateCategoryTreeUI();
            showToast('카테고리가 수정되었습니다!');
        }
    }
}

function addSubCategory(parentId) {
    const name = prompt('새 하위 카테고리 이름:');
    if (name && name.trim()) {
        const manager = new EnhancedCategoryManager();
        manager.addCategory(name.trim(), parentId);
        updateCategoryTreeUI();
        showToast('하위 카테고리가 추가되었습니다!');
    }
}

function deleteCategoryFromTree(categoryId) {
    const manager = new EnhancedCategoryManager();
    const category = manager.findCategoryById(categoryId);
    
    if (category) {
        const hasChildren = category.children && category.children.length > 0;
        const message = hasChildren ? 
            '이 카테고리와 모든 하위 카테고리가 삭제됩니다. 계속하시겠습니까?' : 
            '정말로 이 카테고리를 삭제하시겠습니까?';
        
        if (confirm(message)) {
            manager.deleteCategory(categoryId);
            updateCategoryTreeUI();
            showToast('카테고리가 삭제되었습니다!');
        }
    }
}

function updateCategoryTreeUI() {
    const manager = new EnhancedCategoryManager();
    const treeContainer = document.getElementById('categoryTreeContainer');
    if (treeContainer) {
        treeContainer.innerHTML = manager.renderCategoryTree();
    }
    
    // 사이드바의 카테고리 트리도 업데이트
    const sidebarTree = document.getElementById('sidebarCategoryTree');
    if (sidebarTree) {
        sidebarTree.innerHTML = manager.renderCategoryTree();
    }
}