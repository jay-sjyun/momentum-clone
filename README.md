# 프로젝트명 : Momentum 클론 홈페이지

# 배포 : [Github page](https://jay-sjyun.github.io/momentum-clone "깃허브 페이지로 이동")

# 기술 스택 : HTML5, CSS(SCSS), Javascript(Vanilla)

# 개발 인원 : 1명

# 구현 기능
1. 사용자 기억 : localStorage에 사용자 이름을 저장하여 새로고침시에도 사용자를 기억
1. 위치기반 날씨 정보 :  
위치정보 취득(허용시) ->  
원격 API에 전달하여 해당 위치의 날씨정보 불러오기 ->  
불러운 데이터 후속 처리(DOM element 조작)
1. 로그인 :  
로그인 시 로컬 스토리지에 사용자 이름 저장 및 홈 UI 불러오기  
할 일 데이터 불러오기
1. 할 일 관리 :  
할일 등록 시 객체 생성 및 정보 저장  
배열로 전달하여 로컬 스토리지에 저장
1. 뉴스 :  
원격 API를 호출하여 뉴스 데이터 불러오기  
불러온 데이터를 바탕으로 동적으로 DOM element 생성
1. 로그아웃 : 로그아웃 시 localStorage에 저장된 사용자 이름 삭제 및 UI 초기화
1. 실시간 시계 : 오전/오후 구분
1. 무작위 인용구/배경 출력

# 상세 설명 :
[임시 DB](https://my-json-server.typicode.com/jay-sjyun/fakedb)  


