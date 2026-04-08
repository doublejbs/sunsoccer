import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ArticlePage } from './pages/ArticlePage'
import { LoginPage } from './pages/LoginPage'
import { MyPage } from './pages/MyPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:id" element={<ArticlePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
