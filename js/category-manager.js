// 카테고리 관리 모듈

class CategoryManager {
    constructor() {
        this.categories = JSON.parse(localStorage.getItem('blog_categories') || '[]');
        if (this.categories.length === 0) {
            this.initializeDefaultCategories();
        }
    }
    
    initializeDefaultCategories() {
        const defaultCategories = [
            { id: 'tech', name: '기술', count: 0 },
            { id: 'ai', name: 'AI & 머신러닝', count: 0 },
            { id: 'productivity', name: '생산성', count: 0 },
            { id: 'review', name: '리뷰', count: 0 }
        ];
        localStorage.setItem('blog_categories', JSON.stringify(defaultCategories));
        this.categories = defaultCategories;
    }
    
    addCategory(name) {
        const newCategory = {
            id: Date.now().toString(),
            name: name,
            count: 0
        };
        this.categories.push(newCategory);
        this.save();
        return newCategory;
    }
    
    updateCategory(id, name) {
        const category = this.categories.find(c => c.id === id);
        if (category) {
            category.name = name;
            this.save();
        }
    }
    
    deleteCategory(id) {
        this.categories = this.categories.filter(c => c.id !== id);
        this.save();
    }
    
    save() {
        localStorage.setItem('blog_categories', JSON.stringify(this.categories));
    }
}

// 전역 함수들
function editCategory(id) {
    const manager = new CategoryManager();
    const category = manager.categories.find(c => c.id === id);
    if (category) {
        const newName = prompt('카테고리 이름 수정:', category.name);
        if (newName) {
            manager.updateCategory(id, newName);
            loadCategories();
            showToast('카테고리가 수정되었습니다!');
        }
    }
}

function deleteCategory(id) {
    if (confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
        const manager = new CategoryManager();
        manager.deleteCategory(id);
        loadCategories();
        showToast('카테고리가 삭제되었습니다!');
    }
}