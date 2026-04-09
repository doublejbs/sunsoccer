import { useNavigate } from 'react-router-dom'

export function LoginPrompt({ message = '로그인이 필요합니다.' }: { message?: string }) {
  const navigate = useNavigate()
  return (
    <div className="text-center py-4">
      <p className="text-sm text-gray-500 mb-2">{message}</p>
      <button onClick={() => navigate('/login')} className="text-sm text-[#111] hover:underline">로그인하기</button>
    </div>
  )
}
