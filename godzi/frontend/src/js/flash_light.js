export function attachFlashlightEffect() {
  // Находим все слайды внутри блока рекомендаций
  const slides = document.querySelectorAll('.recommendations__swiper .swiper-slide');
  slides.forEach(slide => {
    slide.addEventListener('mousemove', (e) => {
      const rect = slide.getBoundingClientRect();
      // Вычисляем координаты курсора относительно слайда
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Вычисляем проценты по ширине и высоте
      const percentX = (x / rect.width) * 100 + '%';
      const percentY = (y / rect.height) * 100 + '%';
      slide.style.setProperty('--mouse-x', percentX);
      slide.style.setProperty('--mouse-y', percentY);
    });
    // При уходе курсора возвращаем положение по центру
    slide.addEventListener('mouseleave', () => {
      slide.style.setProperty('--mouse-x', '50%');
      slide.style.setProperty('--mouse-y', '50%');
    });
  });
}
