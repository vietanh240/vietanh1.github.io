// Dữ liệu mẫu và cấu hình
const subjects = {
    'toan': 'Toán',
    'van': 'Ngữ Văn', 
    'anh': 'Tiếng Anh',
    'ly': 'Vật Lý',
    'hoa': 'Hóa Học',
    'sinh': 'Sinh Học',
    'su': 'Lịch Sử',
    'dia': 'Địa Lý',
    'gdcd': 'GDCD',
    'theduc': 'Thể Dục'
};

const scoreWeights = {
    '15p1': 1,
    '15p2': 1, 
    '45p1': 2,
    'giuaky': 2,
    'cuoiky': 3
};

// Biến toàn cục
let students = [];
let scores = {};
let currentTeacher = null;
let currentTeacherSubjects = [];
let currentAction = null;
let currentStudentId = null;

// DOM Elements
const teacherSchoolName = document.getElementById('teacher-school-name');
const teacherSchoolSlogan = document.getElementById('teacher-school-slogan');
const teacherInfo = document.getElementById('teacher-info');
const teacherLogout = document.getElementById('teacher-logout');

// Stats elements
const totalStudentsCount = document.getElementById('total-students-count');
const totalSubjectsCount = document.getElementById('total-subjects-count');
const averageScore = document.getElementById('average-score');
const excellentStudents = document.getElementById('excellent-students');

// Tab elements
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// Students tab elements
const studentsTbody = document.getElementById('students-tbody');
const studentModal = document.getElementById('student-modal');
const addStudentBtn = document.getElementById('add-student-btn');
const studentForm = document.getElementById('student-form');
const studentSearch = document.getElementById('student-search');
const filterClass = document.getElementById('filter-class');
const filterGrade = document.getElementById('filter-grade');
const clearFilters = document.getElementById('clear-filters');
const importStudentsBtn = document.getElementById('import-students-btn');
const exportStudentsBtn = document.getElementById('export-students-btn');
const downloadTemplateBtn = document.getElementById('download-template-btn');

// Subjects tab elements
const subjectsGrid = document.getElementById('subjects-grid');

// Scores tab elements
const scoreClass = document.getElementById('score-class');
const scoreSubject = document.getElementById('score-subject');
const scoreSemester = document.getElementById('score-semester');
const scoreType = document.getElementById('score-type');
const loadScoresBtn = document.getElementById('load-scores-btn');
const scoreInputSection = document.getElementById('score-input-section');

// Reports tab elements
const reportClass = document.getElementById('report-class');
const reportSubject = document.getElementById('report-subject');
const reportSemester = document.getElementById('report-semester');
const generateReportBtn = document.getElementById('generate-report');
const exportReportBtn = document.getElementById('export-report');
const reportContent = document.getElementById('report-content');

// Modal elements
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const cancelConfirm = document.getElementById('cancel-confirm');
const confirmAction = document.getElementById('confirm-action');
const fileInput = document.getElementById('file-input');

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', function() {
    checkTeacherLogin();
    initializeTeacherData();
    initializeTabs();
    loadStudents();
    updateClassSelects();
    updateDashboardStats();
    initializeEventListeners();
    initializeScores();
    checkStudentData();
});

// Kiểm tra đăng nhập giáo viên
function checkTeacherLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.type !== 'teacher') {
        alert('Vui lòng đăng nhập với tài khoản giáo viên!');
        window.location.href = 'index.html';
        return;
    }
    
    currentTeacher = currentUser.username;
    currentTeacherSubjects = Array.isArray(currentUser.subject) 
        ? currentUser.subject 
        : [currentUser.subject];
    
    // Cập nhật thông tin giáo viên
    teacherInfo.textContent = currentUser.name;
    
    const studentCount = students.length;
    const subjectNames = currentTeacherSubjects.map(sub => subjects[sub]).join(', ');
    
    if (currentUser.school) {
        teacherSchoolName.textContent = `${currentUser.school} - QUẢN LÝ ĐIỂM`;
        teacherSchoolSlogan.textContent = `Giáo viên: ${currentUser.name} - Môn: ${subjectNames} - ${studentCount} học sinh`;
    }
}

// Khởi tạo dữ liệu giáo viên
function initializeTeacherData() {
    const allStudents = JSON.parse(localStorage.getItem('students')) || {};
    const allScores = JSON.parse(localStorage.getItem('scores')) || {};
    
    // Lấy dữ liệu của giáo viên hiện tại
    students = allStudents[currentTeacher] || [];
    scores = allScores[currentTeacher] || {};
    
    console.log(`Đã tải dữ liệu cho giáo viên ${currentTeacher}: ${students.length} học sinh`);
    
    // Khởi tạo dữ liệu mẫu nếu chưa có
    if (students.length === 0) {
        addSampleStudents();
    }
}

// Hàm lưu dữ liệu theo tài khoản
function saveDataToLocalStorage() {
    const allStudents = JSON.parse(localStorage.getItem('students')) || {};
    const allScores = JSON.parse(localStorage.getItem('scores')) || {};
    
    allStudents[currentTeacher] = students;
    allScores[currentTeacher] = scores;
    
    localStorage.setItem('students', JSON.stringify(allStudents));
    localStorage.setItem('scores', JSON.stringify(allScores));
    
    console.log(`Đã lưu dữ liệu cho giáo viên ${currentTeacher}`);
}

// Thêm hàm tạo học sinh mẫu
function addSampleStudents() {
    const sampleStudents = [
        {
            id: 'HS001',
            name: 'Nguyễn Văn A',
            dob: '2007-05-15',
            grade: '10',
            class: '10A1',
            year: '2023-2024'
        },
        {
            id: 'HS002', 
            name: 'Trần Thị B',
            dob: '2007-08-20',
            grade: '10',
            class: '10A1',
            year: '2023-2024'
        },
        {
            id: 'HS003',
            name: 'Lê Văn C',
            dob: '2007-03-10',
            grade: '10',
            class: '10A2',
            year: '2023-2024'
        }
    ];
    
    students = [...sampleStudents];
    
    // Khởi tạo điểm mẫu
    sampleStudents.forEach(student => {
        if (!scores[student.id]) {
            scores[student.id] = {};
        }
        currentTeacherSubjects.forEach(subject => {
            if (!scores[student.id][subject]) {
                scores[student.id][subject] = {
                    '15p1': null,
                    '15p2': null, 
                    '45p1': null,
                    'giuaky': null,
                    'cuoiky': null
                };
            }
        });
    });
    
    saveDataToLocalStorage();
    loadStudents();
    updateClassSelects();
    updateDashboardStats();
    
    console.log('Đã thêm học sinh mẫu');
}

// Khởi tạo tabs
function initializeTabs() {
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Cập nhật dữ liệu khi chuyển tab
            if (tabId === 'subjects') {
                loadSubjects();
            } else if (tabId === 'scores') {
                updateScoreSubjectSelect();
            } else if (tabId === 'reports') {
                updateReportSubjectSelect();
            }
        });
    });
}

// Khởi tạo event listeners
function initializeEventListeners() {
    // Modal học sinh
    addStudentBtn.addEventListener('click', () => openStudentModal());
    document.querySelector('#student-modal .close').addEventListener('click', () => closeModal(studentModal));
    document.getElementById('cancel-student').addEventListener('click', () => closeModal(studentModal));
    
    // Form submit
    studentForm.addEventListener('submit', handleStudentSubmit);
    
    // Tìm kiếm và lọc
    studentSearch.addEventListener('input', filterStudents);
    filterClass.addEventListener('change', filterStudents);
    filterGrade.addEventListener('change', filterStudents);
    clearFilters.addEventListener('click', clearAllFilters);
    
    // Import/Export
    importStudentsBtn.addEventListener('click', () => fileInput.click());
    exportStudentsBtn.addEventListener('click', exportStudentsToExcel);
    downloadTemplateBtn.addEventListener('click', downloadStudentTemplate);
    fileInput.addEventListener('change', handleFileImport);
    
    // Nhập điểm
    loadScoresBtn.addEventListener('click', function() {
    console.log('Nút Tải DS Nhập Điểm được click');
    updateScoreInputTable();
    });

    document.addEventListener('click', function(e) {
    if (e.target.closest('#excel-upload-area')) {
        document.getElementById('score-file-input').click();
    }
    });
    
    // Báo cáo
    generateReportBtn.addEventListener('click', generateReport);
    exportReportBtn.addEventListener('click', exportReportToExcel);
    
    // Đăng xuất
    teacherLogout.addEventListener('click', logout);
    
    // Modal xác nhận
    document.querySelector('#confirm-modal .close').addEventListener('click', () => closeModal(confirmModal));
    cancelConfirm.addEventListener('click', () => closeModal(confirmModal));
    confirmAction.addEventListener('click', handleConfirmAction);
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === studentModal) closeModal(studentModal);
        if (e.target === confirmModal) closeModal(confirmModal);
    });
}

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Khởi tạo dữ liệu điểm
function initializeScores() {
    let needsSave = false;
    
    students.forEach(student => {
        if (!scores[student.id]) {
            scores[student.id] = {};
            needsSave = true;
        }
        
        currentTeacherSubjects.forEach(subject => {
            if (!scores[student.id][subject]) {
                scores[student.id][subject] = {
                    '15p1': null,
                    '15p2': null,
                    '45p1': null,
                    'giuaky': null,
                    'cuoiky': null
                };
                needsSave = true;
            }
        });
    });
    
    if (needsSave) {
        saveDataToLocalStorage();
    }
}

// Modal functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
    if (modal === studentModal) {
        studentForm.reset();
        document.getElementById('modal-title').textContent = 'Thêm Học Sinh Mới';
        document.getElementById('save-button-text').textContent = 'Lưu Học Sinh';
        document.getElementById('edit-student-id').value = '';
        document.getElementById('student-id').readOnly = false;
    }
}

// Mở modal thêm/sửa học sinh
function openStudentModal(student = null) {
    if (student) {
        // Chế độ sửa
        document.getElementById('modal-title').textContent = 'Sửa Thông Tin Học Sinh';
        document.getElementById('save-button-text').textContent = 'Cập Nhật';
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-id').readOnly = true;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-dob').value = student.dob;
        document.getElementById('student-grade').value = student.grade;
        document.getElementById('student-class').value = student.class;
        document.getElementById('student-year').value = student.year || '2023-2024';
    } else {
        // Chế độ thêm
        document.getElementById('modal-title').textContent = 'Thêm Học Sinh Mới';
        document.getElementById('save-button-text').textContent = 'Lưu Học Sinh';
        document.getElementById('edit-student-id').value = '';
        document.getElementById('student-id').readOnly = false;
    }
    openModal(studentModal);
}

// Xử lý thêm/sửa học sinh
function handleStudentSubmit(e) {
    e.preventDefault();
    
    const editId = document.getElementById('edit-student-id').value;
    const studentId = document.getElementById('student-id').value.trim().toUpperCase();
    const studentName = document.getElementById('student-name').value.trim();
    const studentDob = document.getElementById('student-dob').value;
    const studentGrade = document.getElementById('student-grade').value;
    const studentClass = document.getElementById('student-class').value.trim().toUpperCase();
    const studentYear = document.getElementById('student-year').value;

    // Validate
    if (!/^HS\d{3,}$/.test(studentId)) {
        alert('Mã học sinh phải bắt đầu bằng "HS" và theo sau là số (VD: HS001)');
        return;
    }

    if (editId) {
        // Sửa học sinh
        const studentIndex = students.findIndex(s => s.id === editId);
        if (studentIndex !== -1) {
            students[studentIndex] = {
                ...students[studentIndex],
                id: studentId,
                name: studentName,
                dob: studentDob,
                grade: studentGrade,
                class: studentClass,
                year: studentYear
            };
            
            // Cập nhật key trong scores nếu mã HS thay đổi
            if (editId !== studentId) {
                scores[studentId] = scores[editId] || {};
                delete scores[editId];
            }
            
            saveDataToLocalStorage();
            loadStudents();
            updateClassSelects();
            updateDashboardStats();
            closeModal(studentModal);
            
            alert(`✅ Đã cập nhật thông tin học sinh:\n${studentName} (${studentId})`);
        }
    } else {
        // Thêm học sinh mới
        if (students.find(s => s.id === studentId)) {
            alert('Mã học sinh đã tồn tại! Vui lòng chọn mã khác.');
            return;
        }

        const newStudent = {
            id: studentId,
            name: studentName,
            dob: studentDob,
            grade: studentGrade,
            class: studentClass,
            year: studentYear
        };

        students.push(newStudent);
        
        // Khởi tạo điểm cho học sinh mới
        if (!scores[studentId]) {
            scores[studentId] = {};
        }
        
        currentTeacherSubjects.forEach(subject => {
            if (!scores[studentId][subject]) {
                scores[studentId][subject] = {
                    '15p1': null,
                    '15p2': null,
                    '45p1': null,
                    'giuaky': null,
                    'cuoiky': null
                };
            }
        });

        saveDataToLocalStorage();
        loadStudents();
        updateClassSelects();
        updateDashboardStats();
        closeModal(studentModal);
        
        alert(`✅ Đã thêm học sinh mới:\n${studentName} (${studentId})\nLớp: ${studentClass}`);
    }
}

// Tải danh sách học sinh
function loadStudents() {
    studentsTbody.innerHTML = '';
    
    const filteredStudents = getFilteredStudents();
    
    if (filteredStudents.length === 0) {
        studentsTbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-users-slash fa-2x" style="margin-bottom: 10px;"></i>
                    <p>Không có học sinh nào phù hợp</p>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        const gpa = calculateStudentGPA(student.id);
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${student.id}</strong></td>
            <td>${student.name}</td>
            <td>${formatDate(student.dob)}</td>
            <td><span class="class-badge">${student.class}</span></td>
            <td>Khối ${student.grade}</td>
            <td>${student.year || '2023-2024'}</td>
            <td class="${getGradeClass(gpa)}">${gpa > 0 ? gpa.toFixed(1) : 'Chưa có'}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="openStudentModal(${JSON.stringify(student).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        `;
        
        studentsTbody.appendChild(row);
    });
}

console.log('DANH SÁCH HỌC SINH HIỆN CÓ:', students);

// Lọc học sinh
function getFilteredStudents() {
    let filtered = [...students];
    const searchTerm = studentSearch.value.toLowerCase();
    const classFilter = filterClass.value;
    const gradeFilter = filterGrade.value;
    
    if (searchTerm) {
        filtered = filtered.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm) ||
            student.class.toLowerCase().includes(searchTerm)
        );
    }
    
    if (classFilter) {
        filtered = filtered.filter(student => student.class === classFilter);
    }
    
    if (gradeFilter) {
        filtered = filtered.filter(student => student.grade === gradeFilter);
    }
    
    return filtered.sort((a, b) => {
        if (a.class !== b.class) return a.class.localeCompare(b.class);
        return a.name.localeCompare(b.name);
    });
}

function filterStudents() {
    loadStudents();
}

function clearAllFilters() {
    studentSearch.value = '';
    filterClass.value = '';
    filterGrade.value = '';
    loadStudents();
}

// Xác nhận xóa học sinh
function confirmDeleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    currentAction = 'deleteStudent';
    currentStudentId = studentId;
    confirmMessage.textContent = `Bạn có chắc chắn muốn xóa học sinh:\n${student.name} (${studentId})?\n\nToàn bộ điểm số của học sinh này cũng sẽ bị xóa.`;
    openModal(confirmModal);
}

// Xử lý hành động xác nhận
function handleConfirmAction() {
    switch (currentAction) {
        case 'deleteStudent':
            deleteStudent(currentStudentId);
            break;
    }
    closeModal(confirmModal);
    currentAction = null;
    currentStudentId = null;
}

// Xóa học sinh
function deleteStudent(studentId) {
    const studentName = getStudentName(studentId);
    
    students = students.filter(s => s.id !== studentId);
    delete scores[studentId];
    
    saveDataToLocalStorage();
    loadStudents();
    updateClassSelects();
    updateDashboardStats();
    
    alert(`✅ Đã xóa học sinh:\n${studentName} (${studentId})`);
}

// Cập nhật dropdown chọn lớp
function updateClassSelects() {
    const classes = [...new Set(students.map(s => s.class))].sort();
    console.log('Các lớp có sẵn để cập nhật dropdown:', classes);
    // Cập nhật cho tất cả dropdown
    [filterClass, scoreClass, reportClass].forEach(select => {
        const currentValue = select.value;
        select.innerHTML = select.id === 'filter-class' ? '<option value="">Tất cả lớp</option>' : 
                          select.id === 'score-class' ? '<option value="">-- Chọn lớp --</option>' : 
                          '<option value="">Tất cả lớp</option>';
        
        classes.forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            select.appendChild(option);
        });
        
        // Giữ lại giá trị cũ nếu vẫn tồn tại
        if (classes.includes(currentValue)) {
            select.value = currentValue;
        }
    });
}

// Cập nhật dropdown môn học
function updateScoreSubjectSelect() {
    scoreSubject.innerHTML = '<option value="">-- Chọn môn --</option>';
    currentTeacherSubjects.forEach(subjectKey => {
        const option = document.createElement('option');
        option.value = subjectKey;
        option.textContent = subjects[subjectKey];
        scoreSubject.appendChild(option);
    });
}

function updateReportSubjectSelect() {
    reportSubject.innerHTML = '<option value="">Tất cả môn</option>';
    currentTeacherSubjects.forEach(subjectKey => {
        const option = document.createElement('option');
        option.value = subjectKey;
        option.textContent = subjects[subjectKey];
        reportSubject.appendChild(option);
    });
}

// Cập nhật thống kê dashboard
function updateDashboardStats() {
    totalStudentsCount.textContent = students.length;
    
    // Tính số lớp đảm nhiệm
    const classes = [...new Set(students.map(s => s.class))];
    document.getElementById('total-classes-count').textContent = classes.length;
    
    // Tính điểm trung bình
    let totalGPA = 0;
    let studentCount = 0;
    
    students.forEach(student => {
        const gpa = calculateStudentGPA(student.id);
        if (gpa > 0) {
            totalGPA += gpa;
            studentCount++;
        }
    });
    
    const avgGPA = studentCount > 0 ? totalGPA / studentCount : 0;
    averageScore.textContent = avgGPA.toFixed(1);
    
    // Đếm học sinh xuất sắc
    const excellentCount = students.filter(student => {
        const gpa = calculateStudentGPA(student.id);
        return gpa >= 8.0;
    }).length;
    
    excellentStudents.textContent = excellentCount;
}

// Tải thông tin lớp học
function loadClasses() {
    const classesGrid = document.getElementById('classes-grid');
    const classes = [...new Set(students.map(s => s.class))].sort();
    
    classesGrid.innerHTML = '';
    
    classes.forEach(className => {
        const classStudents = students.filter(s => s.class === className);
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        
        // Tính điểm trung bình của lớp
        let classGPA = 0;
        let studentCount = 0;
        
        classStudents.forEach(student => {
            const gpa = calculateStudentGPA(student.id);
            if (gpa > 0) {
                classGPA += gpa;
                studentCount++;
            }
        });
        
        const avgGPA = studentCount > 0 ? (classGPA / studentCount).toFixed(1) : 'Chưa có';
        
        classCard.innerHTML = `
            <h5><i class="fas fa-chalkboard"></i> Lớp ${className}</h5>
            <div class="class-stats">
                <div class="stat">
                    <span class="stat-value">${classStudents.length}</span>
                    <span class="stat-label">Học sinh</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${avgGPA}</span>
                    <span class="stat-label">Điểm TB</span>
                </div>
            </div>
            <div class="class-subjects">
                <span>Môn dạy: ${currentTeacherSubjects.map(sub => subjects[sub]).join(', ')}</span>
            </div>
        `;
        
        classesGrid.appendChild(classCard);
    });
}
// Cập nhật thông tin giảng dạy
function updateTeachingInfo() {
    document.getElementById('teacher-name-display').textContent = currentTeacher;
    document.getElementById('teacher-subjects-display').textContent = 
        currentTeacherSubjects.map(sub => subjects[sub]).join(', ');
    document.getElementById('total-students-display').textContent = students.length;
}

// Trong hàm initializeTabs, thêm xử lý cho tab classes
function initializeTabs() {
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Cập nhật dữ liệu khi chuyển tab
            if (tabId === 'classes') {
                loadClasses();
                updateTeachingInfo();
            } else if (tabId === 'scores') {
                updateScoreSubjectSelect();
            } else if (tabId === 'reports') {
                updateReportSubjectSelect();
            }
        });
    });
}

// Tính điểm trung bình học sinh
function calculateStudentGPA(studentId) {
    const studentScores = scores[studentId];
    if (!studentScores) return 0;
    
    let totalScore = 0;
    let subjectCount = 0;
    
    currentTeacherSubjects.forEach(subject => {
        const subjectScores = studentScores[subject];
        if (subjectScores) {
            const average = calculateSubjectAverage(subjectScores);
            if (average !== null) {
                totalScore += average;
                subjectCount++;
            }
        }
    });
    
    return subjectCount > 0 ? totalScore / subjectCount : 0;
}

// Tải môn học
function loadSubjects() {
    subjectsGrid.innerHTML = '';
    
    currentTeacherSubjects.forEach(subjectKey => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <h5><i class="fas fa-book"></i> ${subjects[subjectKey]}</h5>
            <p>2 bài 15p • 1 bài 45p • 1 GK • 1 CK</p>
        `;
        subjectsGrid.appendChild(subjectCard);
    });
}


// Cập nhật bảng nhập điểm
function updateScoreInputTable() {
    // Hàm này đã được chuyển sang score-upload.js
    console.log('Gọi hàm updateScoreInputTable từ score-upload.js');
}
// Xử lý nhập điểm
function handleScoreInput(e) {
    const input = e.target;
    const value = parseFloat(input.value);
    
    // Validate
    if (input.value && (isNaN(value) || value < 0 || value > 10)) {
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
        // Auto-save sau 2 giây không nhập
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(() => {
            saveScore(input);
        }, 2000);
    }
}

function handleScoreBlur(e) {
    const input = e.target;
    if (!input.classList.contains('invalid')) {
        saveScore(input);
    }
}

function saveScore(input) {
    const studentId = input.getAttribute('data-student');
    const subject = input.getAttribute('data-subject');
    const type = input.getAttribute('data-type');
    const value = input.value ? parseFloat(input.value) : null;
    
    if (value !== null && (value < 0 || value > 10)) {
        return;
    }
    
    // Cập nhật điểm
    if (!scores[studentId]) scores[studentId] = {};
    if (!scores[studentId][subject]) scores[studentId][subject] = {};
    scores[studentId][subject][type] = value;
    
    // Cập nhật trạng thái
    const row = input.closest('tr');
    const statusCell = row.querySelector('.score-status');
    statusCell.textContent = value !== null ? 'Đã nhập' : 'Chưa nhập';
    
    // Hiển thị thông báo auto-save
    showAutoSaveIndicator();
    
    saveDataToLocalStorage();
    updateDashboardStats();
}

function saveAllScores() {
    const scoreInputs = document.querySelectorAll('.score-input');
    let savedCount = 0;
    
    scoreInputs.forEach(input => {
        if (!input.classList.contains('invalid')) {
            saveScore(input);
            savedCount++;
        }
    });
    
    alert(`✅ Đã lưu ${savedCount} điểm số!`);
}

function showAutoSaveIndicator() {
    const indicator = document.getElementById('auto-save-indicator');
    indicator.style.display = 'block';
    setTimeout(() => {
        indicator.style.display = 'none';
    }, 3000);
}

// Tính điểm trung bình môn
function calculateSubjectAverage(subjectScores) {
    let totalWeight = 0;
    let weightedSum = 0;
    let hasScore = false;
    
    Object.keys(scoreWeights).forEach(type => {
        if (subjectScores[type] !== null && !isNaN(subjectScores[type])) {
            weightedSum += subjectScores[type] * scoreWeights[type];
            totalWeight += scoreWeights[type];
            hasScore = true;
        }
    });
    
    return hasScore ? weightedSum / totalWeight : null;
}

// Tạo báo cáo
function generateReport() {
    const selectedClass = reportClass.value;
    const selectedSubject = reportSubject.value;
    const selectedSemester = reportSemester.value;
    
    let reportStudents = students;
    if (selectedClass) {
        reportStudents = students.filter(s => s.class === selectedClass);
    }
    
    if (reportStudents.length === 0) {
        reportContent.innerHTML = `
            <div class="report-placeholder">
                <i class="fas fa-users-slash fa-3x"></i>
                <h3>Không có dữ liệu</h3>
                <p>Không tìm thấy học sinh phù hợp với tiêu chí đã chọn.</p>
            </div>
        `;
        return;
    }
    
    let reportHTML = `
        <div class="report-summary">
            <h4>Báo Cáo Tổng Quan</h4>
            <div class="summary-stats">
                <div class="stat-item">
                    <span>Số lượng học sinh:</span>
                    <span>${reportStudents.length}</span>
                </div>
                <div class="stat-item">
                    <span>Điểm trung bình:</span>
                    <span>${calculateReportAverage(reportStudents, selectedSubject).toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span>Học sinh giỏi:</span>
                    <span>${countStudentsByGrade(reportStudents, selectedSubject, 8.0)}</span>
                </div>
                <div class="stat-item">
                    <span>Học sinh yếu:</span>
                    <span>${countStudentsByGrade(reportStudents, selectedSubject, 0, 5.0)}</span>
                </div>
            </div>
        </div>
    `;
    
    if (selectedSubject) {
        reportHTML += createSubjectReport(reportStudents, selectedSubject);
    } else {
        reportHTML += createOverallReport(reportStudents);
    }
    
    reportContent.innerHTML = reportHTML;
}

// Tạo báo cáo chi tiết
function createSubjectReport(students, subject) {
    let html = `
        <div class="detailed-scores">
            <h4>Điểm Chi Tiết Môn ${subjects[subject]}</h4>
            <table class="score-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã HS</th>
                        <th>Họ Tên</th>
                        <th>Lớp</th>
                        <th>15p1</th>
                        <th>15p2</th>
                        <th>45p</th>
                        <th>GK</th>
                        <th>CK</th>
                        <th>ĐTB</th>
                        <th>Xếp Loại</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    students.forEach((student, index) => {
        const subjectScores = scores[student.id]?.[subject] || {};
        const average = calculateSubjectAverage(subjectScores);
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${student.id}</strong></td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${subjectScores['15p1'] || '-'}</td>
                <td>${subjectScores['15p2'] || '-'}</td>
                <td>${subjectScores['45p1'] || '-'}</td>
                <td>${subjectScores['giuaky'] || '-'}</td>
                <td>${subjectScores['cuoiky'] || '-'}</td>
                <td class="${getGradeClass(average)}">${average !== null ? average.toFixed(1) : '-'}</td>
                <td>${getGradeText(average)}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Export functions
function downloadStudentTemplate() {
    try {
        const templateData = [{
            'Mã HS': 'HS001',
            'Họ Tên': 'Nguyễn Văn A',
            'Ngày Sinh': '2007-05-15',
            'Lớp': '10A1',
            'Khối': '10',
            'Năm Học': '2023-2024'
        }];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template import');
        XLSX.writeFile(wb, 'template_hoc_sinh.xlsx');
        
    } catch (error) {
        alert('Lỗi khi tạo template: ' + error.message);
    }
}
// Kiểm tra dữ liệu học sinh
function checkStudentData() {
    console.log('=== KIỂM TRA DỮ LIỆU HỌC SINH ===');
    console.log('Tổng số học sinh:', students.length);
    console.log('Các lớp có sẵn:', [...new Set(students.map(s => s.class))]);
    console.log('Dữ liệu học sinh:', students);
    
    if (students.length === 0) {
        console.warn('CHÚ Ý: Không có học sinh nào trong danh sách!');
        // Tự động thêm học sinh mẫu nếu danh sách trống
        addSampleStudents();
    }
}


function exportStudentsToExcel() {
    try {
        const studentData = students.map(student => ({
            'Mã HS': student.id,
            'Họ Tên': student.name,
            'Ngày Sinh': student.dob,
            'Lớp': student.class,
            'Khối': student.grade,
            'Năm Học': student.year || '2023-2024',
            'Điểm TB': calculateStudentGPA(student.id).toFixed(1)
        }));

        const ws = XLSX.utils.json_to_sheet(studentData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách học sinh');
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        XLSX.writeFile(wb, `danh_sach_hoc_sinh_${currentUser.name}.xlsx`);
        
    } catch (error) {
        alert('Lỗi khi xuất file: ' + error.message);
    }
}

function exportReportToExcel() {
    // Tương tự như exportStudentsToExcel nhưng cho báo cáo
    alert('Tính năng xuất báo cáo Excel sẽ được triển khai!');
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('vi-VN');
}

function getStudentName(studentId) {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
}

function getScoreTypeName(type) {
    const types = {
        '15p1': '15 phút 1',
        '15p2': '15 phút 2',
        '45p1': '45 phút',
        'giuaky': 'Giữa kỳ',
        'cuoiky': 'Cuối kỳ'
    };
    return types[type] || type;
}

function getGradeClass(average) {
    if (average === null || average === 0) return '';
    if (average >= 8.0) return 'grade-A';
    if (average >= 6.5) return 'grade-B';
    if (average >= 5.0) return 'grade-C';
    if (average >= 4.0) return 'grade-D';
    return 'grade-F';
}

function getGradeText(average) {
    if (average === null || average === 0) return '-';
    if (average >= 8.0) return 'Giỏi';
    if (average >= 6.5) return 'Khá';
    if (average >= 5.0) return 'Trung bình';
    if (average >= 4.0) return 'Yếu';
    return 'Kém';
}

function calculateReportAverage(students, subject) {
    let totalScore = 0;
    let count = 0;
    
    students.forEach(student => {
        let score;
        if (subject) {
            const subjectScores = scores[student.id]?.[subject] || {};
            score = calculateSubjectAverage(subjectScores);
        } else {
            score = calculateStudentGPA(student.id);
        }
        
        if (score !== null && score > 0) {
            totalScore += score;
            count++;
        }
    });
    
    return count > 0 ? totalScore / count : 0;
}

function countStudentsByGrade(students, subject, minScore, maxScore = 10) {
    return students.filter(student => {
        let score;
        if (subject) {
            const subjectScores = scores[student.id]?.[subject] || {};
            score = calculateSubjectAverage(subjectScores);
        } else {
            score = calculateStudentGPA(student.id);
        }
        
        return score !== null && score >= minScore && score <= maxScore;
    }).length;
}

// Thêm các hàm xử lý import file (tương tự như trong code trước)
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            processImportedData(jsonData);
        } catch (error) {
            alert('Lỗi khi đọc file Excel: ' + error.message);
        }
    };
    reader.onerror = function() {
        alert('Lỗi khi đọc file. Vui lòng thử lại.');
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
}

function processImportedData(data) {
    let importedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];

    data.forEach((row, index) => {
        try {
            const studentId = (row['Mã HS'] || '').toString().trim().toUpperCase();
            const studentName = (row['Họ Tên'] || '').toString().trim();
            const studentDob = row['Ngày Sinh'];
            const studentClass = (row['Lớp'] || '').toString().trim().toUpperCase();
            const studentGrade = (row['Khối'] || '').toString();
            const studentYear = row['Năm Học'] || '2023-2024';

            if (!studentId || !studentName) {
                errors.push(`Dòng ${index + 2}: Thiếu mã HS hoặc họ tên`);
                errorCount++;
                return;
            }

            const existingIndex = students.findIndex(s => s.id === studentId);
            if (existingIndex !== -1) {
                students[existingIndex] = {
                    ...students[existingIndex],
                    name: studentName,
                    dob: studentDob || students[existingIndex].dob,
                    class: studentClass || students[existingIndex].class,
                    grade: studentGrade || students[existingIndex].grade,
                    year: studentYear
                };
                updatedCount++;
            } else {
                students.push({
                    id: studentId,
                    name: studentName,
                    dob: studentDob || '2007-01-01',
                    class: studentClass,
                    grade: studentGrade || '10',
                    year: studentYear
                });

                if (!scores[studentId]) scores[studentId] = {};
                currentTeacherSubjects.forEach(subject => {
                    if (!scores[studentId][subject]) {
                        scores[studentId][subject] = {
                            '15p1': null, '15p2': null, '45p1': null, 'giuaky': null, 'cuoiky': null
                        };
                    }
                });
                importedCount++;
            }
        } catch (error) {
            errors.push(`Dòng ${index + 2}: Lỗi xử lý`);
            errorCount++;
        }
    });

    saveDataToLocalStorage();
    loadStudents();
    updateClassSelects();
    updateDashboardStats();

    let message = '📊 KẾT QUẢ IMPORT\n';
    message += '────────────────\n';
    if (importedCount > 0) message += `✅ Thêm mới: ${importedCount} học sinh\n`;
    if (updatedCount > 0) message += `✏️ Cập nhật: ${updatedCount} học sinh\n`;
    if (errorCount > 0) message += `❌ Lỗi: ${errorCount} dòng\n`;
    
    if (errors.length > 0) {
        message += '\nCHI TIẾT LỖI:\n';
        errors.slice(0, 5).forEach(error => message += `• ${error}\n`);
    }

    alert(message);
}


// Thêm vào cuối file teacher.js
function downloadScoreTemplate() {
    const selectedClass = scoreClass.value;
    const selectedSubject = scoreSubject.value;
    const selectedType = scoreType.value;
    
    if (!selectedClass || !selectedSubject) {
        alert('Vui lòng chọn lớp và môn học trước!');
        return;
    }
    
    const classStudents = students.filter(s => s.class === selectedClass);
    
    if (classStudents.length === 0) {
        alert('Lớp được chọn không có học sinh nào!');
        return;
    }
    
    try {
        // Tạo dữ liệu cho template với đầy đủ thông tin
        const templateData = classStudents.map((student, index) => {
            const currentScore = scores[student.id]?.[selectedSubject]?.[selectedType] || '';
            
            return {
                'STT': index + 1,
                'Mã HS': student.id,
                'Họ Tên': student.name,
                'Ngày Sinh': student.dob,
                'Lớp': student.class,
                'Khối': student.grade,
                'Điểm': currentScore || '' // Để trống để người dùng nhập
            };
        });

        // Tạo workbook
        const wb = XLSX.utils.book_new();
        
        // Tạo dữ liệu cho sheet chính (kết hợp hướng dẫn + dữ liệu)
        const sheetData = [
            // Tiêu đề hệ thống
            ['HỆ THỐNG QUẢN LÝ ĐIỂM - TEMPLATE NHẬP ĐIỂM'],
            [],
            // Thông tin nhập điểm
            ['THÔNG TIN NHẬP ĐIỂM:'],
            [`Môn học: ${subjects[selectedSubject]}`],
            [`Loại điểm: ${getScoreTypeName(selectedType)}`],
            [`Lớp: ${selectedClass}`],
            [`Tổng số học sinh: ${classStudents.length}`],
            [],
            // Hướng dẫn sử dụng
            ['HƯỚNG DẪN SỬ DỤNG:'],
            ['1. Chỉ nhập điểm vào cột "Điểm" (cột G) - các ô màu vàng'],
            ['2. Điểm hợp lệ: từ 0 đến 10, có thể nhập số thập phân (ví dụ: 8.5)'],
            ['3. Để trống nếu học sinh vắng hoặc chưa có điểm'],
            ['4. TUYỆT ĐỐI KHÔNG sửa các cột khác (Mã HS, Họ Tên, Ngày Sinh, Lớp, Khối)'],
            ['5. Sau khi nhập xong, lưu file và import lại vào hệ thống'],
            [],
            // Tiêu đề bảng dữ liệu
            ['DANH SÁCH HỌC SINH VÀ ĐIỂM:'],
            ['STT', 'Mã HS', 'Họ Tên', 'Ngày Sinh', 'Lớp', 'Khối', 'Điểm'],
            // Dữ liệu học sinh
            ...templateData.map(student => [
                student['STT'],
                student['Mã HS'],
                student['Họ Tên'],
                student['Ngày Sinh'],
                student['Lớp'],
                student['Khối'],
                student['Điểm']
            ])
        ];

        // Tạo sheet từ dữ liệu
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        
        // Định dạng độ rộng cột
        const colWidths = [
            { wch: 5 },   // STT
            { wch: 10 },  // Mã HS
            { wch: 25 },  // Họ Tên
            { wch: 12 },  // Ngày Sinh
            { wch: 8 },   // Lớp
            { wch: 6 },   // Khối
            { wch: 8 }    // Điểm
        ];
        ws['!cols'] = colWidths;
        
        // Merge cells cho các tiêu đề lớn
        if (!ws['!merges']) ws['!merges'] = [];
        
        // Merge tiêu đề hệ thống (hàng 1, cột A-G)
        ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });
        // Merge thông tin nhập điểm
        ws['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 6 } });
        // Merge hướng dẫn sử dụng
        ws['!merges'].push({ s: { r: 7, c: 0 }, e: { r: 7, c: 6 } });
        // Merge tiêu đề danh sách
        ws['!merges'].push({ s: { r: 15, c: 0 }, e: { r: 15, c: 6 } });
        
        // Thêm sheet vào workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Nhập Điểm');
        
        // Tên file
        const fileName = `Nhap_Diem_${subjects[selectedSubject]}_${getScoreTypeName(selectedType)}_${selectedClass}.xlsx`;
        
        // Xuất file
        XLSX.writeFile(wb, fileName);
        
        // Hiển thị thông báo
        alert(`✅ ĐÃ TẢI TEMPLATE THÀNH CÔNG!\n\nFile: ${fileName}\nMôn: ${subjects[selectedSubject]}\nLoại điểm: ${getScoreTypeName(selectedType)}\nLớp: ${selectedClass}\nSố học sinh: ${classStudents.length}`);
        
    } catch (error) {
        console.error('Lỗi khi tạo template:', error);
        alert('❌ Lỗi khi tạo template: ' + error.message);
    }
}

// score-upload.js - JavaScript cho tính năng upload điểm

// Thêm CSS vào document
function loadUploadStyles() {
    if (!document.querySelector('#score-upload-styles')) {
        const link = document.createElement('link');
        link.id = 'score-upload-styles';
        link.rel = 'stylesheet';
        link.href = '../quanlydiem/css/score_upload.css';
        document.head.appendChild(link);
    }
}

// Thêm vào đầu file score_upload.js
function saveAllScores() {
    const scoreInputs = document.querySelectorAll('.score-input');
    let savedCount = 0;
    let errorCount = 0;
    
    scoreInputs.forEach(input => {
        if (!input.classList.contains('invalid')) {
            const studentId = input.getAttribute('data-student');
            const subject = input.getAttribute('data-subject');
            const type = input.getAttribute('data-type');
            const value = input.value ? parseFloat(input.value) : null;
            
            if (value !== null && (value < 0 || value > 10)) {
                errorCount++;
                return;
            }
            
            // Cập nhật điểm
            if (!scores[studentId]) scores[studentId] = {};
            if (!scores[studentId][subject]) scores[studentId][subject] = {};
            scores[studentId][subject][type] = value;
            
            // Cập nhật trạng thái
            const row = input.closest('tr');
            const statusCell = row.querySelector('.score-status');
            statusCell.textContent = value !== null ? 'Đã nhập' : 'Chưa nhập';
            
            savedCount++;
        } else {
            errorCount++;
        }
    });
    
    saveDataToLocalStorage();
    updateDashboardStats();
    
    let message = `✅ Đã lưu ${savedCount} điểm số!`;
    if (errorCount > 0) {
        message += `\n❌ ${errorCount} điểm không hợp lệ (phải từ 0-10)`;
    }
    
    showUploadMessage(message, errorCount > 0 ? 'warning' : 'success');
}

// Khởi tạo tính năng upload điểm
function initializeScoreUpload() {
    loadUploadStyles();
    console.log('Tính năng upload điểm đã được khởi tạo');
}

// score-upload.js - Sửa hàm downloadScoreTemplate
function downloadScoreTemplate() {
    const selectedClass = scoreClass.value;
    const selectedSubject = scoreSubject.value;
    const selectedType = scoreType.value;
    
    if (!selectedClass || !selectedSubject) {
        alert('Vui lòng chọn lớp và môn học trước!');
        return;
    }
    
    const classStudents = students.filter(s => s.class === selectedClass);
    
    if (classStudents.length === 0) {
        alert('Lớp được chọn không có học sinh nào!');
        return;
    }
    
    try {
        // Tạo dữ liệu cho template với đầy đủ thông tin
        const templateData = classStudents.map((student, index) => {
            const currentScore = scores[student.id]?.[selectedSubject]?.[selectedType] || '';
            
            return {
                'STT': index + 1,
                'Mã HS': student.id,
                'Họ Tên': student.name,
                'Ngày Sinh': student.dob,
                'Lớp': student.class,
                'Khối': student.grade,
                'Điểm': currentScore || '' // Để trống để người dùng nhập
            };
        });

        // Tạo workbook
        const wb = XLSX.utils.book_new();
        
        // Tạo dữ liệu cho sheet chính (kết hợp hướng dẫn + dữ liệu)
        const sheetData = [
            // Tiêu đề hệ thống
            ['HỆ THỐNG QUẢN LÝ ĐIỂM - TEMPLATE NHẬP ĐIỂM'],
            [],
            // Thông tin nhập điểm
            ['THÔNG TIN NHẬP ĐIỂM:'],
            [`Môn học: ${subjects[selectedSubject]}`],
            [`Loại điểm: ${getScoreTypeName(selectedType)}`],
            [`Lớp: ${selectedClass}`],
            [`Tổng số học sinh: ${classStudents.length}`],
            [],
            // Hướng dẫn sử dụng
            ['HƯỚNG DẪN SỬ DỤNG:'],
            ['1. Chỉ nhập điểm vào cột "Điểm" (cột G) - các ô màu vàng'],
            ['2. Điểm hợp lệ: từ 0 đến 10, có thể nhập số thập phân (ví dụ: 8.5)'],
            ['3. Để trống nếu học sinh vắng hoặc chưa có điểm'],
            ['4. TUYỆT ĐỐI KHÔNG sửa các cột khác (Mã HS, Họ Tên, Ngày Sinh, Lớp, Khối)'],
            ['5. Sau khi nhập xong, lưu file và import lại vào hệ thống'],
            [],
            // Tiêu đề bảng dữ liệu
            ['DANH SÁCH HỌC SINH VÀ ĐIỂM:'],
            ['STT', 'Mã HS', 'Họ Tên', 'Ngày Sinh', 'Lớp', 'Khối', 'Điểm'],
            // Dữ liệu học sinh
            ...templateData.map(student => [
                student['STT'],
                student['Mã HS'],
                student['Họ Tên'],
                student['Ngày Sinh'],
                student['Lớp'],
                student['Khối'],
                student['Điểm']
            ])
        ];

        // Tạo sheet từ dữ liệu
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        
        // Định dạng độ rộng cột
        const colWidths = [
            { wch: 5 },   // STT
            { wch: 10 },  // Mã HS
            { wch: 25 },  // Họ Tên
            { wch: 12 },  // Ngày Sinh
            { wch: 8 },   // Lớp
            { wch: 6 },   // Khối
            { wch: 8 }    // Điểm
        ];
        ws['!cols'] = colWidths;
        
        // Merge cells cho các tiêu đề lớn
        if (!ws['!merges']) ws['!merges'] = [];
        
        // Merge tiêu đề hệ thống (hàng 1, cột A-G)
        ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });
        // Merge thông tin nhập điểm
        ws['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 6 } });
        // Merge hướng dẫn sử dụng
        ws['!merges'].push({ s: { r: 7, c: 0 }, e: { r: 7, c: 6 } });
        // Merge tiêu đề danh sách
        ws['!merges'].push({ s: { r: 15, c: 0 }, e: { r: 15, c: 6 } });
        
        // Định dạng các ô
        const range = XLSX.utils.decode_range(ws['!ref']);
        
        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) ws[cellAddress] = { v: '' };
                if (!ws[cellAddress].s) ws[cellAddress].s = {};
                
                // Định dạng tiêu đề hệ thống
                if (R === 0) {
                    ws[cellAddress].s = {
                        font: { bold: true, size: 14, color: { rgb: "FF2C3E50" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        fill: { fgColor: { rgb: "FF3498DB" } }
                    };
                }
                // Định dạng tiêu đề các phần
                else if (R === 2 || R === 7 || R === 15) {
                    ws[cellAddress].s = {
                        font: { bold: true, color: { rgb: "FF2C3E50" } },
                        fill: { fgColor: { rgb: "FFECF0F1" } }
                    };
                }
                // Định dạng tiêu đề bảng dữ liệu (hàng 16)
                else if (R === 16) {
                    ws[cellAddress].s = {
                        font: { bold: true, color: { rgb: "FFFFFFFF" } },
                        fill: { fgColor: { rgb: "FF2C3E50" } },
                        border: {
                            top: { style: "thin", color: { rgb: "FF000000" } },
                            left: { style: "thin", color: { rgb: "FF000000" } },
                            bottom: { style: "thin", color: { rgb: "FF000000" } },
                            right: { style: "thin", color: { rgb: "FF000000" } }
                        },
                        alignment: { horizontal: "center", vertical: "center" }
                    };
                }
                // Định dạng cột điểm (cột G) từ hàng 17 trở đi
                else if (R >= 17 && C === 6) {
                    ws[cellAddress].s = {
                        fill: { fgColor: { rgb: "FFFFFF00" } }, // Màu vàng
                        border: {
                            top: { style: "thin", color: { rgb: "FF000000" } },
                            left: { style: "thin", color: { rgb: "FF000000" } },
                            bottom: { style: "thin", color: { rgb: "FF000000" } },
                            right: { style: "thin", color: { rgb: "FF000000" } }
                        },
                        alignment: { horizontal: "center" },
                        font: { color: { rgb: "FF000000" } }
                    };
                }
                // Định dạng dữ liệu học sinh (các cột khác từ hàng 17)
                else if (R >= 17 && C !== 6) {
                    ws[cellAddress].s = {
                        border: {
                            top: { style: "thin", color: { rgb: "FFBDC3C7" } },
                            left: { style: "thin", color: { rgb: "FFBDC3C7" } },
                            bottom: { style: "thin", color: { rgb: "FFBDC3C7" } },
                            right: { style: "thin", color: { rgb: "FFBDC3C7" } }
                        },
                        alignment: { horizontal: "left" }
                    };
                }
            }
        }
        
        // Thêm sheet vào workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Nhập Điểm');
        
        // Tên file
        const fileName = `Nhap_Diem_${subjects[selectedSubject]}_${getScoreTypeName(selectedType)}_${selectedClass}.xlsx`;
        
        // Xuất file
        XLSX.writeFile(wb, fileName);
        
        // Hiển thị thông báo
        showUploadMessage(
            `✅ ĐÃ TẢI TEMPLATE THÀNH CÔNG!\n\n` +
            `📁 File: ${fileName}\n` +
            `📊 Môn: ${subjects[selectedSubject]}\n` +
            `🎯 Loại điểm: ${getScoreTypeName(selectedType)}\n` +
            `👥 Lớp: ${selectedClass}\n` +
            `📝 Số học sinh: ${classStudents.length}\n\n` +
            `💡 Hướng dẫn:\n` +
            `• Mở file Excel, cuộn xuống phần "DANH SÁCH HỌC SINH"\n` +
            `• Chỉ nhập điểm vào cột "Điểm" (cột G - ô màu vàng)\n` +
            `• Lưu file và upload lại lên hệ thống`,
            'success'
        );
        
    } catch (error) {
        console.error('Lỗi khi tạo template:', error);
        showUploadMessage('❌ Lỗi khi tạo template: ' + error.message, 'error');
    }
}


// Hàm xử lý import file điểm
function handleScoreFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Kiểm tra phần mở rộng file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
        showUploadMessage('❌ Vui lòng chọn file Excel (.xlsx hoặc .xls)', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Tìm sheet chứa dữ liệu điểm (bỏ qua sheet hướng dẫn)
            let dataSheetName = workbook.SheetNames.find(name => name !== 'Hướng dẫn');
            if (!dataSheetName) dataSheetName = workbook.SheetNames[0];
            
            const dataSheet = workbook.Sheets[dataSheetName];
            const jsonData = XLSX.utils.sheet_to_json(dataSheet);
            
            processImportedScores(jsonData);
            
        } catch (error) {
            showUploadMessage('❌ Lỗi khi đọc file Excel: ' + error.message, 'error');
        }
    };
    reader.onerror = function() {
        showUploadMessage('❌ Lỗi khi đọc file. Vui lòng thử lại.', 'error');
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
}

// Cập nhật hàm xử lý import để đọc đúng cấu trúc mới
// Hàm xử lý import file điểm - PHIÊN BẢN ĐÃ SỬA HOÀN TOÀN
function processImportedScores(data) {
    const selectedClass = scoreClass.value;
    const selectedSubject = scoreSubject.value;
    const selectedType = scoreType.value;
    
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];
    const successUpdates = [];
    
    console.log('=== BẮT ĐẦU XỬ LÝ IMPORT ===');
    console.log('Dữ liệu import gốc:', data);
    
    if (!data || data.length === 0) {
        showUploadMessage('❌ File Excel không có dữ liệu hoặc định dạng không đúng.', 'error');
        return;
    }
    
    // Tìm các dòng có chứa mã học sinh (bắt đầu bằng HS)
    const studentData = [];
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowNumber = i + 2; // +2 vì bắt đầu từ hàng 2 trong Excel (hàng 1 là tiêu đề)
        
        // Tìm mã học sinh trong các cột có thể
        let studentId = '';
        
        // Thử các tên cột khác nhau
        if (row['Mã HS'] && row['Mã HS'].toString().trim().startsWith('HS')) {
            studentId = row['Mã HS'].toString().trim().toUpperCase();
        } else if (row['Mã Học Sinh'] && row['Mã Học Sinh'].toString().trim().startsWith('HS')) {
            studentId = row['Mã Học Sinh'].toString().trim().toUpperCase();
        } else if (row['Student ID'] && row['Student ID'].toString().trim().startsWith('HS')) {
            studentId = row['Student ID'].toString().trim().toUpperCase();
        }
        
        // Nếu tìm thấy mã học sinh
        if (studentId) {
            let scoreValue = '';
            
            // Tìm điểm trong các cột có thể
            if (row['Điểm'] !== undefined) {
                scoreValue = row['Điểm'];
            } else if (row['Score'] !== undefined) {
                scoreValue = row['Score'];
            } else if (row['Điểm số'] !== undefined) {
                scoreValue = row['Điểm số'];
            }
            
            const studentName = row['Họ Tên'] || row['Họ và Tên'] || row['Student Name'] || 'Không rõ';
            
            studentData.push({
                index: rowNumber,
                studentId: studentId,
                studentName: studentName,
                score: scoreValue,
                rowData: row
            });
        }
    }
    
    console.log('Dữ liệu học sinh đã tìm thấy:', studentData);
    
    if (studentData.length === 0) {
        // Hiển thị chi tiết debug
        let debugInfo = '=== THÔNG TIN DEBUG ===\n';
        debugInfo += `Tìm thấy ${data.length} dòng dữ liệu\n`;
        debugInfo += '5 dòng đầu tiên:\n';
        
        data.slice(0, 5).forEach((row, idx) => {
            debugInfo += `Dòng ${idx + 1}: ${JSON.stringify(row)}\n`;
        });
        
        console.log(debugInfo);
        
        showUploadMessage(
            '❌ KHÔNG TÌM THẤY DỮ LIỆU HỌC SINH!\n\n' +
            'Nguyên nhân có thể:\n' +
            '• File Excel không đúng định dạng template\n' +
            '• Mã học sinh không bắt đầu bằng "HS"\n' +
            '• Cột "Mã HS" bị đổi tên hoặc xóa\n\n' +
            '💡 GIẢI PHÁP:\n' +
            '1. Chỉ sử dụng template từ hệ thống\n' +
            '2. Không đổi tên các cột trong file\n' +
            '3. Đảm bảo mã HS có dạng: HS001, HS002...\n' +
            '4. Chỉ nhập điểm vào cột "Điểm"'
        , 'error');
        return;
    }
    
    // Xử lý từng học sinh
    studentData.forEach(student => {
        try {
            const studentId = student.studentId;
            let scoreValue = student.score;
            
            console.log(`Xử lý học sinh ${studentId}, điểm: ${scoreValue}`);
            
            // Validate student exists in selected class
            const studentObj = students.find(s => s.id === studentId && s.class === selectedClass);
            if (!studentObj) {
                errors.push(`Dòng ${student.index}: Không tìm thấy học sinh ${studentId} trong lớp ${selectedClass}`);
                errorCount++;
                return;
            }
            
            // Xử lý điểm - cho phép để trống (xóa điểm)
            if (scoreValue === '' || scoreValue === null || scoreValue === undefined) {
                const oldScore = scores[studentObj.id]?.[selectedSubject]?.[selectedType];
                
                // Đảm bảo cấu trúc dữ liệu tồn tại
                if (!scores[studentObj.id]) scores[studentObj.id] = {};
                if (!scores[studentObj.id][selectedSubject]) scores[studentObj.id][selectedSubject] = {};
                
                scores[studentObj.id][selectedSubject][selectedType] = null;
                processedCount++;
                
                if (oldScore !== null && oldScore !== undefined) {
                    updatedCount++;
                    successUpdates.push(`🗑️ ${studentObj.name} (${studentId}): Đã xóa điểm`);
                }
                return;
            }
            
            // Chuyển đổi điểm sang số
            let score;
            if (typeof scoreValue === 'string') {
                // Thay thế dấu phẩy bằng dấu chấm cho số thập phân
                scoreValue = scoreValue.replace(',', '.');
            }
            score = parseFloat(scoreValue);
            
            // Validate điểm
            if (isNaN(score)) {
                errors.push(`Dòng ${student.index}: Điểm "${scoreValue}" không phải là số hợp lệ`);
                errorCount++;
                return;
            }
            
            if (score < 0 || score > 10) {
                errors.push(`Dòng ${student.index}: Điểm ${score} không hợp lệ - phải từ 0 đến 10`);
                errorCount++;
                return;
            }
            
            // Làm tròn điểm đến 1 chữ số thập phân
            score = Math.round(score * 10) / 10;
            
            // Đảm bảo cấu trúc dữ liệu tồn tại
            if (!scores[studentId]) scores[studentId] = {};
            if (!scores[studentId][selectedSubject]) scores[studentId][selectedSubject] = {};
            
            const oldScore = scores[studentId][selectedSubject][selectedType];
            scores[studentId][selectedSubject][selectedType] = score;
            
            processedCount++;
            
            if (oldScore !== score) {
                updatedCount++;
                const changeText = oldScore !== null && oldScore !== undefined ? 
                    `${oldScore} → ${score}` : `Thêm mới: ${score}`;
                successUpdates.push(`✅ ${studentObj.name} (${studentId}): ${changeText}`);
            }
            
        } catch (error) {
            errors.push(`Dòng ${student.index}: Lỗi xử lý - ${error.message}`);
            errorCount++;
            console.error('Lỗi xử lý học sinh:', error);
        }
    });
    
    // Lưu dữ liệu
    saveDataToLocalStorage();
    updateDashboardStats();
    
    // Hiển thị kết quả chi tiết
    let message = '📊 KẾT QUẢ IMPORT ĐIỂM\n';
    message += '─────────────────────\n';
    message += `✅ Đã xử lý: ${processedCount} học sinh\n`;
    message += `✏️ Cập nhật điểm: ${updatedCount} học sinh\n`;
    if (errorCount > 0) message += `❌ Lỗi: ${errorCount} dòng\n`;
    
    if (successUpdates.length > 0) {
        message += '\n📝 CHI TIẾT CẬP NHẬT:\n';
        successUpdates.slice(0, 8).forEach(update => message += `${update}\n`);
        if (successUpdates.length > 8) message += `... và ${successUpdates.length - 8} cập nhật khác\n`;
    }
    
    if (errors.length > 0) {
        message += '\n🚨 LỖI CẦN SỬA:\n';
        errors.slice(0, 5).forEach(error => message += `• ${error}\n`);
        if (errors.length > 5) message += `• ... và ${errors.length - 5} lỗi khác\n`;
    }
    
    // Thêm hướng dẫn sửa lỗi
    if (errorCount > 0) {
        message += '\n💡 MẸO SỬA LỖI:\n';
        message += '• Kiểm tra mã học sinh có đúng định dạng HS001...\n';
        message += '• Đảm bảo điểm từ 0-10, có thể nhập 8.5\n';
        message += '• Để trống ô điểm nếu muốn xóa điểm\n';
    }
    
    showUploadMessage(message, errorCount > 0 ? 'warning' : 'success');
    
    // Cập nhật lại giao diện
    updateScoreInputTable();
}
// Hàm hiển thị bảng nhập điểm trực tiếp
function showDirectInputTable() {
    const selectedClass = scoreClass.value;
    const selectedSubject = scoreSubject.value;
    const selectedType = scoreType.value;
    const classStudents = students.filter(s => s.class === selectedClass);
    
    const typeName = getScoreTypeName(selectedType);
    const subjectName = subjects[selectedSubject];
    
    let tableHTML = `
        <div class="direct-input-table">
            <div class="table-header">
                <h5><i class="fas fa-edit"></i> Nhập điểm trực tiếp - ${typeName} - ${subjectName} - Lớp ${selectedClass}</h5>
                <button class="btn btn-sm btn-outline" onclick="hideDirectInputTable()">
                    <i class="fas fa-times"></i> Đóng
                </button>
            </div>
            <div class="table-container">
                <table class="score-input-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã HS</th>
                            <th>Họ Tên</th>
                            <th>Lớp</th>
                            <th>Điểm ${typeName}</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    classStudents.forEach((student, index) => {
        const currentScore = scores[student.id]?.[selectedSubject]?.[selectedType] || '';
        const status = currentScore !== '' ? 'Đã nhập' : 'Chưa nhập';
        
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${student.id}</strong></td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>
                    <input type="number" min="0" max="10" step="0.1" 
                           class="score-input" 
                           data-student="${student.id}" 
                           data-subject="${selectedSubject}"
                           data-type="${selectedType}"
                           value="${currentScore}"
                           placeholder="0.0">
                </td>
                <td class="score-status">${status}</td>
            </tr>
        `;
    });
    
    tableHTML += `
                    </tbody>
                </table>
            </div>
            <div class="table-actions">
                <button class="btn btn-success" onclick="saveAllScores()">
                    <i class="fas fa-save"></i> Lưu Tất Cả Điểm
                </button>
                <div class="auto-save-indicator" id="auto-save-indicator">
                    <i class="fas fa-check"></i> Đã lưu tự động
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('direct-input-section').innerHTML = tableHTML;
    document.getElementById('direct-input-section').style.display = 'block';
    
    // Thêm event listeners cho các ô nhập điểm
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        input.addEventListener('input', handleScoreInput);
        input.addEventListener('blur', handleScoreBlur);
    });
}

// Hàm ẩn bảng nhập điểm trực tiếp
function hideDirectInputTable() {
    document.getElementById('direct-input-section').style.display = 'none';
}

// Hàm hiển thị thông báo upload

const notificationStack = [];

function showUploadMessage(message, type = 'info') {
    // Tạo ID duy nhất cho thông báo
    const notificationId = 'notification-' + Date.now();
    
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `upload-notification ${type}`;
    notification.style.zIndex = 1000 + notificationStack.length;
    
    notification.innerHTML = `
        <div class="notification-content ${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <pre>${message}</pre>
        </div>
    `;
    
    // Thêm CSS cho notification nếu chưa có
    if (!document.querySelector('#upload-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'upload-notification-styles';
        style.textContent = `
            .upload-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                max-width: 500px;
                border-left: 4px solid #3498db;
                animation: slideInRight 0.3s ease;
            }
            .upload-notification.success {
                border-left-color: #27ae60;
            }
            .upload-notification.error {
                border-left-color: #e74c3c;
            }
            .upload-notification.warning {
                border-left-color: #f39c12;
            }
            .notification-content {
                padding: 15px;
                display: flex;
                align-items: flex-start;
                gap: 10px;
            }
            .notification-content i {
                margin-top: 2px;
                flex-shrink: 0;
                font-size: 18px;
            }
            .notification-content.success i {
                color: #27ae60;
            }
            .notification-content.error i {
                color: #e74c3c;
            }
            .notification-content.warning i {
                color: #f39c12;
            }
            .notification-content pre {
                margin: 0;
                white-space: pre-wrap;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 14px;
                line-height: 1.4;
                color: #2c3e50;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Thêm vào stack và hiển thị
    notificationStack.push(notificationId);
    document.body.appendChild(notification);
    
    // Tính toán vị trí để không chồng chéo
    updateNotificationPositions();
    
    // Tự động xóa sau 6 giây
    setTimeout(() => {
        removeNotification(notificationId);
    }, 6000);
}

// Hàm cập nhật vị trí các thông báo
function updateNotificationPositions() {
    const notifications = document.querySelectorAll('.upload-notification');
    const baseTop = 20;
    const spacing = 10;
    
    notifications.forEach((notification, index) => {
        const topPosition = baseTop + (index * (notification.offsetHeight + spacing));
        notification.style.top = topPosition + 'px';
        notification.style.zIndex = 1000 + index;
    });
}

// Hàm xóa thông báo
function removeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        // Hiệu ứng fade out
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            notification.remove();
            
            // Xóa khỏi stack
            const index = notificationStack.indexOf(notificationId);
            if (index > -1) {
                notificationStack.splice(index, 1);
            }
            
            // Cập nhật lại vị trí các thông báo còn lại
            updateNotificationPositions();
        }, 300);
    }
}

// Cập nhật hàm updateScoreInputTable để sử dụng tính năng upload
function updateScoreInputTable() {
    console.log('Hàm updateScoreInputTable được gọi');
    
    const selectedClass = scoreClass.value;
    const selectedSubject = scoreSubject.value;
    const selectedType = scoreType.value;
    
    console.log('Lớp được chọn:', selectedClass);
    console.log('Môn được chọn:', selectedSubject);
    console.log('Loại điểm:', selectedType);
    console.log('Tổng số học sinh:', students.length);
    
    scoreInputSection.innerHTML = '';
    
    if (!selectedClass || !selectedSubject) {
        console.log('Chưa chọn đủ lớp hoặc môn');
        scoreInputSection.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-clipboard-list fa-3x"></i>
                <h3>Chọn lớp và môn học để nhập điểm</h3>
                <p>Hãy chọn lớp, môn học và loại điểm để bắt đầu nhập điểm cho học sinh.</p>
            </div>
        `;
        return;
    }
    
    const classStudents = students.filter(s => s.class === selectedClass);
    console.log('Số học sinh trong lớp:', classStudents.length);
    
    if (classStudents.length === 0) {
        console.log('Không có học sinh trong lớp được chọn');
        scoreInputSection.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-users-slash fa-3x"></i>
                <h3>Không có học sinh trong lớp này</h3>
                <p>Lớp ${selectedClass} hiện không có học sinh nào.</p>
                <button class="btn btn-primary" onclick="addSampleStudents(); updateScoreInputTable();">
                    <i class="fas fa-plus"></i> Thêm Học Sinh Mẫu
                </button>
            </div>
        `;
        return;
    }
    
    const typeName = getScoreTypeName(selectedType);
    const subjectName = subjects[selectedSubject];
    
    // Tạo giao diện với nút tải template
    // Trong phần HTML của updateScoreInputTable, cập nhật phần hướng dẫn:
scoreInputSection.innerHTML = `
    <div class="score-upload-section">
        <div class="upload-header">
            <h4><i class="fas fa-file-excel"></i> Nhập Điểm ${typeName} - ${subjectName} - Lớp ${selectedClass}</h4>
            <p>Chọn phương thức nhập điểm phù hợp:</p>
        </div>
        
        <div class="upload-options">
            <div class="upload-option">
                <div class="option-header">
                    <i class="fas fa-download fa-2x"></i>
                    <h5>Nhập bằng Excel</h5>
                </div>
                <p>Tải template Excel về, nhập điểm và upload lại</p>
                <button class="btn btn-success" onclick="downloadScoreTemplate()">
                    <i class="fas fa-file-download"></i> Tải Template Excel
                </button>
                <div class="upload-area" id="excel-upload-area">
                    <i class="fas fa-cloud-upload-alt fa-2x"></i>
                    <p>Kéo file Excel đã nhập điểm vào đây hoặc</p>
                    <button class="btn btn-outline" onclick="document.getElementById('score-file-input').click()">
                        <i class="fas fa-folder-open"></i> Chọn File
                    </button>
                    <input type="file" id="score-file-input" accept=".xlsx, .xls" style="display: none;" onchange="handleScoreFileImport(event)">
                </div>
            </div>
            
            <div class="upload-option">
                <div class="option-header">
                    <i class="fas fa-edit fa-2x"></i>
                    <h5>Nhập trực tiếp</h5>
                </div>
                <p>Nhập điểm trực tiếp trên bảng</p>
                <button class="btn btn-primary" onclick="showDirectInputTable()">
                    <i class="fas fa-table"></i> Hiện Bảng Nhập Điểm
                </button>
            </div>
        </div>
        
        <div class="upload-instructions">
            <h5><i class="fas fa-info-circle"></i> Hướng dẫn nhập điểm bằng Excel:</h5>
            <ul>
                <li><strong>Bước 1:</strong> Tải template Excel về máy</li>
                <li><strong>Bước 2:</strong> Mở file, cuộn xuống phần "DANH SÁCH HỌC SINH VÀ ĐIỂM"</li>
                <li><strong>Bước 3:</strong> Chỉ nhập điểm vào cột <strong>"Điểm"</strong> (cột G - ô màu vàng)</li>
                <li><strong>Bước 4:</strong> Điểm hợp lệ: từ 0 đến 10 (có thể nhập 8.5, 9.0, v.v.)</li>
                <li><strong>Bước 5:</strong> Lưu file và upload lại lên hệ thống</li>
                <li><strong>Lưu ý:</strong> KHÔNG sửa các cột khác (Mã HS, Họ Tên, Ngày Sinh, Lớp, Khối)</li>
            </ul>
        </div>
        
        <div class="direct-input-section" id="direct-input-section" style="display: none;">
            <!-- Bảng nhập điểm trực tiếp sẽ được thêm ở đây -->
        </div>
    </div>
`;
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    initializeScoreUpload();
});

// score-upload.js - Thêm các hàm xử lý drag and drop

// Hàm khởi tạo drag and drop
function initializeDragAndDrop() {
    const uploadArea = document.getElementById('excel-upload-area');
    
    if (uploadArea) {
        // Ngăn chặn hành vi mặc định
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight khi kéo file vào
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        // Xử lý khi thả file
        uploadArea.addEventListener('drop', handleDrop, false);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    const uploadArea = document.getElementById('excel-upload-area');
    uploadArea.style.borderColor = '#3498db';
    uploadArea.style.backgroundColor = '#e8f4fd';
    uploadArea.style.transform = 'scale(1.02)';
}

function unhighlight() {
    const uploadArea = document.getElementById('excel-upload-area');
    uploadArea.style.borderColor = '#bdc3c7';
    uploadArea.style.backgroundColor = '';
    uploadArea.style.transform = 'scale(1)';
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        handleDroppedFile(files[0]);
    }
}

function handleDroppedFile(file) {
    // Kiểm tra loại file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
        showUploadMessage('❌ Vui lòng chọn file Excel (.xlsx hoặc .xls)', 'error');
        return;
    }
    
    // Hiển thị thông báo đang xử lý
    showUploadMessage('📤 Đang xử lý file: ' + file.name, 'info');
    
    // Xử lý file
    handleScoreFile(file);
}

// Hàm xử lý file (dùng chung cho cả click và drag drop)
function handleScoreFile(file) {
    // Hiển thị tiến trình
    const progressInterval = showUploadProgress(file.name);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Dừng progress bar
        if (progressInterval) clearInterval(progressInterval);
        
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Tìm sheet chứa dữ liệu
            let dataSheetName = workbook.SheetNames.find(name => 
                name.includes('Nhập Điểm') || name.includes('Điểm') || name === 'Sheet1'
            );
            if (!dataSheetName) dataSheetName = workbook.SheetNames[0];
            
            const dataSheet = workbook.Sheets[dataSheetName];
            const jsonData = XLSX.utils.sheet_to_json(dataSheet);
            
            // DEBUG: Hiển thị thông tin file
            debugExcelData(jsonData);
            
            processImportedScores(jsonData);
            
        } catch (error) {
            showUploadMessage('❌ Lỗi khi đọc file Excel: ' + error.message, 'error');
        }
        
        // Khôi phục giao diện upload
        setTimeout(() => {
            updateScoreInputTable();
        }, 1000);
    };
    
    reader.onerror = function() {
        if (progressInterval) clearInterval(progressInterval);
        showUploadMessage('❌ Lỗi khi đọc file. Vui lòng thử lại.', 'error');
        setTimeout(() => {
            updateScoreInputTable();
        }, 2000);
    };
    
    reader.readAsArrayBuffer(file);
}
// Cập nhật hàm handleScoreFileImport để dùng hàm chung
function handleScoreFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Kiểm tra phần mở rộng file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
        showUploadMessage('❌ Vui lòng chọn file Excel (.xlsx hoặc .xls)', 'error');
        return;
    }
    
    handleScoreFile(file);
    event.target.value = ''; // Reset input file
}

// Cập nhật hàm updateScoreInputTable để thêm drag and drop
function updateScoreInputTable() {
    console.log('Hàm updateScoreInputTable được gọi');
    
    const selectedClass = scoreClass.value;
    const selectedSubject = scoreSubject.value;
    const selectedType = scoreType.value;
    
    console.log('Lớp được chọn:', selectedClass);
    console.log('Môn được chọn:', selectedSubject);
    console.log('Loại điểm:', selectedType);
    console.log('Tổng số học sinh:', students.length);
    
    scoreInputSection.innerHTML = '';
    
    if (!selectedClass || !selectedSubject) {
        console.log('Chưa chọn đủ lớp hoặc môn');
        scoreInputSection.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-clipboard-list fa-3x"></i>
                <h3>Chọn lớp và môn học để nhập điểm</h3>
                <p>Hãy chọn lớp, môn học và loại điểm để bắt đầu nhập điểm cho học sinh.</p>
            </div>
        `;
        return;
    }
    
    const classStudents = students.filter(s => s.class === selectedClass);
    console.log('Số học sinh trong lớp:', classStudents.length);
    
    if (classStudents.length === 0) {
        console.log('Không có học sinh trong lớp được chọn');
        scoreInputSection.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-users-slash fa-3x"></i>
                <h3>Không có học sinh trong lớp này</h3>
                <p>Lớp ${selectedClass} hiện không có học sinh nào.</p>
                <button class="btn btn-primary" onclick="addSampleStudents(); updateScoreInputTable();">
                    <i class="fas fa-plus"></i> Thêm Học Sinh Mẫu
                </button>
            </div>
        `;
        return;
    }
    
    const typeName = getScoreTypeName(selectedType);
    const subjectName = subjects[selectedSubject];
    
    // Tạo giao diện với nút tải template
    scoreInputSection.innerHTML = `
        <div class="score-upload-section">
            <div class="upload-header">
                <h4><i class="fas fa-file-excel"></i> Nhập Điểm ${typeName} - ${subjectName} - Lớp ${selectedClass}</h4>
                <p>Chọn phương thức nhập điểm phù hợp:</p>
            </div>
            
            <div class="upload-options">
                <div class="upload-option">
                    <div class="option-header">
                        <i class="fas fa-download fa-2x"></i>
                        <h5>Nhập bằng Excel</h5>
                    </div>
                    <p>Tải template Excel về, xóa phần thừa, nhập điểm và upload lại</p>
                    <button class="btn btn-success" onclick="downloadScoreTemplate()">
                        <i class="fas fa-file-download"></i> Tải Template Excel
                    </button>
                    <div class="upload-area" id="excel-upload-area">
                        <i class="fas fa-cloud-upload-alt fa-2x"></i>
                        <p><strong>Kéo file Excel vào đây</strong></p>
                        <p class="upload-hint">hoặc</p>
                        <button style ="background: #3498db" class="btn btn-outline" onclick="document.getElementById('score-file-input').click()">
                            <i class="fas fa-folder-open"></i> Chọn File từ máy tính
                        </button>
                        <input type="file" id="score-file-input" accept=".xlsx, .xls" style="display: none;" onchange="handleScoreFileImport(event)">
                    </div>
                </div>
                
                <div class="upload-option">
                    <div class="option-header">
                        <i class="fas fa-edit fa-2x"></i>
                        <h5>Nhập trực tiếp</h5>
                    </div>
                    <p>Nhập điểm trực tiếp trên bảng</p>
                    <button class="btn btn-primary" onclick="showDirectInputTable()">
                        <i class="fas fa-table"></i> Hiện Bảng Nhập Điểm
                    </button>
                </div>
            </div>
            
            <div class="upload-instructions">
                <h5><i class="fas fa-info-circle"></i> Hướng dẫn nhập điểm bằng Excel:</h5>
                <ul>
                    <li><strong>Bước 1:</strong> Tải template Excel về máy</li>
                    <li><strong>Bước 2:</strong> Mở file, cuộn xuống phần "DANH SÁCH HỌC SINH VÀ ĐIỂM"</li>
                    <li><strong>Bước 2:</strong> Xóa hết từ phần"DANH SÁCH HỌC SINH VÀ ĐIỂM" trở về trước</li>
                    <li><strong>Bước 3:</strong> Chỉ nhập điểm vào cột <strong>"Điểm"</strong> (cột G)</li>
                    <li><strong>Bước 4:</strong> Điểm hợp lệ: từ 0 đến 10 (có thể nhập 8.5, 9.0, v.v.)</li>
                    <li><strong>Bước 5:</strong> Lưu file và kéo thả vào khung bên trên hoặc chọn file</li>
                    <li><strong>Lưu ý:</strong> KHÔNG sửa các cột khác (Mã HS, Họ Tên, Ngày Sinh, Lớp, Khối)</li>
                </ul>
            </div>
            
            <div class="direct-input-section" id="direct-input-section" style="display: none;">
                <!-- Bảng nhập điểm trực tiếp sẽ được thêm ở đây -->
            </div>
        </div>
    `;
    
    // Khởi tạo drag and drop sau khi tạo giao diện
    setTimeout(() => {
        initializeDragAndDrop();
    }, 100);
}

// Cập nhật hàm initializeScoreUpload
function initializeScoreUpload() {
    loadUploadStyles();
    console.log('Tính năng upload điểm đã được khởi tạo');
}
function showUploadProgress(filename) {
    const uploadArea = document.getElementById('excel-upload-area');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <div class="upload-loading">
                <i class="fas fa-spinner"></i>
                Đang xử lý: ${filename}
            </div>
            <div class="upload-progress">
                <div class="upload-progress-bar" id="upload-progress-bar"></div>
            </div>
        `;
        
        // Hiệu ứng progress bar
        const progressBar = document.getElementById('upload-progress-bar');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 90) progress = 90;
            progressBar.style.width = progress + '%';
        }, 200);
        
        return interval;
    }
    return null;
}

// Cập nhật hàm handleScoreFile
function handleScoreFile(file) {
    // Hiển thị tiến trình
    const progressInterval = showUploadProgress(file.name);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Dừng progress bar
        if (progressInterval) clearInterval(progressInterval);
        
        // Hoàn thành progress bar
        const progressBar = document.getElementById('upload-progress-bar');
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.style.background = '#27ae60';
        }
        
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Tìm sheet chứa dữ liệu
            let dataSheetName = workbook.SheetNames.find(name => name.includes('Nhập Điểm') || name.includes('Điểm'));
            if (!dataSheetName) dataSheetName = workbook.SheetNames[0];
            
            const dataSheet = workbook.Sheets[dataSheetName];
            const jsonData = XLSX.utils.sheet_to_json(dataSheet);
            
            // DEBUG: Hiển thị dữ liệu import
            debugImportData(jsonData);
            
            // Khôi phục giao diện upload sau 1 giây
            setTimeout(() => {
                updateScoreInputTable();
            }, 1000);
            
            processImportedScores(jsonData);
            
        } catch (error) {
            showUploadMessage('❌ Lỗi khi đọc file Excel: ' + error.message, 'error');
            // Khôi phục giao diện upload
            setTimeout(() => {
                updateScoreInputTable();
            }, 2000);
        }
    };
    reader.onerror = function() {
        if (progressInterval) clearInterval(progressInterval);
        showUploadMessage('❌ Lỗi khi đọc file. Vui lòng thử lại.', 'error');
        // Khôi phục giao diện upload
        setTimeout(() => {
            updateScoreInputTable();
        }, 2000);
    };
    reader.readAsArrayBuffer(file);
}

// Hàm debug chi tiết để kiểm tra dữ liệu Excel
function debugExcelData(data) {
    console.log('=== DEBUG EXCEL DATA ===');
    console.log(`Tổng số dòng: ${data.length}`);
    
    if (data.length > 0) {
        console.log('Cấu trúc dòng đầu tiên:', Object.keys(data[0]));
        
        data.slice(0, 3).forEach((row, index) => {
            console.log(`Dòng ${index + 1}:`, row);
        });
    }
    
    // Tìm tất cả các khóa (column names) có trong dữ liệu
    const allKeys = new Set();
    data.forEach(row => {
        Object.keys(row).forEach(key => allKeys.add(key));
    });
    console.log('Tất cả các cột trong file:', Array.from(allKeys));
}

// Hàm debug dữ liệu học sinh
function debugStudentData() {
    const selectedClass = scoreClass.value;
    console.log('=== DEBUG STUDENT DATA ===');
    console.log('Lớp được chọn:', selectedClass);
    console.log('Tổng số học sinh trong hệ thống:', students.length);
    console.log('Học sinh trong lớp', selectedClass + ':', students.filter(s => s.class === selectedClass));
    console.log('Dữ liệu điểm:', scores);
}

// Gọi hàm debug khi cần
// debugStudentData();

// Hàm debug để kiểm tra dữ liệu
function debugImportData(data) {
    console.log('=== DEBUG IMPORT DATA ===');
    console.log('Số lượng dòng:', data.length);
    
    data.forEach((row, index) => {
        console.log(`Dòng ${index + 1}:`, {
            'STT': row['STT'],
            'Mã HS': row['Mã HS'],
            'Họ Tên': row['Họ Tên'],
            'Điểm': row['Điểm'],
            'Toàn bộ dòng': row
        });
    });
    
    // Kiểm tra học sinh trong hệ thống
    const selectedClass = scoreClass.value;
    console.log('Học sinh trong lớp', selectedClass + ':', students.filter(s => s.class === selectedClass));
}

// ===== KHAI BÁO HÀM TOÀN CỤC =====

window.downloadScoreTemplate = downloadScoreTemplate;
window.handleScoreFileImport = handleScoreFileImport;
window.processImportedScores = processImportedScores;
window.showDirectInputTable = showDirectInputTable;
window.hideDirectInputTable = hideDirectInputTable;
window.saveAllScores = saveAllScores;
window.handleScoreInput = handleScoreInput;
window.handleScoreBlur = handleScoreBlur;
window.initializeScoreUpload = initializeScoreUpload;
window.updateScoreInputTable = updateScoreInputTable;
window.initializeDragAndDrop = initializeDragAndDrop;
window.handleScoreFile = handleScoreFile;
window.showUploadMessage = showUploadMessage;

console.log('✅ score_upload.js đã loaded và các hàm đã được khai báo toàn cục');