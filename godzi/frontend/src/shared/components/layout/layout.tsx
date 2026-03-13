import { FC, ReactNode } from 'react'
import styles from './layout.module.scss'
import { Header } from '../header/header'
import { Footer } from '../footer/footer'

interface LayoutProps {
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className='main'>
        {children}
      </main>
      <Footer />
    </div>
  )
}
