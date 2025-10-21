// Dữ liệu người dùng mẫu
const users = {
    'student1': { 
        password: '123456', 
        type: 'student', 
        name: 'Nguyễn Văn A', 
        class: '10A1',
        school: 'TRƯỜNG THCS & THPT NGUYỄN HUỆ'
    },
    'gv_toan': { 
        password: '123456', 
        type: 'teacher', 
        name: 'Thầy Trần Văn Toán', 
        subject: 'toan',
        school: 'TRƯỜNG THCS & THPT NGUYỄN HUỆ'
    },
    'gv_van': { 
        password: '123456', 
        type: 'teacher', 
        name: 'Cô Phạm Thị Văn', 
        subject: 'van',
        school: 'TRƯỜNG THCS & THPT NGUYỄN HUỆ'
    }
};

// Dữ liệu tin tức - ĐÃ THÊM 2 TIN MỚI
const news = [
    {
        id: 1,
        title: 'Thông tư mới về đánh giá học sinh THCS, THPT',
        content: 'Bộ GD&ĐT vừa ban hành Thông tư 22/2021/TT-BGDĐT về đánh giá học sinh THCS và THPT với nhiều thay đổi quan trọng trong cách tính điểm và xếp loại.',
        category: 'circular',
        date: '2024-01-15',
        author: 'Bộ GD&ĐT',
        icon: 'file-contract'
    },
    {
        id: 2,
        title: 'Hướng dẫn thi tốt nghiệp THPT 2024',
        content: 'Công văn hướng dẫn tổ chức kỳ thi tốt nghiệp THPT năm 2024 với những điều chỉnh mới nhất về hình thức thi và các môn thi bắt buộc.',
        category: 'regulation',
        date: '2024-01-10',
        author: 'Bộ GD&ĐT',
        icon: 'graduation-cap'
    },
    {
        id: 3,
        title: 'Lịch nghỉ Tết Nguyên đán 2024',
        content: 'Thông báo lịch nghỉ Tết Nguyên đán Giáp Thìn 2024 cho học sinh các cấp từ ngày 08/02/2024 đến hết ngày 18/02/2024.',
        category: 'event',
        date: '2024-01-05',
        author: 'Sở GD&ĐT',
        icon: 'calendar-alt'
    },
    {
        id: 4,
        title: 'Quy Định Về Sử Dụng Điện Thoại Trong Trường Học',
        content: 'Nhà trường ban hành quy định mới về việc sử dụng điện thoại di động nhằm đảm bảo môi trường học tập nghiêm túc và an toàn cho học sinh.',
        category: 'regulation',
        date: '2024-03-20',
        author: 'Ban Giám Hiệu',
        icon: 'mobile-alt',
        specialClass: 'special-1',
        
    },
    {
        id: 5,
        title: 'Lịch Nghỉ Lễ 30/4 & 1/5 Năm 2024',
        content: 'Thông báo lịch nghỉ lễ Giỗ Tổ Hùng Vương, Ngày Chiến thắng 30/4 và Ngày Quốc tế Lao động 1/5 năm 2024.',
        category: 'event',
        date: '2024-03-25',
        author: 'Phòng Đào Tạo',
        icon: 'calendar-day',
        specialClass: 'special-2',
       
    },
    {
        id: 6,
        title: 'Triển khai chương trình GDPT 2018',
        content: 'Hướng dẫn triển khai chương trình giáo dục phổ thông 2018 đối với lớp 10, với những thay đổi về nội dung và phương pháp giảng dạy.',
        category: 'circular',
        date: '2024-01-03',
        author: 'Bộ GD&ĐT',
        icon: 'book'
    }
];

// Dữ liệu diễn đàn
let forumTopics = JSON.parse(localStorage.getItem('forumTopics')) || [
    {
        id: 1,
        title: 'Cách học tốt môn Toán hình học',
        content: 'Mình đang gặp khó khăn với phần hình học không gian, đặc biệt là các bài toán về góc và khoảng cách. Có bạn nào có tips học hiệu quả không? Mình cảm ơn!',
        author: 'student1',
        authorName: 'Nguyễn Văn A',
        category: 'study',
        date: '2024-01-12',
        replies: [
            { author: 'student2', authorName: 'Trần Thị B', content: 'Bạn nên vẽ hình thật nhiều và làm bài tập thường xuyên nhé!', date: '2024-01-12' }
        ],
        views: 25
    },
    {
        id: 2,
        title: 'Kinh nghiệm ôn thi môn Văn hiệu quả',
        content: 'Chia sẻ kinh nghiệm ôn thi môn Ngữ Văn cho kỳ thi THPT sắp tới. Làm thế nào để nhớ được các tác phẩm văn học và viết bài nghị luận hay?',
        author: 'student2',
        authorName: 'Trần Thị B',
        category: 'exam',
        date: '2024-01-10',
        replies: [],
        views: 34
    }
];

// Dữ liệu điểm
let students = JSON.parse(localStorage.getItem('students')) || [
    { id: 'HS001', name: 'Nguyễn Văn A', class: '10A1' },
    { id: 'HS002', name: 'Trần Thị B', class: '10A1' },
    { id: 'HS003', name: 'Lê Văn C', class: '10A2' }
];

let scores = JSON.parse(localStorage.getItem('scores')) || {
    'HS001': {
        'toan': { '15p1': 8.5, '15p2': 9.0, '45p1': 7.5, 'giuaky': 8.0, 'cuoiky': 8.5 },
        'van': { '15p1': 7.0, '15p2': 8.0, '45p1': 7.5, 'giuaky': 8.0, 'cuoiky': 8.0 },
        'anh': { '15p1': 8.0, '15p2': 8.5, '45p1': 7.0, 'giuaky': 8.5, 'cuoiky': 9.0 }
    }
};

// DOM Elements
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-item');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const topicModal = document.getElementById('topic-modal');
const topicForm = document.getElementById('topic-form');
const newTopicBtn = document.getElementById('new-topic-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const searchScoreBtn = document.getElementById('search-score-btn');
const redirectTeacherBtn = document.getElementById('redirect-teacher-btn');

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadQuickNews();
    loadNews();
    loadForumTopics();
    initializeEventListeners();
});

// Khởi tạo event listeners
function initializeEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') + '-page';
            
            // Cập nhật active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Hiển thị page tương ứng
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
        });
    });

    // Login/Logout
    loginBtn.addEventListener('click', () => openModal(loginModal));
    logoutBtn.addEventListener('click', logout);
    document.querySelector('#login-modal .close').addEventListener('click', () => closeModal(loginModal));
    document.getElementById('cancel-login').addEventListener('click', () => closeModal(loginModal));
    loginForm.addEventListener('submit', handleLogin);

    // Diễn đàn
    newTopicBtn.addEventListener('click', () => {
        if (!checkLoginStatus()) {
            alert('Vui lòng đăng nhập để tạo chủ đề mới!');
            return;
        }
        openModal(topicModal);
    });

    document.querySelector('#topic-modal .close').addEventListener('click', () => closeModal(topicModal));
    document.getElementById('cancel-topic').addEventListener('click', () => closeModal(topicModal));
    topicForm.addEventListener('submit', handleNewTopic);

    // Lọc tin tức
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterNews(this.getAttribute('data-category'));
        });
    });

    // Tra cứu điểm
    searchScoreBtn.addEventListener('click', searchScores);

    // Chuyển hướng giáo viên
    if (redirectTeacherBtn) {
        redirectTeacherBtn.addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.type === 'teacher') {
                window.location.href = 'teacher.html';
            } else {
                alert('Vui lòng đăng nhập với tài khoản giáo viên!');
                openModal(loginModal);
            }
        });
    }

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === topicModal) closeModal(topicModal);
    });
}

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        userInfo.textContent = `Xin chào, ${currentUser.name}`;
        userInfo.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        
        // Cập nhật tên trường trong header
        document.getElementById('school-name').textContent = currentUser.school;
        document.getElementById('school-slogan').textContent = `Chào mừng ${currentUser.name}`;
        
        // Hiển thị menu giáo viên nếu là giáo viên
        if (currentUser.type === 'teacher') {
            document.querySelectorAll('.teacher-only').forEach(el => {
                el.classList.add('show');
            });
        }
        
        return true;
    } else {
        userInfo.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        
        // Reset về tên trường mặc định
        document.getElementById('school-name').textContent = 'TRƯỜNG THCS & THPT CHẤT LƯỢNG CAO';
        document.getElementById('school-slogan').textContent = 'Nơi ươm mầm tri thức - Vững bước tương lai';
        
        // Ẩn menu giáo viên
        document.querySelectorAll('.teacher-only').forEach(el => {
            el.classList.remove('show');
        });
        
        return false;
    }
}

// Xử lý đăng nhập
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    
    // Kiểm tra thông tin đăng nhập
    if (users[username] && users[username].password === password && users[username].type === userType) {
        const currentUser = {
            username: username,
            name: users[username].name,
            type: userType,
            class: users[username].class,
            subject: users[username].subject,
            school: users[username].school
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        closeModal(loginModal);
        checkLoginStatus();
        loginForm.reset();
        
        alert(`Đăng nhập thành công! Chào mừng ${currentUser.name}`);
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

// Đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    checkLoginStatus();
    alert('Đã đăng xuất thành công!');
}

// Tải tin tức nhanh
function loadQuickNews() {
    const quickNewsList = document.getElementById('quick-news-list');
    const recentNews = news.slice(0, 3);
    
    quickNewsList.innerHTML = recentNews.map(item => `
        <div class="news-item">
            <h4>${item.title}</h4>
            <p>${item.content}</p>
            <div class="news-date">${formatDate(item.date)} - ${item.author}</div>
        </div>
    `).join('');
}

// Tải tin tức đầy đủ
function loadNews() {
    const newsGrid = document.getElementById('news-grid');
    
    newsGrid.innerHTML = news.map(item => {
        let detailsHTML = '';
        
        if (item.details) {
            if (item.details.type === 'list') {
                detailsHTML = `
                    <div class="news-details">
                        <h4>${item.details.title}</h4>
                        <ul>
                            ${item.details.items.map(detail => `
                                <li><i class="fas fa-${detail.icon}" style="color: ${detail.color};"></i> ${detail.text}</li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            } else if (item.details.type === 'schedule') {
                detailsHTML = `
                    <div class="news-details">
                        <h4>${item.details.title}</h4>
                        <div class="event-schedule">
                            ${item.details.events.map(event => `
                                <div class="event-item">
                                    <span class="event-date">${event.date}</span>
                                    <span class="event-desc">${event.desc}</span>
                                </div>
                            `).join('')}
                        </div>
                        <p class="event-note"><strong>Lưu ý:</strong> ${item.details.note}</p>
                    </div>
                `;
            }
        }
        
        return `
            <div class="news-card" data-category="${item.category}">
                <div class="news-image ${item.specialClass || ''}">
                    <i class="fas fa-${item.icon}"></i>
                </div>
                <div class="news-content">
                    <span class="news-category">${getCategoryName(item.category)}</span>
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                    ${detailsHTML}
                    <div class="news-meta">
                        <span>${item.author}</span>
                        <span>${formatDate(item.date)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Lọc tin tức
function filterNews(category) {
    const newsCards = document.querySelectorAll('.news-card');
    let visibleCount = 0;
    
    newsCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Đảm bảo grid container giữ nguyên kích thước
    const newsGrid = document.getElementById('news-grid');
    if (visibleCount === 0) {
        newsGrid.innerHTML = `
            <div class="no-news-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-newspaper fa-3x" style="color: #bdc3c7; margin-bottom: 20px;"></i>
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Không có tin tức nào</h3>
                <p style="color: #666;">Không tìm thấy tin tức nào trong danh mục này.</p>
            </div>
        `;
    }
}

// Tải diễn đàn
function loadForumTopics() {
    const forumTopicsContainer = document.getElementById('forum-topics');
    
    forumTopicsContainer.innerHTML = forumTopics.map(topic => `
        <div class="topic-card">
            <div class="topic-header">
                <div>
                    <div class="topic-title">
                        ${topic.title}
                        <span class="topic-category">${getCategoryName(topic.category)}</span>
                    </div>
                    <div class="topic-author">Đăng bởi: ${topic.authorName} - ${formatDate(topic.date)}</div>
                </div>
                <div class="topic-stats">
                    <span><i class="fas fa-comment"></i> ${topic.replies.length}</span>
                    <span><i class="fas fa-eye"></i> ${topic.views}</span>
                </div>
            </div>
            <div class="topic-preview">${topic.content}</div>
        </div>
    `).join('');
}

// Xử lý tạo chủ đề mới
function handleNewTopic(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const title = document.getElementById('topic-title').value;
    const content = document.getElementById('topic-content').value;
    const category = document.getElementById('topic-category').value;
    
    const newTopic = {
        id: forumTopics.length + 1,
        title: title,
        content: content,
        author: currentUser.username,
        authorName: currentUser.name,
        category: category,
        date: new Date().toISOString().split('T')[0],
        replies: [],
        views: 0
    };
    
    forumTopics.unshift(newTopic);
    localStorage.setItem('forumTopics', JSON.stringify(forumTopics));
    
    loadForumTopics();
    closeModal(topicModal);
    topicForm.reset();
    
    alert('Đã tạo chủ đề mới thành công!');
}

// Tra cứu điểm
function searchScores() {
    const studentId = document.getElementById('score-student-id').value.trim();
    const semester = document.getElementById('score-semester').value;
    
    if (!studentId) {
        alert('Vui lòng nhập mã học sinh!');
        return;
    }
    
    const student = students.find(s => s.id === studentId);
    if (!student) {
        document.getElementById('score-results').innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <h3>Không tìm thấy học sinh</h3>
                <p>Không tìm thấy học sinh với mã số "${studentId}". Vui lòng kiểm tra lại.</p>
            </div>
        `;
        return;
    }
    
    const studentScores = scores[studentId] || {};
    
    let resultsHTML = `
        <div class="student-report">
            <div class="student-info">
                <h3>Kết Quả Học Tập - Học Kỳ ${semester}</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span>Mã học sinh:</span>
                        <span><strong>${student.id}</strong></span>
                    </div>
                    <div class="info-item">
                        <span>Họ và tên:</span>
                        <span><strong>${student.name}</strong></span>
                    </div>
                    <div class="info-item">
                        <span>Lớp:</span>
                        <span><strong>${student.class}</strong></span>
                    </div>
                </div>
            </div>
            
            <div class="subject-scores">
                <h3>Điểm Chi Tiết Theo Môn</h3>
    `;
    
    const subjects = {
        'toan': 'Toán', 'van': 'Ngữ Văn', 'anh': 'Tiếng Anh',
        'ly': 'Vật Lý', 'hoa': 'Hóa Học', 'sinh': 'Sinh Học'
    };
    
    Object.keys(subjects).forEach(subjectKey => {
        const subjectName = subjects[subjectKey];
        const subjectScores = studentScores[subjectKey] || {};
        const average = calculateSubjectAverage(subjectScores);
        
        resultsHTML += `
            <div class="subject-card">
                <div class="subject-header">
                    <span class="subject-name">${subjectName}</span>
                    <span class="subject-average ${getGradeClass(average)}">ĐTB: ${average !== null ? average.toFixed(1) : 'Chưa có'}</span>
                </div>
                <div class="score-details">
                    <div class="score-item">
                        <div class="score-label">15 phút 1</div>
                        <div class="score-value">${subjectScores['15p1'] || '-'}</div>
                    </div>
                    <div class="score-item">
                        <div class="score-label">15 phút 2</div>
                        <div class="score-value">${subjectScores['15p2'] || '-'}</div>
                    </div>
                    <div class="score-item">
                        <div class="score-label">45 phút</div>
                        <div class="score-value">${subjectScores['45p1'] || '-'}</div>
                    </div>
                    <div class="score-item">
                        <div class="score-label">Giữa kỳ</div>
                        <div class="score-value">${subjectScores['giuaky'] || '-'}</div>
                    </div>
                    <div class="score-item">
                        <div class="score-label">Cuối kỳ</div>
                        <div class="score-value">${subjectScores['cuoiky'] || '-'}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsHTML += `
            </div>
        </div>
    `;
    
    document.getElementById('score-results').innerHTML = resultsHTML;
}

// Tính điểm trung bình môn
function calculateSubjectAverage(subjectScores) {
    const weights = {
        '15p1': 1, '15p2': 1, '45p1': 2, 'giuaky': 2, 'cuoiky': 3
    };
    
    let totalWeight = 0;
    let weightedSum = 0;
    let hasScores = false;
    
    Object.keys(weights).forEach(type => {
        if (subjectScores[type]) {
            weightedSum += subjectScores[type] * weights[type];
            totalWeight += weights[type];
            hasScores = true;
        }
    });
    
    return hasScores ? weightedSum / totalWeight : null;
}

// Lấy class cho màu điểm
function getGradeClass(average) {
    if (average === null) return '';
    if (average >= 8.0) return 'grade-A';
    if (average >= 6.5) return 'grade-B';
    if (average >= 5.0) return 'grade-C';
    if (average >= 3.5) return 'grade-D';
    return 'grade-F';
}

// Utility functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function getCategoryName(category) {
    const categories = {
        'all': 'Tất Cả',
        'circular': 'Thông Tư',
        'regulation': 'Quy Định',
        'event': 'Sự Kiện',
        'study': 'Học Tập',
        'exam': 'Thi Cử',
        'life': 'Đời Sống',
        'other': 'Khác'
    };
    return categories[category] || category;
}

// Thêm CSS cho màu điểm
const style = document.createElement('style');
style.textContent = `
    .grade-A { color: #27ae60; font-weight: 600; }
    .grade-B { color: #3498db; font-weight: 600; }
    .grade-C { color: #f39c12; font-weight: 600; }
    .grade-D { color: #e67e22; font-weight: 600; }
    .grade-F { color: #e74c3c; font-weight: 600; }
`;
document.head.appendChild(style);