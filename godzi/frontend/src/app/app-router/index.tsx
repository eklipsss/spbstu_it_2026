import { AboutPage } from '@/pages/about-page'
import { EditProfilePage } from '@/pages/edit-profile-page'
import { FavoritesPage } from '@/pages/favorites-page'
import { GuidePage } from '@/pages/guide-page'
import { LoginPage } from '@/pages/login-page'
import { MainPage } from '@/pages/main-page'
import { PlacePage } from '@/pages/place-page'
import { ProfilePage } from '@/pages/profile-page'
import { RegisterPage } from '@/pages/register-page'
import { Routes, Route } from 'react-router-dom'
export const AppRouter = () => {
  return (
    <Routes>
      <Route path='' element={<MainPage />} />
      <Route path='/place/:id' element={<PlacePage />} />
      <Route path='/guide/:id' element={<GuidePage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/favorites' element={<FavoritesPage />} />
      <Route path='/profile/edit' element={<EditProfilePage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  )
}
