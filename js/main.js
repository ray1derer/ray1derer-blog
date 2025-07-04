// 메인 JavaScript 파일

// 사이드바 섹션 토글
function toggleSection(header) {
    const section = header.parentElement;
    const items = section.querySelector('.nav-items');
    const icon = header.querySelector('.toggle-icon');
    
    if (items.style.display === 'none' || !items.style.display) {
        items.style.display = 'block';
        icon.style.transform = 'rotate(0deg)';
    } else {
        items.style.display = 'none';
        icon.style.transform = 'rotate(-90deg)';
    }
}

// 패널 표시
function showPanel(panelId) {
    // 모든 패널 숨기기
    document.querySelectorAll('.content-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // 선택된 패널 표시
    const panel = document.getElementById(`${panelId}-panel`);
    if (panel) {
        panel.classList.add('active');
    }
}

// 탭 표시 (showPanel과 동일하지만 호환성을 위해 유지)
function showTab(tabName) {
    showPanel(tabName);
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 모든 nav-items 초기 상태 설정
    document.querySelectorAll('.nav-items').forEach(items => {
        items.style.display = 'block';
    });
    
    // 첫 번째 섹션 활성화
    const firstSection = document.querySelector('.nav-section');
    if (firstSection) {
        firstSection.classList.add('active');
    }
});