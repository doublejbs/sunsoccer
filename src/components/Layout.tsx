import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="max-w-[960px] mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
