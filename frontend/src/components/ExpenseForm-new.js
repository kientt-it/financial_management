import React, { useState, useEffect } from 'react';
import { membersAPI } from '../api';
import './ExpenseForm.css';

const DEFAULT_CATEGORIES = [
  'Tiền ăn',
  'Tiền điện',
  'Tiền nước',
  'Tiền internet',
  'Tiền nhà',
  'Mua sắm',
  'Khác'
];

export default function ExpenseForm({ onSubmit, initialData = null }) {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: 'Tiền ăn',
      payer: '',
      participants: [],
    }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await membersAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError('Lỗi load danh sách người dùng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (userId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(p => p !== userId)
        : [...prev.participants, userId],
    }));
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setFormData(prev => ({
        ...prev,
        category: newCategory
      }));
      setNewCategory('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.payer) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (formData.participants.length === 0) {
      alert('Vui lòng chọn ít nhất một người tham gia');
      return;
    }
    onSubmit(formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: 'Tiền ăn',
      payer: '',
      participants: [],
    });
  };

  if (loading) {
    return <div className="expense-form">Đang tải danh sách người dùng...</div>;
  }

  return (
    <div className="expense-form">
      <h2>💰 Thêm chi phí</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Ngày</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số tiền</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              step="1000"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Nội dung</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tiền ăn, tiền điện..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Thêm danh mục mới</label>
            <div className="category-input">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Tên danh mục"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="btn-add-category"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Người thanh toán *</label>
          <select
            name="payer"
            value={formData.payer}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn người --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.fullName} (@{user.username})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Người tham gia * ({formData.participants.length} người)</label>
          <div className="participants-list">
            {users.length === 0 ? (
              <p className="empty-message">Không có người dùng nào</p>
            ) : (
              users.map(user => (
                <label key={user.id} className="participant-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(user.id)}
                    onChange={() => handleParticipantChange(user.id)}
                  />
                  <span>{user.fullName}</span>
                  <span className="username">@{user.username}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <button type="submit" className="btn-submit">
          {initialData ? '💾 Cập nhật' : '➕ Thêm chi phí'}
        </button>
      </form>
    </div>
  );
}
