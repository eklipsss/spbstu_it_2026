import '@/shared/styles/index.scss'
import { store } from '@/app/store'
import { AdminHostApp } from '@/admin/admin-host'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <BrowserRouter>
      <Provider store={store}>
        <AdminHostApp />
      </Provider>
    </BrowserRouter>
  </HelmetProvider>,
)
