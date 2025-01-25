import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlogPage from "./pages/BlogPage";
import BlogDetails from "./pages/BlogDetails";
import StoryPage from "./pages/Story";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/story" element={<StoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
