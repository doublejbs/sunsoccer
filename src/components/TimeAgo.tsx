interface TimeAgoProps {
  date: string
}

export function TimeAgo({ date }: TimeAgoProps) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return <span>방금 전</span>
  if (seconds < 3600) return <span>{Math.floor(seconds / 60)}분 전</span>
  if (seconds < 86400) return <span>{Math.floor(seconds / 3600)}시간 전</span>
  if (seconds < 604800) return <span>{Math.floor(seconds / 86400)}일 전</span>

  return <span>{new Date(date).toLocaleDateString('ko-KR')}</span>
}
