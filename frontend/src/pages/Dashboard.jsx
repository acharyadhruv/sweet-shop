import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSweets } from '../context/SweetContext';
import { SWEET_CATEGORIES, sweetPurchaseSchema } from '../utils/validation';
import './Dashboard.css';

const Dashboard = () => {
  const { role, logout } = useAuth();
  const { sweets, loading, fetchSweets, purchaseSweet } = useSweets();
  const navigate = useNavigate();
  
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [purchaseModal, setPurchaseModal] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSearch = () => {
    const filters = {};
    Object.keys(searchFilters).forEach(key => {
      if (searchFilters[key]) {
        filters[key] = searchFilters[key];
      }
    });
    fetchSweets(filters);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    fetchSweets();
  };

  const handlePurchase = async (sweet) => {
    setPurchaseError('');
    setPurchaseLoading(true);
    
    try {
      sweetPurchaseSchema.parse({ quantity: purchaseQuantity });
      
      const result = await purchaseSweet(sweet._id, purchaseQuantity);
      if (result.success) {
        setMessage(`Successfully purchased ${purchaseQuantity} ${sweet.name}(s)!`);
        setPurchaseModal(null);
        setPurchaseQuantity(1);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setPurchaseError(result.error);
      }
    } catch (error) {
      setPurchaseError(error.errors?.[0]?.message || 'Invalid quantity');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>🍬 Sweet Shop</h1>
        </div>
        <div className="nav-actions">
          {role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
            >
              Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h2>Available Sweets</h2>
          {message && <div className="success message">{message}</div>}
        </div>

        <div className="search-section">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchFilters.name}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                name: e.target.value
              }))}
              className="form-input"
            />
            
            <select
              value={searchFilters.category}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                category: e.target.value
              }))}
              className="form-select"
            >
              <option value="">All Categories</option>
              {SWEET_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Min Price"
              value={searchFilters.minPrice}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                minPrice: e.target.value
              }))}
              className="form-input"
            />
            
            <input
              type="number"
              placeholder="Max Price"
              value={searchFilters.maxPrice}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                maxPrice: e.target.value
              }))}
              className="form-input"
            />
            
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
            <button onClick={handleClearFilters} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading"></div>
          </div>
        ) : (
          <div className="sweets-grid">
            {sweets.length === 0 ? (
              <div className="no-results">
                <p>No sweets found matching your criteria.</p>
              </div>
            ) : (
              sweets.map(sweet => (
                <div key={sweet._id} className="sweet-card">
                  <div className="sweet-image-placeholder">
                    {/* Image placeholder - you can add images later */}
                  </div>
                  <div className="sweet-info">
                    <h3>{sweet.name}</h3>
                    <p className="sweet-category">{sweet.category}</p>
                    <div className="sweet-details">
                      <span className="sweet-price">₹{sweet.price}</span>
                      <span className="sweet-quantity">
                        Stock: {sweet.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => setPurchaseModal(sweet)}
                      disabled={sweet.quantity === 0}
                      className={`btn ${sweet.quantity === 0 ? 'btn-disabled' : 'btn-primary'}`}
                    >
                      {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {purchaseModal && (
        <div className="modal-overlay" onClick={() => setPurchaseModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Purchase {purchaseModal.name}</h3>
              <button 
                onClick={() => setPurchaseModal(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Price: ₹{purchaseModal.price} per piece</p>
              <p>Available: {purchaseModal.quantity} pieces</p>
              
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={purchaseModal.quantity}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                  className="form-input"
                />
              </div>
              
              <div className="total-price">
                <strong>Total: ₹{purchaseModal.price * purchaseQuantity}</strong>
              </div>
              
              {purchaseError && <div className="error">{purchaseError}</div>}
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setPurchaseModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => handlePurchase(purchaseModal)}
                disabled={purchaseLoading}
                className="btn btn-primary"
              >
                {purchaseLoading ? <span className="loading"></span> : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;