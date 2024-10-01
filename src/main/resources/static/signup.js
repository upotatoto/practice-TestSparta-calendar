document.addEventListener('DOMContentLoaded', function() {
    // 회원가입 폼 제출 시 POST 요청 처리
    document.getElementById('signup-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // 입력된 폼 데이터 가져오기
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // 비밀번호 일치 여부 확인
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 서버로 보낼 사용자 데이터
        const userData = {
            username: username,
            email: email,
            password: password
        };

        // POST 요청을 보내 사용자 등록 (회원가입 API 호출)
        fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('POST 요청 실패: ' + response.status);
                }
                return response.text();
            })
            .then(data => {
                alert('회원가입이 완료되었습니다.');
                // 회원가입 완료 후 calendar.html로 리다이렉트
                window.location.href = 'http://localhost:8080/calendar.html';  // Spring Boot에서 제공되는 정적 파일 경로
            })
            .catch(error => console.error("POST 요청 오류:", error));
    });
});
