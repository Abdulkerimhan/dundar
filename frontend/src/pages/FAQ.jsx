import React, { useState } from "react";
import "./FAQ.css";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "FTSLine nedir?",
      a: "FTSLine, Network Marketing ve E-Ticaret'i hibrit bir iş modeliyle birleştiren, blockchain tabanlı kazanç platformudur.",
    },
    {
      q: "Nasıl kazanç elde edebilirim?",
      a: "Hem üye getirerek network üzerinden, hem de e-ticaret sistemi üzerinden ürün kâr payı ile kazanç elde edebilirsiniz.",
    },
    {
      q: "Lisans ücreti ne kadar?",
      a: "Aylık kullanım bedeli 14.99 USDT’dir.",
    },
    {
      q: "Global uyum var mı?",
      a: "Evet. Sistem hem Türkçe hem İngilizce çalışır ve uluslararası kullanıma uygundur.",
    },
    {
      q: "FTSLine mobil uyumlu mu?",
      a: "Evet. Hem mobil hem web üzerinden kolayca erişim sağlayabilirsiniz.",
    },
  ];

  return (
    <div className="faq-page container">
      <h2>Sık Sorulan Sorular</h2>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div className="faq-item" key={index}>
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <h3>{item.q}</h3>
              <span>{activeIndex === index ? "−" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
