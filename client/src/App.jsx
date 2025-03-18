import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import ArticleListPage from "./components/ArticleListPage/ArticleListPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/blog" element={<ArticleListPage />} />
    </Routes>
  );
}

export default App;
