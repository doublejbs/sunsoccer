import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-[960px] mx-auto flex items-center justify-between px-4 h-14">
        <Link to="/" className="text-lg font-bold text-[#111]">
          SunSoccer
        </Link>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="검색..."
            className="hidden lg:block border border-gray-200 rounded-lg px-4 py-2 text-sm w-48 outline-none focus:border-gray-400"
          />
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
            로그인
          </Link>
        </div>
      </div>
    </header>
  )
}
