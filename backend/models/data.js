// In-memory database (có thể thay bằng MongoDB)
export let expenses = [];
export let members = [];

// Expenses data structure
export const defaultExpenses = [
  {
    id: 1,
    date: '2026-01-08',
    description: 'Tiền điện',
    amount: 3495960,
    category: 'Utilities',
    payer: 'A Việt',
    participants: ['A Việt', 'C Phương', 'A Hải', 'Kiến', 'Dung', 'C Liên', 'Tuấn', 'NA', 'A Nam', 'Đức'],
    status: 'Completed'
  },
  {
    id: 2,
    date: '2026-01-15',
    description: 'Tiền nước',
    amount: 768200,
    category: 'Utilities',
    payer: 'C Phương',
    participants: ['A Việt', 'C Phương', 'A Hải', 'Kiến', 'Dung', 'C Liên', 'Tuấn', 'NA', 'A Nam', 'Đức'],
    status: 'Completed'
  },
  {
    id: 3,
    date: '2026-01-18',
    description: 'Tiền internet',
    amount: 378000,
    category: 'Utilities',
    payer: 'A Hải',
    participants: ['A Việt', 'C Phương', 'A Hải', 'Kiến', 'Dung', 'C Liên', 'Tuấn', 'NA', 'A Nam', 'Đức'],
    status: 'Completed'
  }
];

export const defaultMembers = [
  { id: 1, name: 'A Việt', bank: 'Vietcombank', account: '9964448968' },
  { id: 2, name: 'C Phương', bank: 'VPBank', account: '0352031381' },
  { id: 3, name: 'A Hải', bank: 'VPBank', account: '162940414' },
  { id: 4, name: 'Kiến', bank: 'Vietinbank', account: '0978137928' },
  { id: 5, name: 'Dung', bank: 'MB Bank', account: '0355390581' },
  { id: 6, name: 'C Liên', bank: 'VCB', account: '1031906128' },
  { id: 7, name: 'Tuấn', bank: 'MB Bank', account: '0386107787' },
  { id: 8, name: 'NA', bank: 'VPBank', account: '1515902' },
  { id: 9, name: 'A Nam', bank: 'SHB', account: '0948869610' },
  { id: 10, name: 'Đức', bank: 'BIDV', account: '4650581798' }
];

// Initialize
expenses = [...defaultExpenses];
members = [...defaultMembers];
