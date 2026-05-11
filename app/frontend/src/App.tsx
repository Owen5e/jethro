import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// Pages
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import Books from './pages/Books';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Giving from './pages/Giving';
import Home from './pages/Home';
import Ministries from './pages/Ministries';
import Sermons from './pages/Sermons';

// Components
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ministries" element={<Ministries />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/events" element={<Events />} />
            <Route path="/books" element={<Books />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/giving" element={<Giving />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
