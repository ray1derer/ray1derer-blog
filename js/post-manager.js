// 글 관리 모듈

class PostManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    }
    
    createPost(postData) {
        const post = {
            id: Date.now(),
            title: postData.title,
            content: postData.content,
            category: postData.category || '미분류',
            tags: postData.tags || [],
            status: postData.status || 'draft',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            views: 0,
            publishedAt: postData.publishedAt || null
        };
        
        this.posts.push(post);
        this.save();
        return post;
    }
    
    updatePost(id, updates) {
        const post = this.posts.find(p => p.id === id);
        if (post) {
            Object.assign(post, updates);
            post.updated = new Date().toISOString();
            this.save();
        }
        return post;
    }
    
    deletePost(id) {
        this.posts = this.posts.filter(p => p.id !== id);
        this.save();
    }
    
    getPost(id) {
        return this.posts.find(p => p.id === id);
    }
    
    save() {
        localStorage.setItem('blog_posts', JSON.stringify(this.posts));
    }
}

// 전역 함수들
function editPost(id) {
    const manager = new PostManager();
    const post = manager.getPost(id);
    if (post) {
        // 편집 모드로 전환
        showTab('smart-write');
        
        // 폼에 데이터 채우기
        document.getElementById('smartPostTitle').value = post.title;
        document.getElementById('smartPostCategory').value = post.category;
        document.getElementById('smartPostTags').value = post.tags.join(', ');
        document.getElementById('smartPostContent').innerHTML = post.content;
        
        // 저장 버튼 업데이트
        const publishBtn = document.querySelector('[onclick="publishPost()"]');
        if (publishBtn) {
            publishBtn.setAttribute('onclick', `updatePostAndPublish(${id})`);
            publishBtn.innerHTML = '<i class="fas fa-save"></i> 수정 완료';
        }
    }
}

function deletePost(id) {
    if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
        const manager = new PostManager();
        manager.deletePost(id);
        loadPosts();
        updateDashboard();
        showToast('글이 삭제되었습니다!');
    }
}

function updatePostAndPublish(id) {
    const title = document.getElementById('smartPostTitle').value;
    const category = document.getElementById('smartPostCategory').value;
    const tags = document.getElementById('smartPostTags').value;
    const content = document.getElementById('smartPostContent').innerHTML;
    
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    
    const manager = new PostManager();
    manager.updatePost(id, {
        title: title,
        category: category || '미분류',
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        content: content,
        status: 'published'
    });
    
    showToast('글이 수정되었습니다!');
    
    // 원래 발행 버튼으로 복원
    const publishBtn = document.querySelector('[onclick^="updatePostAndPublish"]');
    if (publishBtn) {
        publishBtn.setAttribute('onclick', 'publishPost()');
        publishBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 발행하기';
    }
    
    // 글 목록으로 이동
    showTab('posts');
    loadPosts();
    updateDashboard();
}