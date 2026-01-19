import React from 'react';
import './SettlementTable.css';

export default function SettlementTable({ calculations }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="settlement-table">
      <h3>Tính Toán Tháng</h3>
      <table className="calc-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Tổng Chi Phí</th>
            <th>Đã Chi</th>
            <th>Còn Phải Đóng</th>
            <th>Ngân Hàng</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calc) => (
            <tr key={calc.id} className={calc.owes > 0 ? 'owes' : 'overpaid'}>
              <td className="name">{calc.name}</td>
              <td className="amount">{formatCurrency(calc.totalExpense)}</td>
              <td className="paid">{formatCurrency(calc.paid)}</td>
              <td className={`owes-amount ${calc.owes > 0 ? 'negative' : 'positive'}`}>
                {formatCurrency(Math.abs(calc.owes))}
              </td>
              <td className="bank">{calc.bank || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
