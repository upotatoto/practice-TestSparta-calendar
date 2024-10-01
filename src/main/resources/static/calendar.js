document.addEventListener('DOMContentLoaded', function () {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const monthNameElement = document.querySelector('.month-name');
    const calendarBody = document.getElementById('calendar-body');
    const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    const scheduleForm = document.getElementById('scheduleForm');
    const selectedDateInput = document.getElementById('selectedDate');
    const scheduleIdInput = document.getElementById('scheduleId');
    let schedules = {};

    // 캘린더 업데이트 함수
    function updateCalendar(month, year) {
        monthNameElement.textContent = `${year}년 ${month + 1}월`;
        renderCalendar(month, year);
    }

    // 캘린더 렌더링 함수
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
                    const scheduleText = schedules[dateStr] ? `<br><span>${schedules[dateStr].task}</span>` : '';
                    const deleteButton = schedules[dateStr] ? `<br><button class="delete-schedule" data-date="${dateStr}">삭제</button>` : '';  // 삭제 버튼 추가
                    calendarHTML += `<td class="date" data-date="${dateStr}">${dayCount}${scheduleText}${deleteButton}</td>`;
                    dayCount++;
                }
            }
            calendarHTML += '</tr>';
        }

        calendarBody.innerHTML = calendarHTML;

        // 날짜 클릭 시 일정 편집을 위한 모달 열기
        document.querySelectorAll('.date').forEach(dateElem => {
            dateElem.addEventListener('click', function () {
                const selectedDate = this.dataset.date;
                selectedDateInput.value = selectedDate;
                scheduleIdInput.value = schedules[selectedDate] ? schedules[selectedDate].id : ''; // 일정 ID 설정
                scheduleModal.show();
            });
        });

        // 삭제 버튼 클릭 시 프론트에서 일정 삭제 처리
        document.querySelectorAll('.delete-schedule').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', function (event) {
                event.stopPropagation();  // 부모 이벤트 중첩 방지
                const selectedDate = this.dataset.date;

                if (schedules[selectedDate]) {
                    delete schedules[selectedDate]; // 프론트엔드에서만 해당 일정 삭제
                    updateCalendar(currentMonth, currentYear); // 캘린더 재렌더링
                }
            });
        });
    }

    // 현재 날짜와 시간을 포함한 형태로 변환하는 함수
    function getFormattedDateTime(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // 2자리 형식 유지
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;  // YYYY-MM-DD HH:MM:SS 형식
    }

    // 일정 추가/수정/삭제 처리 함수
    scheduleForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const scheduleId = scheduleIdInput.value;
        const task = document.getElementById('task').value;
        const author = document.getElementById('author').value;
        const password = document.getElementById('password').value;
        const selectedDate = selectedDateInput.value;

        // 현재 날짜와 시간을 합친 형식으로 변환
        const now = new Date();
        const createdAt = getFormattedDateTime(now);  // 현재 시간을 기준으로 만든 datetime
        const updatedAt = createdAt;

        const scheduleData = {
            task: task,
            author: author,
            password: password,
            createdAt: createdAt,  // 날짜와 시간 형식으로 전송
            updatedAt: updatedAt
        };

        if (!task.trim()) {
            alert('삭제할 일정이 없습니다.');
            scheduleModal.hide();
        } else {
            // 일정 추가/수정 처리 (서버로 전송)
            let requestUrl = '/api/schedules';
            let method = 'POST';

            if (scheduleId) {
                requestUrl = `/api/schedules/${scheduleId}`;
                method = 'PUT';
            }

            fetch(requestUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData)
            })
                .then(response => response.json())
                .then(data => {
                    schedules[selectedDate] = { id: data.id, task, author }; // ID 저장
                    updateCalendar(currentMonth, currentYear);
                    scheduleModal.hide();
                })
                .catch(error => console.error(`${method} 요청 오류:`, error));
        }
    });

    // 이전 달로 이동
    document.querySelector('.btn-prev').addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateCalendar(currentMonth, currentYear);
    });

    // 다음 달로 이동
    document.querySelector('.btn-next').addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateCalendar(currentMonth, currentYear);
    });

    // 초기 캘린더 설정 및 일정 로드
    updateCalendar(currentMonth, currentYear);

    fetch('/api/schedules')
        .then(response => response.json())
        .then(data => {
            data.forEach(schedule => {
                schedules[schedule.date] = { id: schedule.id, task: schedule.task, author: schedule.author };
            });
            updateCalendar(currentMonth, currentYear);
        })
        .catch(error => console.error('Error:', error));
});
