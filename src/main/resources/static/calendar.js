document.addEventListener('DOMContentLoaded', function () {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let schedules = {}; // 날짜별 일정 저장 객체

    const monthNameElement = document.querySelector('.month-name');
    const calendarBody = document.getElementById('calendar-body');
    const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    const scheduleForm = document.getElementById('scheduleForm');
    const selectedDateInput = document.getElementById('selectedDate');
    const scheduleIdInput = document.getElementById('scheduleId');
    const passwordInput = document.getElementById('password'); // 비밀번호 입력란

    // 달력 업데이트
    function updateCalendar(month, year) {
        monthNameElement.textContent = `${year}년 ${month + 1}월`;
        renderCalendar(month, year);
    }

    // 달력 렌더링
    function renderCalendar(month, year) {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

        let calendarHTML = '';
        let dayCount = 1;

        for (let week = 0; week < 6; week++) {
            calendarHTML += '<tr>';
            for (let day = 0; day < 7; day++) {
                if (week === 0 && day < firstDayOfMonth) {
                    calendarHTML += '<td></td>';
                } else if (dayCount > lastDateOfMonth) {
                    calendarHTML += '<td></td>';
                } else {
                    const dateStr = `${year}-${month + 1}-${dayCount}`;
                    const scheduleText = schedules[dateStr]
                        ? `<br><span>${schedules[dateStr].task}</span> <button class="btn btn-danger btn-sm delete-btn" data-id="${schedules[dateStr].id}" data-date="${dateStr}">삭제</button>`
                        : '';
                    calendarHTML += `<td class="date" data-date="${dateStr}">${dayCount}${scheduleText}</td>`;
                    dayCount++;
                }
            }
            calendarHTML += '</tr>';
        }

        calendarBody.innerHTML = calendarHTML;

        // 이벤트 바인딩
        addEventListenersForDateClick();
        addEventListenersForDeleteButtons();
    }

    // 날짜 클릭 시 이벤트 처리
    function addEventListenersForDateClick() {
        document.querySelectorAll('.date').forEach(dateElem => {
            dateElem.addEventListener('click', function () {
                const selectedDate = this.dataset.date;
                selectedDateInput.value = selectedDate;

                if (schedules[selectedDate]) {
                    scheduleIdInput.value = schedules[selectedDate].id;
                    document.getElementById('task').value = schedules[selectedDate].task;
                    document.getElementById('author').value = schedules[selectedDate].author;
                } else {
                    scheduleIdInput.value = '';
                    scheduleForm.reset(); // 일정이 없으면 폼 초기화
                }

                scheduleModal.show();
            });
        });
    }

    // 삭제 버튼 이벤트 처리
    function addEventListenersForDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const scheduleId = this.dataset.id;
                const selectedDate = this.dataset.date;
                const password = prompt('비밀번호를 입력해주세요.'); // 비밀번호 확인

                if (!password) {
                    alert('비밀번호가 필요합니다.');
                    return;
                }

                if (scheduleId && confirm('정말로 이 일정을 삭제하시겠습니까?')) {
                    deleteSchedule(scheduleId, selectedDate, password);
                }
            });
        });
    }

    // 일정 삭제 (DELETE 요청)
    async function deleteSchedule(scheduleId, selectedDate, password) {
        try {
            const response = await fetch(`/api/schedules/${scheduleId}?password=${encodeURIComponent(password)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('일정 삭제 실패');
            }

            alert('일정이 삭제되었습니다.');
            // 페이지 새로고침
            window.location.reload();  // 삭제 후 페이지 새로고침
        } catch (error) {
            console.error('Error:', error);
            alert('일정 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    }

    // 일정 추가/수정 (POST/PUT 요청)
    scheduleForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const scheduleId = scheduleIdInput.value;
        const task = document.getElementById('task').value;
        const author = document.getElementById('author').value;
        const password = passwordInput.value;  // 비밀번호 가져오기
        const selectedDate = selectedDateInput.value;

        const scheduleData = {
            task: task,
            author: author,
            password: password,
            date: selectedDate,
        };

        const method = scheduleId ? 'PUT' : 'POST';
        const requestUrl = scheduleId ? `/api/schedules/${scheduleId}` : '/api/schedules';

        try {
            const response = await fetch(requestUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            });

            if (!response.ok) {
                throw new Error(`${method} 요청 실패`);
            }

            const data = await response.json();
            schedules[selectedDate] = { id: data.id, task: data.task, author: data.author };  // 일정 저장
            updateCalendar(currentMonth, currentYear);  // 달력 업데이트
            scheduleModal.hide();  // 모달 닫기
        } catch (error) {
            console.error(`${method} 요청 오류:`, error);
            alert('일정 추가/수정에 실패했습니다. 다시 시도해주세요.');
        }
    });

    // 이전 달로 이동
    document.querySelector('.btn-prev').addEventListener('click', function () {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
        updateCalendar(currentMonth, currentYear);
    });

    // 다음 달로 이동
    document.querySelector('.btn-next').addEventListener('click', function () {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
        updateCalendar(currentMonth, currentYear);
    });

    // 서버에서 일정 로드
    async function loadSchedules() {
        try {
            const response = await fetch('/api/schedules');
            const data = await response.json();

            data.forEach(schedule => {
                schedules[schedule.date] = {
                    id: schedule.id,
                    task: schedule.task,
                    author: schedule.author,
                };
            });

            updateCalendar(currentMonth, currentYear);  // 초기 렌더링
        } catch (error) {
            console.error('Error loading schedules:', error);
        }
    }

    loadSchedules();  // 일정 불러오기
});
