import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Importa os estilos do Swiper
import 'swiper/css';
import 'swiper/css/pagination';

function Welcome({ aoFinalizar }) {
  const slides = [
    {
      titulo: "BEM-VINDO À ZERO",
      descricao: "A plataforma onde sua presença vale ouro. Experiência premium em cada detalhe.",
    },
    {
      titulo: "GANHE MOEDAS",
      descricao: "Assista anúncios, complete desafios e acumule saldo para itens exclusivos.",
    },
    {
      titulo: "PERSONALIZE",
      descricao: "Molduras raras e badges exclusivas. Crie sua identidade única agora.",
    }
  ];

  return (
    <div className="card-zero welcome-swiper-container">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="meu-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content">
              <h1 className="logo-zero"><span>{slide.titulo}</span></h1>
              <p className="subtitulo">{slide.descricao}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="btn-zero" onClick={aoFinalizar} style={{ marginTop: '20px' }}>
        COMEÇAR AGORA
      </button>
    </div>
  );
}

export default Welcome;