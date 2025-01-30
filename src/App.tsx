import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlogPage from "./pages/BlogPage";
import BlogDetails from "./pages/BlogDetails";
import StoryPage from "./pages/Story";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/shop/product/:id" element={<ProductDetails />} /> 
      </Routes>
    </Router>
  );
};

export default App;
