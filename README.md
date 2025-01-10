## Overview

![20210406173947555494.jpg](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/acd8a82c-c3f0-426a-8dac-6d0d68d52a45/20210406173947555494.jpg)

최근 MZ 세대 사이에서 주목받는 장래 희망 중 하나는 의사나 판사가 아닌, 바로 **유튜버**입니다! MZ 세대는 개인의 성장과 행복을 중요하게 여기며, SNS와 같은 멀티미디어 플랫폼의 발달로 자신의 취미나 특기를 자연스럽게 공유하려는 경향이 강합니다. 이런 흐름 속에서 유튜버, 크리에이터, 인플루언서 같은 직업에 대한 관심과 수요가 급증하고 있습니다. **Youwithme**는 이러한 크리에이터들과 함께 성장하며, 유튜브 크리에이터를 위한 데이터베이스 제공 및 분석 플랫폼을 제공합니다.

---

## 팀원 및 개발 환경

- 조민지: EHWA CS 23

> **FE**
> 
> - Language : JavaScript
> - Framework: React
> 

- 이승민: KAIST CS 21

> **BE**
> 
> - Language: Javascript
> - Framework: Node.js
> - Database: MySQL

## 웹페이지 구조

### [ 주요 기능 ]

- 자체 회원가입 및 로그인 기능을 지원하며, 구글 소셜 로그인 기능 추가 지원
- Favorite 탭 이동 시 관심사 카테고리 및 세부 주제 선정을 통해 관련 유튜브 크리에이터들의 정보를 받아올 수 있음(Youtube Date API 이용)
- My Channel 탭 이동 시(구글 소셜 로그인이 선행되어야 함) 채널 정보 및 채널 통계, 업로드한 동영상별 통계가 누적 조회수 및 누적 구독자 수 그래프를 통해 표시됨
    
    → 그래프 on/off, 시간 조정, 동영상 선택 등 분석을 위한 다양한 기능 제공
    
    → 데이터의 경우 KST 오후 3시마다 Youtube reporting API를 이용해 갱신됨
    

## APIs

[APIs](https://www.notion.so/1755a1b835578130beeef3cdc879ba7a?pvs=21)

## DB

![erdia.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/f07c0f67-7774-4d10-9787-e2aae88e70e2/erdia.png)

## 시연

- 홈 화면

[화면 기록 2025-01-09 오후 11.43.35.mov](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/50709439-6773-4ec7-b336-e5986eed122b/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2025-01-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_11.43.35.mov)

- 회원가입 및 로그인

[회원가입 및 로그인.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/12f88a3d-764e-42c1-b823-e5013ae48abd/%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85_%EB%B0%8F_%EB%A1%9C%EA%B7%B8%EC%9D%B8.mp4)

- 관심사 탭

[관심사.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/fb1f1b69-cc29-4d81-b980-5b42c417754f/%EA%B4%80%EC%8B%AC%EC%82%AC.mp4)

- My Channel 탭(구글 소셜 로그인 필요)

[내채널.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/4dfb1bb1-2267-4e17-aeb7-32e156f5b766/%EB%82%B4%EC%B1%84%EB%84%90.mp4)
