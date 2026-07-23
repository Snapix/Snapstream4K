import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Watch from './pages/Watch';
import Details from './pages/Details';
import Settings from './pages/Settings';
import Layout from './components/layout/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="details/:type/:id" element={<Details />} />
          <Route path="watch/:type/:id" element={<Watch />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
