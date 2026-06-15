import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QuoteProvider } from './context/QuoteContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Quote from './pages/Quote';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  // Reset scroll on route change
  return null;
}

function AppLayout() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/cotizacion" element={<Quote />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div style={{ fontSize: '6rem', marginBottom: '1.5rem', opacity: 0.3 }}>404</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Página no encontrada</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>La página que buscas no existe o fue movida.</p>
        <a href="/" className="btn btn-primary btn-lg">Ir al Inicio</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QuoteProvider>
        <AppLayout />
      </QuoteProvider>
    </BrowserRouter>
  );
}
