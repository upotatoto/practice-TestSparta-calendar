document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // DOM Elements
    const monthNameElement = document.querySelector('.month-name');
    const calendarBody = document.getElementById('calendar-body');
    const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    const scheduleForm = document.getElementById('scheduleForm');
    const selectedDateInput = document.getElementById('selectedDate');
    let schedules = {}; // 날짜별 일정 저장 객체

    // 월 이름을 표시하는 함수
    function updateCalendar(month, year) {
        monthNameElement.textContent = `${year}년 ${month + 1}월`;
        renderCalendar(month, year);
    }

    // 달력 렌더링 함수
    function renderCalendar(month, year) {
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 해당 달의 첫 번째 요일
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); // 해당 달의 마지막 날짜

        let calendarHTML = '';
        let dayCount = 1;

        for (let week = 0; week < 6; week++) {
            calendarHTML += '<tr>';
            for (let day = 0; day < 7; day++) {
                if (week === 0 && day < firstDayOfMonth) {
                    calendarHTML += '<td></td>'; // 빈 칸 처리
                } else if (dayCount > lastDateOfMonth) {
                    calendarHTML += '<td></td>'; // 빈 칸 처리
                } else {
                    const dateStr = `${year}-${month + 1}-${dayCount}`;
                    const scheduleText = schedules[dateStr] ? `<br><span>${schedules[dateStr]}</span>` : '';
                    calendarHTML += `<td class="date" data-date="${dateStr}">${dayCount}${scheduleText}</td>`;
                    dayCount++;
                }
            }
            calendarHTML += '</tr>';
        }

        calendarBody.innerHTML = calendarHTML;

        // 날짜 클릭 이벤트 추가
        document.querySelectorAll('.date').forEach(dateElem => {
            dateElem.addEventListener('click', function() {
                const selectedDate = this.dataset.date;
                selectedDateInput.value = selectedDate; // 선택한 날짜 저장
                scheduleModal.show(); // 팝업 띄우기
            });
        });
    }

    // 일정 추가 폼 제출 처리
    scheduleForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const scheduleTitle = document.getElementById('scheduleTitle').value;
        const selectedDate = selectedDateInput.value;

        // 서버에 POST 요청 (일정 추가)
        fetch('/api/schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: selectedDate, title: scheduleTitle })
        })
            .then(response => response.json())
            .then(data => {
                schedules[selectedDate] = scheduleTitle; // 로컬에서 일정 저장
                updateCalendar(currentMonth, currentYear); // 달력 업데이트
                scheduleModal.hide(); // 팝업 닫기
            })
            .catch(error => console.error('Error:', error));
    });

    // 이전 달로 이동
    document.querySelector('.btn-prev').addEventListener('click', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateCalendar(currentMonth, currentYear);
    });

    // 다음 달로 이동
    document.querySelector('.btn-next').addEventListener('click', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateCalendar(currentMonth, currentYear);
    });

    // 초기 달력 렌더링
    updateCalendar(currentMonth, currentYear);

    // 서버에서 기존 일정 불러오기 (GET 요청)
    fetch('/api/schedules')
        .then(response => response.json())
        .then(data => {
            data.forEach(schedule => {
                schedules[schedule.date] = schedule.title; // 일정 데이터 저장
            });
            updateCalendar(currentMonth, currentYear); // 달력 업데이트
        })
        .catch(error => console.error('Error:', error));
});
