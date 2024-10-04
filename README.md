아래는 시연영상이 있는 블로그 링크입니다.
https://whlsls3377.tistory.com/98

![calendarapp](https://github.com/user-attachments/assets/ecd21148-6927-41be-8c6f-d7faeb6a8fc7)
---

# 캘린더 웹 애플리케이션

이 프로젝트는 사용자가 일정을 추가, 수정, 삭제할 수 있는 **캘린더 웹 애플리케이션**입니다. 사용자는 날짜별로 일정을 생성하고, 일정을 수정하거나 삭제할 수 있습니다. 또한, 모든 일정은 **REST API**를 통해 서버와 연동되며, 일정 정보는 데이터베이스에 저장됩니다.

## 📋 주요 기능

- **일정 생성**: 특정 날짜에 일정을 추가할 수 있습니다.
- **일정 수정**: 이미 생성된 일정을 클릭하여 수정할 수 있습니다.
- **일정 삭제**: 생성된 일정을 삭제할 수 있습니다.
- **월별 캘린더 표시**: 월별로 일정을 한눈에 볼 수 있습니다.
- **서버와 데이터 연동**: 일정은 **REST API**를 통해 서버로 전송되어 **DB에 저장**됩니다.

## 💻 기술 스택

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Spring Boot, Java
- **Database**: MySQL
- **API**: RESTful API

## 📦 설치 및 실행

### 사전 준비

- **Java 11 이상**이 설치되어 있어야 합니다.
- **MySQL**이 설치되어 있어야 합니다.

### 3. 데이터베이스 설정

**MySQL**에서 다음 명령어를 실행하여 데이터베이스 및 테이블을 생성합니다.

```sql
CREATE DATABASE calendar_db;

USE calendar_db;

CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_At DATETIME NOT NULL,
    updated_At DATETIME NOT NULL
);
```

### 캘린더 사용

1. 웹 애플리케이션에 접속하면 월별 캘린더가 표시됩니다.
2. 날짜를 클릭하여 일정을 추가하거나 수정할 수 있습니다.
3. 일정을 삭제하려면, 삭제 버튼을 클릭합니다.

## 🛠️ 주요 코드 설명

### 캘린더 렌더링 및 일정 추가/수정/삭제

캘린더는 JavaScript에서 다음과 같이 렌더링되며, 사용자가 일정을 추가하거나 삭제할 수 있습니다.

```javascript
function renderCalendar(month, year) {
    // 캘린더 렌더링 로직
}

scheduleForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const scheduleData = {
        task: task,
        author: author,
        password: password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    fetch('/api/schedules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData)
    })
    .then(response => response.json())
    .then(data => {
        updateCalendar(currentMonth, currentYear);
        scheduleModal.hide();
    })
    .catch(error => console.error('Error:', error));
});
```

### REST API 엔드포인트

- `GET /api/schedules` : 모든 일정 가져오기
- `POST /api/schedules` : 새로운 일정 추가
- `PUT /api/schedules/{id}` : 일정 수정 [존재만 할 뿐 실현하지 못함]
- `DELETE /api/schedules/{id}` : 일정 삭제 [존재만 할 뿐 실현하지 못함]

## 🖥️ 프로젝트 구조

```
sparta-calendar/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── sparta/
│   │   │           └── spartacalendar/
│   │   │               ├── controller/       # 컨트롤러 (API 요청을 처리)
│   │   │               │   ├── ScheduleController.java
│   │   │               │   ├── AuthController.java  # 로그인 및 회원가입 처리
│   │   │               ├── dto/              # DTO (데이터 전송 객체)
│   │   │               │   ├── ScheduleDTO.java
│   │   │               │   └── UserDTO.java   # 사용자 정보
│   │   │               ├── entity/           # 엔티티 (DB 테이블과 매핑)
│   │   │               │   ├── Schedule.java
│   │   │               │   └── User.java      # 사용자 엔티티
│   │   │               ├── repository/       # 데이터베이스 접근 레이어 (JDBC)
│   │   │               │   ├── ScheduleRepository.java
│   │   │               │   └── UserRepository.java   # 사용자 정보 처리
│   │   │               ├── service/          # 서비스 (비즈니스 로직)
│   │   │               │   ├── ScheduleService.java
│   │   │               │   └── AuthService.java      # 로그인 및 회원가입 처리 로직
│   │   │               └── SpartacalendarApplication.java # 메인 애플리케이션 클래스
│   │   ├── resources/                         # 리소스 파일 (설정, HTML, SQL)
│   │   │   ├── static/                        # 정적 파일 (CSS, JS)
│   │   │   │   ├── calendar.html
│   │   │   │   ├── login.js
│   │   │   │   ├── signup.js
│   │   │   │   └── style.css
│   │   │   ├── templates/                     # HTML 템플릿 파일
│   │   │   │   ├── index.html  # 로그인 페이지
│   │   │   │   └── signup.html # 회원가입 페이지
│   │   │   ├── application.properties         # 애플리케이션 설정 파일
└── build.gradle                               # 빌드 스크립트
```
