import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm-new';
import ExpenseList from '../components/ExpenseList';
import SettlementTable from '../components/SettlementTable';
import UserProfile from '../components/UserProfile';
import { expensesAPI, calculationsAPI } from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().split('T')[0].slice(0, 7)
  );
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadMonthlyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Loading expenses from API...');
      const expRes = await expensesAPI.getAll();
      console.log('✅ Expenses loaded:', expRes.length);
      setExpenses(expRes);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setError(`Lỗi kết nối API: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyData = async () => {
    try {
      console.log('📈 Loading monthly calculations...');
      const res = await calculationsAPI.getMonthly(selectedMonth);
      console.log('✅ Calculations loaded:', res.data.length);
      setCalculations(res.data);
    } catch (error) {
      console.error('❌ Error loading calculations:', error);
    }
  };

  const handleAddExpense = async (formData) => {
    try {
      if (editingExpense) {
        await expensesAPI.update(editingExpense.id, formData);
        setEditingExpense(null);
      } else {
        await expensesAPI.create(formData);
      }
      await loadData();
      await loadMonthlyData();
      alert(editingExpense ? 'Cập nhật thành công!' : 'Thêm chi phí thành công!');
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Lỗi khi lưu chi phí');
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa chi phí này?')) {
      try {
        await expensesAPI.delete(id);
        await loadData();
        await loadMonthlyData();
        alert('Xóa thành công!');
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Lỗi khi xóa chi phí');
      }
    }
  };

  const monthlyExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💰 Sinh Hoạt Chung</h1>
          <p>Quản lý chi phí hàng tháng</p>
        </div>
      </header>

      <div className="container">
        <div className="controls">
          <div className="month-picker">
            <label>Chọn tháng:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <strong>⚠️ {error}</strong>
            <p style={{ fontSize: '12px', marginTop: '5px' }}>
              Kiểm tra: Backend có chạy không? MONGODB_URI config đúng chưa?
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <>
            <UserProfile />
            
            <ExpenseForm
              onSubmit={handleAddExpense}
              initialData={editingExpense}
            />

            {monthlyExpenses.length > 0 && (
              <SettlementTable calculations={calculations} />
            )}

            {monthlyExpenses.length > 0 ? (
              <ExpenseList
                expenses={monthlyExpenses}
                members={members}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            ) : (
              <div className="empty-state">
                <p>Không có chi phí nào trong tháng này</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
