// 페이지 로드 후 로그인 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 폼 제출 시 POST 요청 처리
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const loginData = {
            username: username,
            password: password
        };

        // POST 요청을 보내 로그인 처리
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('로그인 실패');
                }
            })
            .then(data => {
                alert('로그인 성공!');
                console.log("로그인 응답 데이터:", data);
                // 성공 시 리다이렉트 또는 다음 화면으로 이동
                window.location.href = '/dashboard'; // 대시보드로 이동
            })
            .catch(error => {
                alert('로그인에 실패했습니다.');
                console.error("로그인 오류:", error);
            });
    });
});
