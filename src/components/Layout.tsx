import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="max-w-[960px] mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
