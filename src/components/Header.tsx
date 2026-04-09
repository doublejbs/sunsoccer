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
    <header className="sticky top-0 z-10">
      {/* Main header bar — black */}
      <div className="bg-[#111]">
        <div className="max-w-[960px] mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-baseline gap-0.5">
            <span className="font-headline font-bold text-2xl text-white tracking-tighter leading-none">Sun</span>
            <span className="font-headline font-bold text-2xl text-white tracking-tighter leading-none">Chook</span>
          </Link>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="hidden lg:block bg-white/10 border border-white/20 text-white placeholder-white/50 rounded px-3 py-1.5 text-sm w-44 outline-none focus:border-white/40"
            />
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/mypage" className="text-sm text-white/70 hover:text-white">
                  {profile?.nickname ?? user.email}
                </Link>
                <button onClick={signOut} className="text-sm text-white/50 hover:text-white">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-white/70 hover:text-white">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Sub nav — white */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[960px] mx-auto flex items-center gap-6 px-4 h-10">
          <Link to="/" className="text-sm font-bold text-[#111] hover:text-gray-600">뉴스</Link>
          <Link to="/matches" className="text-sm font-bold text-gray-400 hover:text-[#111]">경기일정</Link>
          <Link to="/standings" className="text-sm font-bold text-gray-400 hover:text-[#111]">순위</Link>
        </div>
      </div>
    </header>
  )
}
