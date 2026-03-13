// falling-snow.js
export default class FallingSnow {
  /**
   * Создаёт анимацию падающего снега внутри указанного элемента.
   * @param {string|HTMLElement} container Селектор или DOM-элемент, внутри которого будет анимация.
   * @param {Object} [options] Объект с опциями.
   * @param {number} [options.count=10] Количество снежинок.
   * @param {string} [options.color='#b0f22e'] Цвет снежинок.
   * @param {number} [options.size=6] Размер снежинки (диаметр в пикселях).
   * @param {number} [options.animationMinDuration=5] Минимальная длительность анимации (сек).
   * @param {number} [options.animationMaxDuration=9] Максимальная длительность анимации (сек).
   * @param {number} [options.animationMinDelay=0] Минимальная задержка старта анимации (сек).
   * @param {number} [options.animationMaxDelay=3] Максимальная задержка старта анимации (сек).
   * @param {number} [options.driftMin=-20] Минимальное смещение по оси X (px).
   * @param {number} [options.driftMax=20] Максимальное смещение по оси X (px).
   */
  constructor(container, options = {}) {
    // Получаем DOM-элемент по селектору или напрямую
    this.parent =
      typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!this.parent) {
      throw new Error(`Элемент "${container}" не найден`);
    }

    // Опции по умолчанию
    this.options = Object.assign(
      {
        count: 10,
        color: '#b0f22e',
        size: 6,
        animationMinDuration: 5,
        animationMaxDuration: 9,
        animationMinDelay: 0,
        animationMaxDelay: 3,
        driftMin: -20,
        driftMax: 20,
      },
      options
    );

    this.init();
  }

  init() {
    // Обеспечиваем относительное позиционирование и скрытие переполнения
    this.parent.style.position = 'relative';

    // Создаём контейнер для снежинок
    const container = document.createElement('div');
    container.classList.add('snowflakes-container');
    this.parent.appendChild(container);

    // Создаём заданное число снежинок
    for (let i = 0; i < this.options.count; i++) {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');

      // Случайное горизонтальное положение от 0% до 100%
      const left = Math.random() * 100;
      snowflake.style.left = `${left}%`;

      // Случайные длительность и задержка анимации
      const duration = this.randomInRange(
        this.options.animationMinDuration,
        this.options.animationMaxDuration
      );
      const delay = this.randomInRange(
        this.options.animationMinDelay,
        this.options.animationMaxDelay
      );
      snowflake.style.animationDuration = `${duration}s`;
      snowflake.style.animationDelay = `${delay}s`;

      // Случайное смещение по оси X (дрейф)
      const drift = this.randomInRange(
        this.options.driftMin,
        this.options.driftMax
      );
      snowflake.style.setProperty('--drift', `${drift}px`);

      container.appendChild(snowflake);
    }

    // Добавляем стили для анимации, если они ещё не добавлены
    if (!document.getElementById('falling-snow-styles')) {
      const style = document.createElement('style');
      style.id = 'falling-snow-styles';
      style.textContent = `
        .snowflakes-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .snowflake {
          position: absolute;
          top: -10px; /* Начало анимации немного выше */
          width: ${this.options.size}px;
          height: ${this.options.size}px;
          background: ${this.options.color};
          border-radius: 50%;
          opacity: 0.8;
          animation: fall linear infinite;
        }
        @keyframes fall {
          0% {
            transform: translate(0, -10px);
            opacity: 0.8;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translate(var(--drift), 110%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Возвращает случайное число в диапазоне [min, max]
   * @param {number} min Минимальное значение
   * @param {number} max Максимальное значение
   * @returns {number}
   */
  randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }
}
