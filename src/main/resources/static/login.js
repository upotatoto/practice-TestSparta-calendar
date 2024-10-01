document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 로그인 요청 경로 확인
        fetch('http://localhost:8080/api/auth/login', {  // 경로를 확인하세요.
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('로그인 실패');
                }
            })
            .then(data => {
                alert('로그인 성공');
                window.location.href = 'http://localhost:63342/calendar.html';  // 로그인 성공 시 이동할 페이지
            })
            .catch(error => {
                console.error('로그인 오류:', error);
                alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
            });
    });
});
