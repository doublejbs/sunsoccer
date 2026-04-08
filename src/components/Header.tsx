import { useState, type KeyboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '')

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmed = searchValue.trim()
      if (trimmed) {
        navigate(`/?search=${encodeURIComponent(trimmed)}`)
      } else {
        navigate('/')
      }
    }
  }

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="hidden lg:block border border-gray-200 rounded-lg px-4 py-2 text-sm w-48 outline-none focus:border-gray-400"
          />
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/mypage" className="text-sm text-gray-700 hover:text-gray-900">
                {profile?.nickname ?? user.email}
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
