import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page container">
      <h2>Hakkımızda</h2>
      <p className="intro">
        FTSLine, Network Marketing ve E-Ticaret’i hibrit bir iş modeliyle birleştiren yenilikçi bir platformdur. 
        Blockchain güvencesiyle şeffaf kazanç sunarken, kullanıcılarına hem network gelirleri hem de e-ticaret kâr payı sağlar.
      </p>

      <div className="about-grid">
        <div className="card">
          <h3>🚀 Vizyonumuz</h3>
          <p>
            Dijital ekonomide güvenilir ve şeffaf bir gelir modeli sunarak 
            global ölçekte milyonlarca kullanıcıya ulaşmak.
          </p>
        </div>

        <div className="card">
          <h3>🎯 Misyonumuz</h3>
          <p>
            İnsanlara sadece kazanç değil, eğitim, topluluk ve özgürlük de sağlayarak 
            kalıcı ve sürdürülebilir bir iş modeli oluşturmak.
          </p>
        </div>

        <div className="card">
          <h3>💡 Neden FTSLine?</h3>
          <p>
            Düşük giriş bariyeri, blockchain güvencesi, global dil desteği ve 
            güçlü topluluk bilinci ile diğer tüm network firmalarından ayrılıyoruz.
          </p>
        </div>
      </div>
    </div>
  );
}
