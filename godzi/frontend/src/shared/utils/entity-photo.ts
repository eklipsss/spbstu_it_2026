import barImage from '@assets/images/bar.png'
import cafeImage from '@assets/images/cafe.png'
import concertImage from '@assets/images/concert.png'
import festivalImage from '@assets/images/festival.png'
import museumImage from '@assets/images/museum.png'
import museumImage2 from '@assets/images/museum2.png'
import parkImage from '@assets/images/park.png'

const photoMap: Record<string, string> = {
  bar: barImage,
  cafe: cafeImage,
  concert: concertImage,
  festival: festivalImage,
  museum: museumImage,
  museum2: museumImage2,
  park: parkImage,
}

export const resolveEntityPhoto = (photo?: string | null) => {
  if (!photo) {
    return ''
  }

  if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:')) {
    return photo
  }

  return photoMap[photo] ?? photo
}
