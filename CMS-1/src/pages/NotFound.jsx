import Navbar from '../components/layout/Navbar';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-cozy-bg">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-8xl font-serif font-black text-cozy-deep mb-6">404</h1>
        <p className="text-xl text-cozy-text/70 mb-10">We couldn't find the page you were looking for.</p>
        <Link to="/" className="bg-cozy-deep text-white px-8 py-4 rounded-xl font-bold hover:bg-cozy-accent hover:shadow-md transition-all duration-300">
          Return Home
        </Link>
      </main>
    </div>
  );
}
