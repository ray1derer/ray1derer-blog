// AWS 블로그 동적 데이터 시스템
// 하드코딩된 데이터를 동적으로 관리하는 시스템

class BlogDataManager {
    constructor() {
        this.posts = [];
        this.categories = [];
        this.tags = [];
        this.currentPage = 1;
        this.postsPerPage = 10;
        this.init();
    }

    init() {
        // 로컬 스토리지에서 데이터 로드 또는 초기 데이터 생성
        this.loadData();
        this.setupEventListeners();
    }

    loadData() {
        // 로컬 스토리지에서 데이터 로드
        const savedPosts = localStorage.getItem('blogPosts');
        const savedCategories = localStorage.getItem('blogCategories');
        const savedTags = localStorage.getItem('blogTags');

        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        } else {
            // 샘플 데이터 생성
            this.generateSampleData();
        }

        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        } else {
            this.categories = [
                { id: 1, name: 'AWS', count: 0, color: '#FF9900' },
                { id: 2, name: 'Cloud Computing', count: 0, color: '#232F3E' },
                { id: 3, name: 'DevOps', count: 0, color: '#36C' },
                { id: 4, name: 'AI/ML', count: 0, color: '#9C27B0' },
                { id: 5, name: 'Security', count: 0, color: '#F44336' }
            ];
        }

        if (savedTags) {
            this.tags = JSON.parse(savedTags);
        } else {
            this.tags = [
                'EC2', 'S3', 'Lambda', 'DynamoDB', 'RDS',
                'CloudFront', 'Route53', 'VPC', 'IAM', 'SageMaker'
            ];
        }

        this.updateCategoryCounts();
    }

    generateSampleData() {
        const titles = [
            'AWS EC2 인스턴스 최적화 가이드',
            'S3 버킷 보안 베스트 프랙티스',
            'Lambda 함수로 서버리스 아키텍처 구축하기',
            'DynamoDB vs RDS: 어떤 것을 선택해야 할까?',
            'CloudFront로 전 세계 콘텐츠 배포하기',
            'VPC 설계 패턴과 보안 고려사항',
            'AWS Cost Explorer로 비용 최적화하기',
            'EKS로 Kubernetes 클러스터 관리하기',
            'SageMaker로 ML 모델 배포하기',
            'AWS Well-Architected Framework 이해하기'
        ];

        const contents = [
            'AWS EC2는 클라우드 컴퓨팅의 핵심 서비스입니다...',
            'S3의 보안을 강화하는 다양한 방법을 알아봅니다...',
            'Lambda를 사용하면 서버 관리 없이 코드를 실행할 수 있습니다...',
            'NoSQL과 RDBMS의 차이점을 이해하고 적절한 선택을 하세요...',
            'CDN을 통해 전 세계 사용자에게 빠른 콘텐츠를 제공합니다...'
        ];

        // 50개의 샘플 포스트 생성
        for (let i = 1; i <= 50; i++) {
            const categoryId = Math.floor(Math.random() * 5) + 1;
            const randomTags = this.getRandomTags(3);
            
            this.posts.push({
                id: i,
                title: titles[i % titles.length] + ` (${i})`,
                content: contents[i % contents.length],
                excerpt: contents[i % contents.length].substring(0, 150) + '...',
                author: 'Admin',
                categoryId: categoryId,
                category: this.categories.find(c => c.id === categoryId)?.name || 'AWS',
                tags: randomTags,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 50),
                status: i % 10 === 0 ? 'draft' : 'published',
                featured: i % 7 === 0
            });
        }

        this.saveData();
    }

    getRandomTags(count) {
        const shuffled = [...this.tags].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    updateCategoryCounts() {
        this.categories.forEach(category => {
            category.count = this.posts.filter(post => post.categoryId === category.id).length;
        });
        this.saveData();
    }

    // 페이지네이션
    getPostsForPage(page = 1, perPage = 10) {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedPosts = this.posts
            .filter(post => post.status === 'published')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(startIndex, endIndex);

        return {
            posts: paginatedPosts,
            totalPosts: this.posts.filter(post => post.status === 'published').length,
            totalPages: Math.ceil(this.posts.filter(post => post.status === 'published').length / perPage),
            currentPage: page,
            perPage: perPage
        };
    }

    // 카테고리별 포스트
    getPostsByCategory(categoryId, page = 1, perPage = 10) {
        const categoryPosts = this.posts.filter(post => 
            post.categoryId === categoryId && post.status === 'published'
        );
        
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        
        return {
            posts: categoryPosts.slice(startIndex, endIndex),
            totalPosts: categoryPosts.length,
            totalPages: Math.ceil(categoryPosts.length / perPage),
            currentPage: page,
            category: this.categories.find(c => c.id === categoryId)
        };
    }

    // 검색 기능
    searchPosts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.posts.filter(post => 
            post.title.toLowerCase().includes(lowercaseQuery) ||
            post.content.toLowerCase().includes(lowercaseQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
    }

    // 통계 데이터
    getStatistics() {
        const published = this.posts.filter(post => post.status === 'published').length;
        const draft = this.posts.filter(post => post.status === 'draft').length;
        const totalViews = this.posts.reduce((sum, post) => sum + post.views, 0);
        const totalLikes = this.posts.reduce((sum, post) => sum + post.likes, 0);
        const totalComments = this.posts.reduce((sum, post) => sum + post.comments, 0);

        return {
            totalPosts: this.posts.length,
            publishedPosts: published,
            draftPosts: draft,
            totalCategories: this.categories.length,
            totalTags: this.tags.length,
            totalViews: totalViews,
            totalLikes: totalLikes,
            totalComments: totalComments,
            averageViews: Math.round(totalViews / published),
            popularPosts: this.posts
                .filter(post => post.status === 'published')
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
        };
    }

    // 데이터 저장
    saveData() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        localStorage.setItem('blogCategories', JSON.stringify(this.categories));
        localStorage.setItem('blogTags', JSON.stringify(this.tags));
    }

    // CRUD 작업
    addPost(postData) {
        const newPost = {
            id: this.posts.length + 1,
            ...postData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            likes: 0,
            comments: 0
        };
        this.posts.push(newPost);
        this.updateCategoryCounts();
        this.saveData();
        return newPost;
    }

    updatePost(id, updates) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts[index] = {
                ...this.posts[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.updateCategoryCounts();
            this.saveData();
            return this.posts[index];
        }
        return null;
    }

    deletePost(id) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts.splice(index, 1);
            this.updateCategoryCounts();
            this.saveData();
            return true;
        }
        return false;
    }

    // UI 업데이트 헬퍼
    setupEventListeners() {
        // 페이지가 로드될 때 자동으로 데이터 표시
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUI());
        } else {
            this.updateUI();
        }
    }

    updateUI() {
        // 통계 업데이트
        this.updateStatistics();
        // 포스트 목록 업데이트
        this.updatePostsList();
        // 카테고리 업데이트
        this.updateCategories();
    }

    updateStatistics() {
        const stats = this.getStatistics();
        
        // 대시보드 통계 업데이트
        const elements = {
            'total-posts': stats.totalPosts,
            'published-posts': stats.publishedPosts,
            'total-views': stats.totalViews.toLocaleString(),
            'total-categories': stats.totalCategories,
            'total-comments': stats.totalComments
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updatePostsList() {
        const postsContainer = document.getElementById('posts-list');
        if (!postsContainer) return;

        const { posts, totalPages, currentPage } = this.getPostsForPage(this.currentPage);
        
        postsContainer.innerHTML = posts.map(post => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${post.title}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${post.category}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(post.createdAt).toLocaleDateString('ko-KR')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${post.views}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">수정</a>
                </td>
            </tr>
        `).join('');

        // 페이지네이션 업데이트
        this.updatePagination(totalPages, currentPage);
    }

    updatePagination(totalPages, currentPage) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        let paginationHTML = '';
        
        // 이전 버튼
        if (currentPage > 1) {
            paginationHTML += `<button onclick="blogData.goToPage(${currentPage - 1})" class="px-3 py-2 text-sm">이전</button>`;
        }

        // 페이지 번호
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200';
            paginationHTML += `<button onclick="blogData.goToPage(${i})" class="px-3 py-2 text-sm ${activeClass}">${i}</button>`;
        }

        // 다음 버튼
        if (currentPage < totalPages) {
            paginationHTML += `<button onclick="blogData.goToPage(${currentPage + 1})" class="px-3 py-2 text-sm">다음</button>`;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    updateCategories() {
        const categoriesContainer = document.getElementById('categories-list');
        if (!categoriesContainer) return;

        categoriesContainer.innerHTML = this.categories.map(category => `
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold" style="color: ${category.color}">
                        ${category.name}
                    </h3>
                    <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        ${category.count}개
                    </span>
                </div>
            </div>
        `).join('');
    }

    goToPage(page) {
        this.currentPage = page;
        this.updatePostsList();
    }
}

// 전역 인스턴스 생성
const blogData = new BlogDataManager();

// 외부에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogDataManager;
}