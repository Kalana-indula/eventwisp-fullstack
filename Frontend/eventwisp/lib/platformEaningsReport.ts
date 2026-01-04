import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TotalMonthlyEarningDetails } from '@/types/entityTypes';

export function downloadTotalEarningsReport(
    data: TotalMonthlyEarningDetails[],
    year: string
) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    doc.setFontSize(18);
    doc.text('Platform Annual Earnings Report', 40, 40);
    doc.setFontSize(12);
    doc.text(`Year: ${year}`, 40, 65);

    autoTable(doc, {
        head: [['Month', 'Total Earnings (LKR)']],
        body: data.map((m) => [m.monthName, m.totalEarnings.toLocaleString()]),
        startY: 90,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] },
        styles: { fontSize: 11, cellPadding: 5 },
    });

    const grandTotal = data.reduce((s, m) => s + m.totalEarnings, 0);
    doc.text(
        `Grand Total:  ${grandTotal.toLocaleString()} LKR`,
        40,
        (doc as any).lastAutoTable.finalY + 25
    );

    doc.save(`annual-earnings-${year}.pdf`);
}