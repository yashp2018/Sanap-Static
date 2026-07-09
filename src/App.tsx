import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Grafting from "./pages/Grafting";
import Gallery from "./pages/Gallery";
import Process from "./pages/Process";
import Infrastructure from "./pages/Infrastructure";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DASHBOARD_PATHS = ["/dashboard", "/admin", "/login", "/register", "/admin-login"];

function AppLayout() {
  const { pathname } = useLocation();
  const isDashboard = DASHBOARD_PATHS.some(p => pathname.startsWith(p));
  return (
    <>
      {!isDashboard && <Header />}
      <main>
        <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/grafting" element={<Grafting />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/process" element={<Process />} />
                  <Route path="/infrastructure" element={<Infrastructure />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <FloatingButtons />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
