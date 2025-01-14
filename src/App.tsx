import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlogPage from "./pages/BlogPage";
import BlogDetails from "./pages/BlogDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
