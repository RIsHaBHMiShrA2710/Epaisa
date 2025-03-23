import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import ArticleListPage from "./components/ArticleListPage/ArticleListPage";
import ArticleDetailPage from "./components/ArticlesDetailPage/ArticlesDetailPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/blog" element={<ArticleListPage />} />
      <Route path="/blog/:id" element={<ArticleDetailPage />} />
    </Routes>
  );
}

export default App;
