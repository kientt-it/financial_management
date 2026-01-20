import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = ({ onSwitchToRegister }) => {
  const { login, loading, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.username || !formData.password) {
      setErrorMsg('Please fill all fields');
      return;
    }

    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>💰 Sinh Hoạt Chung</h1>
        <p>Quản lý chi phí hàng tháng</p>

        <form onSubmit={handleSubmit}>
          {(errorMsg || error) && (
            <div className="error-message">
              {errorMsg || error}
            </div>
          )}

          <div className="form-group">
            <label>Tài khoản</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tài khoản"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="switch-auth">
          Chưa có tài khoản?{' '}
          <button 
            onClick={onSwitchToRegister}
            className="link-button"
          >
            Đăng ký
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
