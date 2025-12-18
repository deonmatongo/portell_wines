import Layout from "./Layout.jsx";

import Home from "./Home";

import Events from "./Events";

import EventBooking from "./EventBooking";

import Search from "./Search";

import About from "./About";

import Shop from "./Shop";

import Contact from "./Contact";

import Cart from "./Cart";

import ProductDetail from "./ProductDetail";

import Privacy from "./Privacy";

import Terms from "./Terms";

import AdminDashboard from "./AdminDashboard";

import Checkout from "./Checkout";

import AdminLogin from "./AdminLogin";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Events: Events,
    
    EventBooking: EventBooking,
    
    Search: Search,
    
    About: About,
    
    Shop: Shop,
    
    Contact: Contact,
    
    Cart: Cart,
    
    ProductDetail: ProductDetail,
    
    Privacy: Privacy,
    
    Terms: Terms,
    
    AdminDashboard: AdminDashboard,
    
    Checkout: Checkout,
    
    AdminLogin: AdminLogin,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/EventBooking" element={<EventBooking />} />
                
                <Route path="/Search" element={<Search />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Shop" element={<Shop />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Cart" element={<Cart />} />
                
                <Route path="/ProductDetail" element={<ProductDetail />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/AdminLogin" element={<AdminLogin />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}