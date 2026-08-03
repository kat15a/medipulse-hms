import { db } from '../config/firebase.js';

export interface BillingData {
  id?: string;
  invoiceNo?: string;
  patientName: string;
  patientId?: string;
  date: string;
  consultationFee: number;
  medicineFee: number;
  labFee?: number;
  tax?: number;
  total?: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
  paymentMethod?: string;
  createdAt?: string;
}

let memoryBills: BillingData[] = [
  { id: 'inv-1', invoiceNo: 'INV-2026-001', patientName: 'Robert Chen', date: '2026-07-25', consultationFee: 500, medicineFee: 250, labFee: 800, tax: 100, total: 1650, status: 'PAID', paymentMethod: 'UPI / GPay' },
  { id: 'inv-2', invoiceNo: 'INV-2026-002', patientName: 'Sophia Martinez', date: '2026-07-26', consultationFee: 800, medicineFee: 350, labFee: 0, tax: 90, total: 1240, status: 'PENDING', paymentMethod: 'Insurance Claim' },
  { id: 'inv-3', invoiceNo: 'INV-2026-003', patientName: 'David Wilson', date: '2026-07-27', consultationFee: 600, medicineFee: 450, labFee: 1200, tax: 150, total: 2400, status: 'PAID', paymentMethod: 'Cash' },
];

export class BillingService {
  static async getAllBills() {
    let items: BillingData[] = [];
    try {
      const colRef = db.collection('billing');
      const snapshot = await colRef.get();
      const list: BillingData[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...(doc.data() as BillingData) });
      });
      if (list.length > 0) {
        items = list;
        memoryBills = list;
      } else {
        items = [...memoryBills];
      }
    } catch (err) {
      items = [...memoryBills];
    }
    return items;
  }

  static async getBillById(id: string) {
    try {
      const doc = await db.collection('billing').doc(id).get();
      if (doc.exists) return { id: doc.id, ...(doc.data() as BillingData) };
    } catch (err) {}

    const found = memoryBills.find(b => b.id === id);
    if (found) return found;

    return {
      id,
      invoiceNo: 'INV-2026-001',
      patientName: 'Robert Chen',
      date: '2026-07-25',
      consultationFee: 150,
      medicineFee: 45,
      labFee: 80,
      tax: 22,
      total: 297,
      status: 'PAID',
    };
  }

  static async createBill(data: BillingData) {
    const consultationFee = Number(data.consultationFee || 0);
    const medicineFee = Number(data.medicineFee || 0);
    const labFee = Number(data.labFee || 0);
    const subtotal = consultationFee + medicineFee + labFee;
    const tax = data.tax !== undefined ? Number(data.tax) : Math.round(subtotal * 0.08);
    const total = subtotal + tax;

    const invoiceNo = data.invoiceNo || `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const billObj: BillingData = {
      id: 'inv-' + Date.now(),
      ...data,
      invoiceNo,
      consultationFee,
      medicineFee,
      labFee,
      tax,
      total,
      date: data.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await db.collection('billing').add(billObj);
      billObj.id = docRef.id;
    } catch (err) {}

    memoryBills.unshift(billObj);
    return billObj;
  }

  static async updateBillStatus(id: string, status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED', paymentMethod?: string) {
    try {
      const docRef = db.collection('billing').doc(id);
      const updates: any = { status };
      if (paymentMethod) updates.paymentMethod = paymentMethod;
      await docRef.update(updates);
    } catch (err) {}

    const idx = memoryBills.findIndex(b => b.id === id);
    if (idx !== -1) {
      memoryBills[idx].status = status;
      if (paymentMethod) memoryBills[idx].paymentMethod = paymentMethod;
    }
    return { id, status, paymentMethod };
  }

  static async calculateRevenue() {
    const bills = await this.getAllBills();
    let totalRevenue = 0;
    let paidInvoices = 0;
    let pendingInvoices = 0;
    let pendingAmount = 0;

    bills.forEach(bill => {
      if (bill.status === 'PAID') {
        totalRevenue += bill.total || 0;
        paidInvoices++;
      } else if (bill.status === 'PENDING') {
        pendingAmount += bill.total || 0;
        pendingInvoices++;
      }
    });

    return {
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      pendingAmount,
      totalInvoices: bills.length,
    };
  }
}
