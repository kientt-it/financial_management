import React from 'react';
import './ExpenseList.css';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="expense-list">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Nội dung</th>
            <th>Chi phí</th>
            <th>Người thanh toán</th>
            <th>Người tham gia</th>
            <th>Thực hiện</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className={expense.status === 'Completed' ? 'completed' : ''}>
              <td>{new Date(expense.date).toLocaleDateString('vi-VN')}</td>
              <td className="description">{expense.description}</td>
              <td className="amount">{formatCurrency(expense.amount)}</td>
              <td className="payer">{expense.payer}</td>
              <td className="participants">
                <span className="badge">{expense.participants?.length || 1} người</span>
              </td>
              <td>
                <span className={`status ${expense.status?.toLowerCase()}`}>
                  {expense.status === 'Completed' ? '✓' : '○'}
                </span>
              </td>
              <td className="actions">
                <button onClick={() => onEdit(expense)} className="btn-edit">Sửa</button>
                <button onClick={() => onDelete(expense.id)} className="btn-delete">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
