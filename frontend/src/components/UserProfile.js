import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bank: user?.bank || '',
    accountNumber: user?.accountNumber || '',
    accountHolder: user?.accountHolder || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar">👤</div>
        <div className="user-info">
          <h3>{user?.fullName}</h3>
          <p>@{user?.username}</p>
        </div>
        <button 
          className="logout-btn"
          onClick={logout}
          title="Đăng xuất"
        >
          ✕
        </button>
      </div>

      {!isEditing && (
        <div className="profile-view">
          <button 
            className="btn-edit"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      )}

      {isEditing && (
        <div className="profile-edit">
          <div className="form-group">
            <label>Tên đầy đủ</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ngân hàng</label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              placeholder="VCB, VPBank, ..."
            />
          </div>

          <div className="form-group">
            <label>Số tài khoản</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Chủ tài khoản</label>
            <input
              type="text"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="profile-actions">
            <button 
              className="btn-save"
              onClick={handleSave}
            >
              Lưu
            </button>
            <button 
              className="btn-cancel"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
