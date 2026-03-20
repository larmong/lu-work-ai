'use client';

import React from 'react';

export const BubblesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030303] pointer-events-none">
      <style jsx>{`
        .gradient-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          overflow: hidden;
          background: radial-gradient(circle at 50% 50%, #080808 0%, #000 100%);
          top: 0;
          left: 0;
        }

        svg.goo-svg {
          display: none;
        }

        .gradients-container {
          filter: url(#goo) blur(40px);
          width: 100%;
          height: 100%;
        }

        .g1, .g2, .g3, .g4, .g5 {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          mix-blend-mode: screen;
        }

        /* 부드러운 핑크 */
        .g1 {
          background: radial-gradient(circle at center, rgba(255, 100, 180, 0.25) 0, rgba(255, 100, 180, 0) 50%) no-repeat;
          width: 140%;
          height: 140%;
          top: -20%;
          left: -20%;
          animation: moveVertical 35s ease infinite;
          opacity: 0.6;
        }

        /* 부드러운 오렌지 */
        .g2 {
          background: radial-gradient(circle at center, rgba(255, 150, 80, 0.2) 0, rgba(255, 150, 80, 0) 50%) no-repeat;
          width: 100%;
          height: 100%;
          top: 10%;
          left: 10%;
          transform-origin: calc(50% - 400px);
          animation: moveInCircle 28s reverse infinite;
          opacity: 0.5;
        }

        /* 부드러운 블루 */
        .g3 {
          background: radial-gradient(circle at center, rgba(80, 150, 255, 0.25) 0, rgba(80, 150, 255, 0) 50%) no-repeat;
          width: 120%;
          height: 120%;
          top: 30%;
          left: -10%;
          transform-origin: calc(50% + 400px);
          animation: moveInCircle 45s linear infinite;
          opacity: 0.6;
        }

        /* 부드러운 퍼플 */
        .g4 {
          background: radial-gradient(circle at center, rgba(160, 80, 255, 0.25) 0, rgba(160, 80, 255, 0) 50%) no-repeat;
          width: 150%;
          height: 150%;
          top: -25%;
          left: -25%;
          transform-origin: calc(50% - 200px);
          animation: moveHorizontal 42s ease infinite;
          opacity: 0.6;
        }

        /* 딥 바이올렛/네이비 (깊이감용) */
        .g5 {
          background: radial-gradient(circle at center, rgba(80, 40, 150, 0.2) 0, rgba(80, 40, 150, 0) 50%) no-repeat;
          width: 160%;
          height: 160%;
          top: -30%;
          left: -30%;
          transform-origin: calc(50% - 800px) calc(50% + 200px);
          animation: moveInCircle 25s ease infinite;
          opacity: 0.5;
        }

        @keyframes moveInCircle {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes moveVertical {
          0% { transform: translateY(-30%); }
          50% { transform: translateY(30%); }
          100% { transform: translateY(-30%); }
        }

        @keyframes moveHorizontal {
          0% { transform: translateX(-30%) translateY(-10%); }
          50% { transform: translateX(30%) translateY(10%); }
          100% { transform: translateX(-30%) translateY(-10%); }
        }
      `}</style>
      
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg" className="goo-svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
        </div>
      </div>
    </div>
  );
};
