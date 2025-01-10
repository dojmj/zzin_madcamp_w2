import React from "react";
import { useNavigate } from "react-router-dom";
import "../Page/css/Introduce.css";

function IntroPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/CategorySelection");
  };

  return (
    <div id="introduce">
      <section className="hero">
        <h1>당신의 꿈, 우리의 여정</h1>
        <p>
          유튜브 크리에이터를 꿈꾸지만 어디서부터 시작해야 할지 막막한 당신을
          위해, 우리는 새로운 길을 열어갑니다.
        </p>
      </section>

      <section className="features">
        <div className="feature">
          <h2>관심사 분석을 통한 가능성 발견</h2>
          <p>
            "내 콘텐츠는 무엇일까?"라는 고민은 이제 그만. <br></br>우리의
            플랫폼은 당신의 관심사를 정밀하게 분석하여 이미 해당 분야에서 활동
            중인 유튜버와 성공 사례를 소개합니다.
          </p>
        </div>
        <div className="feature">
          <h2>유튜브 채널 데이터로 성장의 방향 제시</h2>
          <p>
            유튜브를 시작한 모든 크리에이터들이 데이터 기반의 통찰력을 얻을 수
            있도록 지원합니다.<br></br> 채널 분석과 맞춤형 피드백을 통해 더 넓은
            세상과 소통할 수 있는 기회를 제공합니다.
          </p>
        </div>
      </section>

      <section className="cta">
        <h2>모든 크리에이터는 특별합니다.</h2>
        <p>
          이곳에서 당신의 가능성을 발견하고, 무한한 크리에이터의 세계로
          도약하세요.
        </p>
        <button onClick={handleStartClick}>지금 시작하기</button>
      </section>
    </div>
  );
}

export default IntroPage;
