import { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const SweetContext = createContext();

const sweetReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SWEETS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SWEETS_SUCCESS':
      return {
        ...state,
        loading: false,
        sweets: action.payload,
        error: null
      };
    case 'FETCH_SWEETS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_SWEET_SUCCESS':
      return {
        ...state,
        sweets: [...state.sweets, action.payload]
      };
    case 'UPDATE_SWEET_SUCCESS':
      return {
        ...state,
        sweets: state.sweets.map(sweet =>
          sweet._id === action.payload._id ? action.payload : sweet
        )
      };
    case 'DELETE_SWEET_SUCCESS':
      return {
        ...state,
        sweets: state.sweets.filter(sweet => sweet._id !== action.payload)
      };
    case 'PURCHASE_SUCCESS':
    case 'RESTOCK_SUCCESS':
      return {
        ...state,
        sweets: state.sweets.map(sweet =>
          sweet._id === action.payload._id ? action.payload : sweet
        )
      };
    default:
      return state;
  }
};

const initialState = {
  sweets: [],
  loading: false,
  error: null
};

export const SweetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sweetReducer, initialState);

  const fetchSweets = async (searchParams = {}) => {
    dispatch({ type: 'FETCH_SWEETS_START' });
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const url = queryString 
        ? `http://localhost:5000/api/sweets/search?${queryString}`
        : 'http://localhost:5000/api/sweets';
      
      const response = await axios.get(url);
      dispatch({ type: 'FETCH_SWEETS_SUCCESS', payload: response.data });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch sweets';
      dispatch({ type: 'FETCH_SWEETS_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const addSweet = async (sweetData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/sweets', sweetData);
      dispatch({ type: 'ADD_SWEET_SUCCESS', payload: response.data });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add sweet';
      return { success: false, error: errorMessage };
    }
  };

  const updateSweet = async (id, sweetData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/sweets/${id}`, sweetData);
      dispatch({ type: 'UPDATE_SWEET_SUCCESS', payload: response.data });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update sweet';
      return { success: false, error: errorMessage };
    }
  };

  const deleteSweet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sweets/${id}`);
      dispatch({ type: 'DELETE_SWEET_SUCCESS', payload: id });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete sweet';
      return { success: false, error: errorMessage };
    }
  };

  const purchaseSweet = async (id, quantity) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/sweets/${id}/purchase`, {
        quantity
      });
      dispatch({ type: 'PURCHASE_SUCCESS', payload: response.data.sweet });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Purchase failed';
      return { success: false, error: errorMessage };
    }
  };

  const restockSweet = async (id, quantity) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/sweets/${id}/restock`, {
        quantity
      });
      dispatch({ type: 'RESTOCK_SUCCESS', payload: response.data.sweet });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Restock failed';
      return { success: false, error: errorMessage };
    }
  };

  return (
    <SweetContext.Provider value={{
      ...state,
      fetchSweets,
      addSweet,
      updateSweet,
      deleteSweet,
      purchaseSweet,
      restockSweet
    }}>
      {children}
    </SweetContext.Provider>
  );
};

export const useSweets = () => {
  const context = useContext(SweetContext);
  if (!context) {
    throw new Error('useSweets must be used within a SweetProvider');
  }
  return context;
};