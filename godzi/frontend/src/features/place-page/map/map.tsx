import { useEffect, useRef } from "react";

interface YandexMapProps {
  address: string;
}

const YandexMap: React.FC<YandexMapProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadYandexMap = () => {
      if (!window.ymaps) return;

      window.ymaps.ready(async () => {
        try {
          const res = await window.ymaps.geocode(address);
          const coordinates = res.geoObjects.get(0).geometry.getCoordinates();

          const myMap = new window.ymaps.Map(mapRef.current, {
            center: coordinates,
            zoom: 18,
            controls: [],
          });

          const myPlacemark = new window.ymaps.Placemark(coordinates, {
            hintContent: address,
            balloonContent: address,
          });

          myMap.geoObjects.add(myPlacemark);
        } catch (error) {
          console.error("Ошибка загрузки карты:", error);
        }
      });
    };

    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
      script.async = true;
      script.onload = loadYandexMap;
      document.body.appendChild(script);
    } else {
      loadYandexMap();
    }
  }, [address]);

  return <div id="map" ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default YandexMap;
