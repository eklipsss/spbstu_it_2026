import { AboutPage } from '@/pages/about-page'
import { GuidePage } from '@/pages/guide-page'
import { MainPage } from '@/pages/main-page'
import { PlacePage } from '@/pages/place-page'
import { ProfilePage } from '@/pages/profile-page'
import { Routes, Route } from 'react-router-dom'
export const AppRouter = () => {
  return (
    <Routes>
      <Route path='' element={<MainPage />} />
      <Route path='/place/:id' element={<PlacePage />} />
      <Route path='/guide/:id' element={<GuidePage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  )
}
