import React, { useState } from 'react';
import './ExpenseForm.css';

export default function ExpenseForm({ onSubmit, members, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: 'Utilities',
      payer: '',
      participants: [],
      status: 'Pending',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (memberName) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(memberName)
        ? prev.participants.filter(p => p !== memberName)
        : [...prev.participants, memberName],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.payer) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    onSubmit(formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: 'Utilities',
      payer: '',
      participants: [],
      status: 'Pending',
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Ngày *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nội dung *</label>
          <input
            type="text"
            name="description"
            placeholder="Tiền điện, tiền nước..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Chi phí (đ) *</label>
          <input
            type="number"
            name="amount"
            placeholder="0"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Danh mục</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Utilities">Tiện ích</option>
            <option value="Food">Thực phẩm</option>
            <option value="Transport">Vận chuyển</option>
            <option value="Other">Khác</option>
          </select>
        </div>
        <div className="form-group">
          <label>Người thanh toán *</label>
          <select name="payer" value={formData.payer} onChange={handleChange} required>
            <option value="">-- Chọn --</option>
            {members.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Trạng thái</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Chưa thanh toán</option>
            <option value="Completed">Đã thanh toán</option>
          </select>
        </div>
      </div>

      <div className="form-group full">
        <label>Người tham gia</label>
        <div className="participants-grid">
          {members.map(member => (
            <label key={member.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.participants.includes(member.name)}
                onChange={() => handleParticipantChange(member.name)}
              />
              {member.name}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-submit">
        {initialData ? 'Cập nhật' : 'Thêm chi phí'}
      </button>
    </form>
  );
}
