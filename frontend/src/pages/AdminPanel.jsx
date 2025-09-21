import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSweets } from '../context/SweetContext';
import { 
  SWEET_CATEGORIES, 
  sweetSchema, 
  sweetUpdateSchema, 
  sweetRestockSchema 
} from '../utils/validation';
import './AdminPanel.css';

const AdminPanel = () => {
  const { logout } = useAuth();
  const { 
    sweets, 
    loading, 
    fetchSweets, 
    addSweet, 
    updateSweet, 
    deleteSweet, 
    restockSweet 
  } = useSweets();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('view');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Add Sweet Form
  const [newSweet, setNewSweet] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);

  // Edit Sweet Modal
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Restock Modal
  const [restockModal, setRestockModal] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [restockError, setRestockError] = useState('');
  const [restockLoading, setRestockLoading] = useState(false);

  useEffect(() => {
    fetchSweets();
  }, []);

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setMessage('');
    } else {
      setMessage(msg);
      setError('');
    }
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();
    setAddErrors({});
    setAddLoading(true);

    try {
      const sweetData = {
        ...newSweet,
        price: parseFloat(newSweet.price),
        quantity: parseInt(newSweet.quantity)
      };
      
      sweetSchema.parse(sweetData);
      
      const result = await addSweet(sweetData);
      if (result.success) {
        showMessage('Sweet added successfully!');
        setNewSweet({ name: '', category: '', price: '', quantity: '' });
        setActiveTab('view');
      } else {
        showMessage(result.error, true);
      }
    } catch (error) {
      const fieldErrors = {};
      if (error.errors) {
        error.errors.forEach(err => {
          fieldErrors[err.path[0]] = err.message;
        });
        setAddErrors(fieldErrors);
      } else {
        showMessage('Failed to add sweet', true);
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSweet = async () => {
    setEditErrors({});
    setEditLoading(true);

    try {
      const updateData = {};
      Object.keys(editData).forEach(key => {
        if (editData[key] !== '' && editData[key] !== undefined) {
          if (key === 'price' || key === 'quantity') {
            updateData[key] = key === 'price' ? 
              parseFloat(editData[key]) : parseInt(editData[key]);
          } else {
            updateData[key] = editData[key];
          }
        }
      });

      if (Object.keys(updateData).length === 0) {
        showMessage('No changes to save', true);
        setEditLoading(false);
        return;
      }
      
      sweetUpdateSchema.parse(updateData);
      
      const result = await updateSweet(editModal._id, updateData);
      if (result.success) {
        showMessage('Sweet updated successfully!');
        setEditModal(null);
        setEditData({});
      } else {
        showMessage(result.error, true);
      }
    } catch (error) {
      const fieldErrors = {};
      if (error.errors) {
        error.errors.forEach(err => {
          fieldErrors[err.path[0]] = err.message;
        });
        setEditErrors(fieldErrors);
      } else {
        showMessage('Failed to update sweet', true);
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSweet = async (sweet) => {
    if (window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
      const result = await deleteSweet(sweet._id);
      if (result.success) {
        showMessage('Sweet deleted successfully!');
      } else {
        showMessage(result.error, true);
      }
    }
  };

  const handleRestock = async () => {
    setRestockError('');
    setRestockLoading(true);

    try {
      const quantity = parseInt(restockQuantity);
      sweetRestockSchema.parse({ quantity });
      
      const result = await restockSweet(restockModal._id, quantity);
      if (result.success) {
        showMessage('Sweet restocked successfully!');
        setRestockModal(null);
        setRestockQuantity('');
      } else {
        setRestockError(result.error);
      }
    } catch (error) {
      setRestockError(error.errors?.[0]?.message || 'Invalid quantity');
    } finally {
      setRestockLoading(false);
    }
  };

  const openEditModal = (sweet) => {
    setEditModal(sweet);
    setEditData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString()
    });
    setEditErrors({});
  };

  return (
    <div className="admin-panel">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>🍬 Sweet Shop Admin</h1>
        </div>
        <div className="nav-actions">
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Back to Shop
          </button>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-danger">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {(message || error) && (
          <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
            {message || error}
          </div>
        )}

        <div className="admin-tabs">
          <button 
            onClick={() => setActiveTab('view')}
            className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          >
            View Sweets
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          >
            Add Sweet
          </button>
        </div>

        {activeTab === 'view' && (
          <div className="admin-content">
            <h2>Manage Sweets</h2>
            {loading ? (
              <div className="loading-container">
                <div className="loading"></div>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sweets.map(sweet => (
                      <tr key={sweet._id}>
                        <td>{sweet.name}</td>
                        <td>{sweet.category}</td>
                        <td>₹{sweet.price}</td>
                        <td>
                          <span className={sweet.quantity < 10 ? 'low-stock' : ''}>
                            {sweet.quantity}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => openEditModal(sweet)}
                              className="btn btn-sm btn-primary"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => setRestockModal(sweet)}
                              className="btn btn-sm btn-secondary"
                            >
                              Restock
                            </button>
                            <button 
                              onClick={() => handleDeleteSweet(sweet)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="admin-content">
            <div className="add-sweet-form">
              <h2>Add New Sweet</h2>
              <form onSubmit={handleAddSweet}>
                <div className="form-group">
                  <label className="form-label">Sweet Name</label>
                  <input
                    type="text"
                    value={newSweet.name}
                    onChange={(e) => setNewSweet(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="Enter sweet name"
                  />
                  {addErrors.name && <div className="error">{addErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={newSweet.category}
                    onChange={(e) => setNewSweet(prev => ({ ...prev, category: e.target.value }))}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    {SWEET_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {addErrors.category && <div className="error">{addErrors.category}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newSweet.price}
                      onChange={(e) => setNewSweet(prev => ({ ...prev, price: e.target.value }))}
                      className="form-input"
                      placeholder="0.00"
                    />
                    {addErrors.price && <div className="error">{addErrors.price}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      value={newSweet.quantity}
                      onChange={(e) => setNewSweet(prev => ({ ...prev, quantity: e.target.value }))}
                      className="form-input"
                      placeholder="0"
                    />
                    {addErrors.quantity && <div className="error">{addErrors.quantity}</div>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={addLoading}
                  className="btn btn-primary"
                >
                  {addLoading ? <span className="loading"></span> : 'Add Sweet'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit {editModal.name}</h3>
              <button onClick={() => setEditModal(null)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
                {editErrors.name && <div className="error">{editErrors.name}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={editData.category || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select"
                >
                  {SWEET_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {editErrors.category && <div className="error">{editErrors.category}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editData.price || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
                    className="form-input"
                  />
                  {editErrors.price && <div className="error">{editErrors.price}</div>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    value={editData.quantity || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="form-input"
                  />
                  {editErrors.quantity && <div className="error">{editErrors.quantity}</div>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setEditModal(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleEditSweet}
                disabled={editLoading}
                className="btn btn-primary"
              >
                {editLoading ? <span className="loading"></span> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockModal && (
        <div className="modal-overlay" onClick={() => setRestockModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Restock {restockModal.name}</h3>
              <button onClick={() => setRestockModal(null)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <p>Current Stock: {restockModal.quantity}</p>
              <div className="form-group">
                <label className="form-label">Add Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  className="form-input"
                  placeholder="Enter quantity to add"
                />
              </div>
              {restockError && <div className="error">{restockError}</div>}
            </div>
            <div className="modal-footer">
              <button onClick={() => setRestockModal(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleRestock}
                disabled={restockLoading}
                className="btn btn-primary"
              >
                {restockLoading ? <span className="loading"></span> : 'Restock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
