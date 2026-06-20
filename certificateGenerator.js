// certificateGenerator.js – shared PDF generation
function generateCertificatePDF(app, fileNamePrefix) {
  // If no app, return
  if (!app) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Border
  doc.setDrawColor(0);
  doc.setLineWidth(1);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

  let y = margin + 20;
  const center = pageWidth / 2;

  // Type names and phrases
  const typeNames = {
    academic: 'Academic Excellence',
    professional: 'Professional Achievement',
    community: 'Community Service',
    training: 'Training Program',
    billionaire: 'Billionaire Cert',
    millionaire: 'Millionaire Cert',
    trillionaire: 'Trillionaire Cert',
    mathexpert: 'Math Expert Cert',
    coaching: 'Coaching Registration'
  };

  const certPhrases = {
    academic: 'has successfully completed the Academic Excellence program.',
    professional: 'has successfully completed the Professional Achievement program.',
    community: 'has successfully completed the Community Service program.',
    training: 'has successfully completed the Training Program.',
    billionaire: 'is recognized as a Billionaire.',
    millionaire: 'is recognized as a Millionaire.',
    trillionaire: 'is recognized as a Trillionaire.',
    mathexpert: 'is a certified Math Expert.',
    coaching: 'has successfully registered for the Coaching Program.'
  };

  // Title
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('CERTIFICATE OF ACHIEVEMENT', center, y, { align: 'center' });
  y += 12;

  doc.setFontSize(12);
  doc.setFont('times', 'normal');
  doc.text('This is to certify that', center, y, { align: 'center' });
  y += 10;

  // Name
  const name = app.fullName || 'N/A';
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text(name, center, y, { align: 'center' });
  const nameWidth = doc.getStringUnitWidth(name) * 16 / doc.internal.scaleFactor;
  doc.line(center - nameWidth / 2, y + 1, center + nameWidth / 2, y + 1);
  y += 12;

  // Phrase
  const phrase = certPhrases[app.type] || 'has successfully completed the certificate program.';
  doc.setFontSize(12);
  doc.setFont('times', 'normal');
  doc.text(phrase, center, y, { align: 'center' });
  y += 12;

  // Details
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  const details = [
    `Reference No: ${app.referenceNumber}`,
    `Certificate No: ${app.certificateNumber || 'Not issued'}`,
    `Date: ${app.submissionDate || new Date().toISOString().split('T')[0]}`,
    `Email: ${app.email || 'N/A'}`,
    `Phone: ${app.phone || 'N/A'}`,
    `Address: ${app.address || app.residentialAddress || 'N/A'}`
  ];
  const extraFields = ['institution', 'company', 'organization', 'program', 'major', 'position', 'project'];
  extraFields.forEach(f => {
    if (app[f]) details.push(`${f.charAt(0).toUpperCase() + f.slice(1)}: ${app[f]}`);
  });

  let detailY = y + 6;
  details.forEach(line => {
    doc.text(line, margin + 10, detailY);
    detailY += 7;
  });

  // Footer
  const footerY = pageHeight - margin - 15;
  doc.setFontSize(9);
  doc.setFont('times', 'italic');
  doc.text('This certificate is issued by CertifyHub and is digitally verifiable.', center, footerY, { align: 'center' });

  // Download
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
