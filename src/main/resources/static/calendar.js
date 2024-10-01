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
        addEventListenersForDateClick();
        addEventListenersForDeleteButtons();
    }

    function addEventListenersForDateClick() {
        document.querySelectorAll('.date').forEach(dateElem => {
            dateElem.addEventListener('click', function () {
                const selectedDate = this.dataset.date;
                selectedDateInput.value = selectedDate;

                // 일정이 있는 날짜의 경우 scheduleId 설정
                if (schedules[selectedDate]) {
                    scheduleIdInput.value = schedules[selectedDate].id;  // 일정 ID 설정
                } else {
                    scheduleIdInput.value = '';  // 일정이 없을 때는 빈 값
                }

                scheduleModal.show();
            });
        });
    }

    function addEventListenersForDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const scheduleId = this.dataset.id;
                const selectedDate = this.dataset.date;

                // 확인: scheduleId가 undefined가 아닌지 확인 후 삭제 요청
                if (scheduleId && confirm('정말로 이 일정을 삭제하시겠습니까?')) {
                    deleteSchedule(scheduleId, selectedDate);
                } else {
                    alert('일정을 삭제할 수 없습니다. 유효한 일정 ID가 없습니다.');
                }
            });
        });
    }

    async function deleteSchedule(scheduleId, selectedDate) {
        try {
            const response = await fetch(`/api/schedules/${scheduleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('일정 삭제 실패');
            }
            alert('일정이 삭제되었습니다.');
            delete schedules[selectedDate];
            window.location.reload();  // 삭제 후 페이지 새로고침
        } catch (error) {
            console.error('Error:', error);
        }
    }

    scheduleForm.addEventListener('submit', async function (event) {
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

        const method = scheduleId ? 'PUT' : 'POST';
        const requestUrl = scheduleId ? `/api/schedules/${scheduleId}` : '/api/schedules';

        try {
            const response = await fetch(requestUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData)
            });

            const data = await response.json();
            schedules[selectedDate] = { id: data.id, task, author };  // ID 저장
            updateCalendar(currentMonth, currentYear);
            scheduleModal.hide();
        } catch (error) {
            console.error(`${method} 요청 오류:`, error);
        }
    });

    document.querySelector('.btn-prev').addEventListener('click', function () {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
        updateCalendar(currentMonth, currentYear);
    });

    document.querySelector('.btn-next').addEventListener('click', function () {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
        updateCalendar(currentMonth, currentYear);
    });

    async function loadSchedules() {
        try {
            const response = await fetch('/api/schedules');
            const data = await response.json();
            data.forEach(schedule => {
                schedules[schedule.date] = { id: schedule.id, task: schedule.task, author: schedule.author };
            });
            updateCalendar(currentMonth, currentYear);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    loadSchedules();
});
