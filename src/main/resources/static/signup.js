// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // GET 요청을 보내 사용자 데이터를 가져오기
    fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("회원 데이터:", data);
            // 데이터를 HTML에 표시할 수 있습니다.
        })
        .catch(error => console.error("GET 요청 오류:", error));

    // 회원가입 폼 제출 시 POST 요청 처리
    document.getElementById('signup-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const userData = {
            username: username,
            email: email,
            password: password
        };

        // POST 요청을 보내 사용자 등록
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                alert('회원가입이 완료되었습니다.');
                console.log("POST 요청 응답:", data);
            })
            .catch(error => console.error("POST 요청 오류:", error));
    });
});
