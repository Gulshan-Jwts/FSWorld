import React from 'react'
import '@/stylesheets/admin/dashboard.css';
import Link from 'next/link';

const Page = () => {
  return (
    <main className="adminDashboard">
                <div className="overview-grid">
            <div className="overview-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>Total Sales</h3>
                <p>₹1,25,000</p>
            </div>
            <div className="overview-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <h3>Total Orders</h3>
                <p>245</p>
            </div>
            <div className="overview-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <h3>Products</h3>
                <p>120</p>
            </div>
            <div className="overview-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <h3>Visitors</h3>
                <p>3,500</p>
            </div>
            <div className="overview-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
                </svg>
                <h3>Total Clicks</h3>
                <p>10,000</p>
            </div>
        </div>

        <div className="graphs-section">
            <div className="graph-card">
                <h3>Revenue Over Time (Last 12 Months)</h3>
                <div className="graph-placeholder">
                    <svg viewBox="0 0 600 220">
                        <rect x="20" y="100" width="40" height="120" fill="var(--accent-cyan)" fillOpacity="0.8"/>
                        <rect x="70" y="80" width="40" height="140" fill="var(--accent-cyan)" fillOpacity="0.8"/>
                        <rect x="120" y="120" width="40" height="100" fill="var(--accent-cyan)" fillOpacity="0.8"/>
                        <rect x="170" y="60" width="40" height="160" fill="var(--accent-cyan)" fillOpacity="0.8"/>
                        <rect x="220" y="90" width="40" height="130" fill="var(--accent-cyan)" fillOpacity="0.8"/>
                        <rect x="270" y="50" width="40" height="170" fill="var(--accent-cyan)" fillOpacity="0.8"/>
                        <rect x="320" y="110" width="40" height="110" fill="var(--accent-purple)" fillOpacity="0.6"/>
                        <rect x="370" y="70" width="40" height="150" fill="var(--accent-purple)" fillOpacity="0.6"/>
                        <rect x="420" y="100" width="40" height="120" fill="var(--accent-purple)" fillOpacity="0.6"/>
                        <rect x="470" y="80" width="40" height="140" fill="var(--accent-purple)" fillOpacity="0.6"/>
                        <rect x="520" y="60" width="40" height="160" fill="var(--accent-purple)" fillOpacity="0.6"/>
                        <rect x="570" y="90" width="40" height="130" fill="var(--accent-purple)" fillOpacity="0.6"/>
                    </svg>
                </div>
            </div>
            <div className="graph-card">
                <h3>Sales by Category</h3>
                <div className="graph-placeholder pie-graph-placeholder">
                    <svg viewBox="0 0 200 200">
                        <path d="M100,100 L100,50 A50,50 0 0,1 150,100 Z" fill="var(--accent-cyan)" fillOpacity="0.7"/>
                        <path d="M100,100 L150,100 A50,50 0 0,1 100,150 Z" fill="var(--accent-purple)" fillOpacity="0.7"/>
                        <path d="M100,100 L100,150 A50,50 0 0,1 50,100 Z" fill="var(--accent-gold)" fillOpacity="0.7"/>
                        <path d="M100,100 L50,100 A50,50 0 0,1 100,50 Z" fill="#22c55e" fillOpacity="0.7"/>
                    </svg>
                </div>
            </div>
        </div>

        <div className="products-section">
            <div className="products-section-header">
                <h2>Products</h2>
                <Link href="/admin/addItem" className="add-product-btn">Add New Product</Link>
            </div>
            <div className="products-grid">
                <div className="product-card" data-id="saree1">
                    <img src="https://cdn0.weddingwire.in/article/2976/original/1920/jpg/116792-saree-poses-adam-lights.jpeg" alt="Designer Silk Saree"/>
                    <div className="product-card-content">
                        <h3>Designer Silk Saree</h3>
                        <p className="category">Category: Womens Clothing</p>
                        <p className="price">₹5,999</p>
                        <p className="stock in-stock">In Stock: 50</p>
                        <div className="colors">
                            <span className="chip">Red</span>
                            <span className="chip">Blue</span>
                        </div>
                        <div className="sizes">
                            <span className="chip">S</span>
                            <span className="chip">M</span>
                        </div>
                        <div className="product-card-actions">
                            <button className="action-btn edit">Edit</button>
                            <button className="action-btn delete">Delete</button>
                        </div>
                    </div>
                </div>
                <div className="product-card" data-id="saree2">
                    <img src="https://i.pinimg.com/originals/fe/ec/77/feec775ccefc621a075a8f999c7ff61a.jpg" alt="Embroidered Silk Saree"/>
                    <div className="product-card-content">
                        <h3>Embroidered Silk Saree</h3>
                        <p className="category">Category: Women Clothing</p>
                        <p className="price">₹4,999</p>
                        <p className="stock in-stock">In Stock: 30</p>
                        <div className="colors">
                            <span className="chip">Green</span>
                            <span className="chip">Gold</span>
                        </div>
                        <div className="sizes">
                            <span className="chip">M</span>
                            <span className="chip">L</span>
                        </div>
                        <div className="product-card-actions">
                            <button className="action-btn edit">Edit</button>
                            <button className="action-btn delete">Delete</button>
                        </div>
                    </div>
                </div>
                <div className="product-card" data-id="saree3">
                    <img src="https://images.squarespace-cdn.com/content/v1/5a1fac7e914e6b30d737146f/1581389245529-Y28IHE7B9I46NJS5K0PX/228A6095.jpg" alt="Banarasi Silk Saree"/>
                    <div className="product-card-content">
                        <h3>Banarasi Silk Saree</h3>
                        <p className="category">Category: Womens Clothing</p>
                        <p className="price">₹6,499</p>
                        <p className="stock out-stock">Out of Stock</p>
                        <div className="colors">
                            <span className="chip">Purple</span>
                            <span className="chip">Pink</span>
                        </div>
                        <div className="sizes">
                            <span className="chip">S</span>
                            <span className="chip">L</span>
                        </div>
                        <div className="product-card-actions">
                            <button className="action-btn edit">Edit</button>
                            <button className="action-btn delete">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}

export default Page