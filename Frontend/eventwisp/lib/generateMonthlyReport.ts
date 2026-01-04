import {MonthlyEarningDetails} from "@/types/entityTypes";

export async function downloadMonthlyPDF(
    data: MonthlyEarningDetails[],
    organizerId: string | number,
    year: string | number
) {
    // 1. load libs
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;

    // 2. create doc
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    // 3. header
    doc.setFontSize(18);
    doc.text('Monthly Earnings Report', 40, 40);
    doc.setFontSize(12);
    doc.text(`Organizer ID: ${organizerId}  |  Year: ${year}`, 40, 65);

    // 4. table
    autoTable(doc, {
        head: [['Month', 'Earnings (LKR)']],
        body: data.map((m) => [m.monthName, m.totalEarnings.toLocaleString()]),
        startY: 90,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] },
        styles: { fontSize: 11, cellPadding: 5 },
    });

    // 5. total
    const total = data.reduce((s, m) => s + m.totalEarnings, 0);
    doc.text(
        `Total: ${total.toLocaleString()} LKR`,
        40,
        (doc as any).lastAutoTable.finalY + 25
    );

    // 6. download
    doc.save(`monthly-earnings-${organizerId}-${year}.pdf`);
}