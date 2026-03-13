import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import '../scss/main.scss';
import './main_page';
import './place_page';
import FallingSnow from './snowflakes.js';
import attachFlashlightEffect from './flash_light'
export const API_URL = 'https://godzi.space/api/v1';

export async function asyncRequest(request_url) {
    try {
        const data = await fetch(request_url);

        if (data.status >= 200 && data.status < 300) {
            const jsonData = await data.json();

            if (jsonData) {
                return jsonData
            }
        } else {
            return {}
        }
    } catch (e) {
        console.error(e)
    }
}

export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}


// Инициализируем анимацию с нужными настройками
document.addEventListener('DOMContentLoaded', () => {

  // const snowAnimation = new FallingSnow('.search_input', {
  //   count: 20,
  //   color: '#b0f22e',
  //   size: 6,
  //   animationMinDuration: 5,
  //   animationMaxDuration: 9,
  //   animationMinDelay: 0,
  //   animationMaxDelay: 3,
  //   driftMin: -20,
  //   driftMax: 20,
  // });


});

