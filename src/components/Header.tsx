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
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1">
            <span className="bg-[#111] text-white font-headline font-bold text-lg px-2 py-0.5 leading-none tracking-tight">SUN</span>
            <span className="text-[#111] font-headline font-bold text-lg tracking-tight">CHOOK</span>
          </Link>
          <Link to="/matches" className="text-sm text-gray-500 hover:text-[#111]">
            경기일정
          </Link>
          <Link to="/standings" className="text-sm text-gray-500 hover:text-[#111]">
            순위
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="hidden lg:block bg-white border border-gray-200 text-[#111] placeholder-gray-400 rounded-lg px-4 py-2 text-sm w-48 outline-none focus:border-gray-400"
          />
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/mypage" className="text-sm text-gray-500 hover:text-[#111]">
                {profile?.nickname ?? user.email}
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-[#111]"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-gray-500 hover:text-[#111]">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
