document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 로그인 요청을 서버로 보냄
        fetch('http://localhost:8080/api/auth/login', {  // 로그인 API 경로 확인
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
                if (data === "로그인 성공") {
                    // 로그인 성공 시 calendar.html로 리다이렉트
                    window.location.href = 'http://localhost:8080/calendar.html';  // 리다이렉트할 페이지 경로
                } else {
                    alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
                }
            })
            .catch(error => {
                console.error('로그인 오류:', error);
                alert('로그인 중 오류가 발생했습니다.');
            });
    });
});
