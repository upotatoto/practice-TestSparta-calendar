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
    let schedules = {}; // 날짜별 일정 저장 객체

    function updateCalendar(month, year) {
        monthNameElement.textContent = `${year}년 ${month + 1}월`;
        renderCalendar(month, year);
    }

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

        // 날짜 클릭 이벤트
        document.querySelectorAll('.date').forEach(dateElem => {
            dateElem.addEventListener('click', function () {
                const selectedDate = this.dataset.date;
                selectedDateInput.value = selectedDate;
                scheduleIdInput.value = schedules[selectedDate] ? schedules[selectedDate].id : '';  // 일정 ID 설정
                scheduleModal.show();
            });
        });

        // 삭제 버튼 이벤트
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function (event) {
                const scheduleId = this.dataset.id;
                const selectedDate = this.dataset.date;

                if (confirm('정말로 이 일정을 삭제하시겠습니까?')) {
                    fetch(`/api/schedules/${scheduleId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('일정 삭제 실패');
                            }
                            alert('일정이 삭제되었습니다.');
                            // 페이지 새로고침
                            window.location.reload();  // 삭제 후 페이지 새로고침
                        })
                        .catch(error => console.error('Error:', error));
                }
            });
        });
    }

    // 일정 추가/수정 폼 제출 시 처리 (POST 또는 PUT 요청)
    scheduleForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const scheduleId = scheduleIdInput.value;
        const task = document.getElementById('task').value;
        const author = document.getElementById('author').value;
        const password = document.getElementById('password').value;
        const selectedDate = selectedDateInput.value;

        const scheduleData = {
            task: task,
            author: author,
            password: password,
            createdAt: selectedDate,
            updatedAt: selectedDate
        };

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
                schedules[selectedDate] = { id: data.id, task, author };  // ID 저장
                updateCalendar(currentMonth, currentYear);
                scheduleModal.hide();
            })
            .catch(error => console.error(`${method} 요청 오류:`, error));
    });

    document.querySelector('.btn-prev').addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateCalendar(currentMonth, currentYear);
    });

    document.querySelector('.btn-next').addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateCalendar(currentMonth, currentYear);
    });

    updateCalendar(currentMonth, currentYear);

    // 서버에서 기존 일정 불러오기
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
