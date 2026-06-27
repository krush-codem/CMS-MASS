import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Resources from './pages/Resources';
import Categories from './pages/Categories';
import CategoryArticles from './pages/CategoryArticles';
import Article from './pages/Article';
import Articles from './pages/Articles';
import NotFound from './pages/NotFound';
import ProtectedAdminLayout from './components/layout/ProtectedAdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ArticleEditor from './pages/admin/ArticleEditor';
import Taxonomy from './pages/admin/Taxonomy';
import ResourcesManager from './pages/admin/ResourcesManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryName" element={<CategoryArticles />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/admin" element={<ProtectedAdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="editor" element={<ArticleEditor />} />
          <Route path="editor/:id" element={<ArticleEditor />} />
          <Route path="taxonomy" element={<Taxonomy />} />
          <Route path="resources" element={<ResourcesManager />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
