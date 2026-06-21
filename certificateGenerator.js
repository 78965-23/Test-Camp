// certificateGenerator.js – Professional PDF with two formats
function generateCertificatePDF(app, fileNamePrefix) {
  if (!app) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const center = pageWidth / 2;

  // ---------- Decide format based on type ----------
  const completionTypes = ['academic', 'training', 'coaching'];
  const isCompletion = completionTypes.includes(app.type);

  // ---------- Helper to add a line with underline ----------
  function addField(label, value, x, y, labelWidth) {
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    const labelStr = label + ': ';
    doc.text(labelStr, x, y);
    const textX = x + doc.getStringUnitWidth(labelStr) * 11 / doc.internal.scaleFactor;
    doc.setFont('times', 'bold');
    const val = value || '___________________';
    doc.text(val, textX, y);
    const valWidth = doc.getStringUnitWidth(val) * 11 / doc.internal.scaleFactor;
    doc.line(textX, y + 0.5, textX + valWidth, y + 0.5);
    return y + 8;
  }

  // ---------- Draw border ----------
  doc.setDrawColor(0);
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

  let y = margin + 15;

  // ---------- TITLE ----------
  doc.setFontSize(20);
  doc.setFont('times', 'bold');
  const title = isCompletion ? 'CERTIFICATE OF COMPLETION' : 'CERTIFICATE';
  doc.text(title, center, y, { align: 'center' });
  y += 12;

  // ---------- BODY ----------
  doc.setFontSize(12);
  doc.setFont('times', 'normal');

  if (isCompletion) {
    // ----- Certificate of Completion -----
    const lines = [
      `This is to certify that Mr./Ms. ${app.fullName || '_________________________'}`,
      `has successfully completed the ${app.type || '_________________________'} Programme`,
      `conducted by ${app.organization || app.institution || app.provider || '_________________________'}`,
      `from ${app.startDate || '______________'} to ${app.completionDate || '______________'}.`,
      '',
      'During the programme, the participant attended the required sessions',
      'and fulfilled the prescribed requirements of the programme.',
      '',
      'We appreciate the participant\'s dedication and involvement and',
      'wish him/her success in future endeavors.'
    ];

    lines.forEach(line => {
      if (line.trim() === '') {
        y += 6;
        return;
      }
      doc.text(line, center, y, { align: 'center' });
      y += 7;
    });

    y += 6;

    // ----- Place & Date -----
    const place = app.city || app.address || '______________';
    const date = app.submissionDate || new Date().toISOString().split('T')[0];
    doc.text(`Date: ${date}`, margin + 10, y);
    doc.text(`Place: ${place}`, pageWidth - margin - 40, y);
    y += 18;

    // ----- Signature & Organization -----
    doc.setFont('times', 'bold');
    doc.text('Authorized Signatory', center, y, { align: 'center' });
    y += 6;
    doc.setFont('times', 'normal');
    doc.text('_________________________', center, y, { align: 'center' });
    y += 8;
    doc.setFont('times', 'bold');
    doc.text('Organization / Institution Name', center, y, { align: 'center' });
    y += 6;
    doc.setFont('times', 'normal');
    doc.text('(Official Seal)', center, y, { align: 'center' });

  } else {
    // ----- Character Certificate (for professional, community, wealth, expert) -----
    const fullName = app.fullName || '_________________________';
    const fatherName = '_________________________'; // we don't have this field
    const address = app.residentialAddress || app.address || '_________________________';

    const lines = [
      `This is to certify that Mr./Ms. ${fullName},`,
      `son/daughter of ${fatherName},`,
      `resident of ${address},`,
      'is known to me and the particulars furnished by him/her have been',
      'verified and found correct to the best of my knowledge and belief.',
      '',
      'This certificate is issued on the basis of available records and',
      'personal verification for official purposes.'
    ];

    lines.forEach(line => {
      if (line.trim() === '') {
        y += 6;
        return;
      }
      doc.text(line, center, y, { align: 'center' });
      y += 7;
    });

    y += 8;

    // ----- Place & Date -----
    const place = app.city || app.address || '______________';
    const date = app.submissionDate || new Date().toISOString().split('T')[0];
    doc.text(`Place: ${place}`, margin + 10, y);
    doc.text(`Date: ${date}`, pageWidth - margin - 40, y);
    y += 20;

    // ----- Signature, Name, Designation, Seal -----
    doc.text('Signature: _________________________', margin + 10, y);
    y += 12;
    doc.text(`Name: ${app.fullName || '_________________________'}`, margin + 10, y);
    y += 12;
    doc.text('Designation: _________________________', margin + 10, y);
    y += 12;
    doc.text('Office Seal', pageWidth - margin - 40, y);
  }

  // ---------- Footer ----------
  const footerY = pageHeight - margin - 8;
  doc.setFontSize(8);
  doc.setFont('times', 'italic');
  doc.text('This is a computer-generated certificate. No signature required.', center, footerY, { align: 'center' });

  // ---------- Download ----------
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  const prefix = fileNamePrefix || 'certificate';
  link.download = `${prefix}-${app.referenceNumber || 'download'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
