document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.text())
            .then(data => {
                if (data === "로그인 성공") {
                    // 로그인 성공 시 calendar.html로 리다이렉트
                    window.location.href = 'http://localhost:63342/calendar.html';
                } else {
                    // 로그인 실패 시 메시지 출력
                    alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
                }
            })
            .catch(error => {
                console.error('로그인 오류:', error);
                alert('로그인 중 오류가 발생했습니다.');
            });
    });
});
