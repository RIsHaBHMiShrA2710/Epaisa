import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import BlogSection from "./components/BlogSection/BlogSection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/blog" element={<BlogSection />} />
    </Routes>
  );
}

export default App;
