import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = ({ onSwitchToLogin }) => {
  const { register, loading, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    email: ''
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

    if (!formData.username || !formData.fullName || !formData.password) {
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await register(
        formData.username,
        formData.fullName,
        formData.password,
        formData.email
      );
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>💰 Tạo tài khoản</h1>
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
              placeholder="Chọn tên tài khoản"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Tên đầy đủ</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email (tuỳ chọn)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
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
              placeholder="Tối thiểu 6 ký tự"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <p className="switch-auth">
          Đã có tài khoản?{' '}
          <button 
            onClick={onSwitchToLogin}
            className="link-button"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
