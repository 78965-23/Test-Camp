// certificateGenerator.js – Community Certificate format
function generateCertificatePDF(app, fileNamePrefix) {
  if (!app) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const margin = 25;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - 2 * margin - 10; // extra padding

  const isCommunity = (app.type === 'community');

  // Generate certificate number
  const now = new Date();
  const year = now.getFullYear();
  const certNum = `COM/${year}/${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`;
  const applicantRef = app.referenceNumber || 'N/A';
  const date = app.submissionDate || now.toISOString().split('T')[0];

  // Build address line
  const addressParts = [
    app.village, app.po, app.ps, app.mouza, app.pin,
    app.revenue, app.subDivision, app.district, app.state
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ') || 'N/A';

  const name = app.fullName || 'N/A';
  const father = app.fatherName || 'N/A';
  const mother = app.motherName || 'N/A';
  const dob = app.dob || 'N/A';
  const community = app.community || 'N/A';
  const caste = app.caste || 'N/A';
  const subCaste = app.subCaste || 'N/A';
  const place = 'Example Town'; // or use app.place if we had

  // ---------- Border ----------
  doc.setDrawColor(0);
  doc.setLineWidth(0.8);
  doc.rect(margin - 5, margin - 5, pageWidth - 2 * (margin - 5), pageHeight - 2 * (margin - 5));

  let y = margin + 8;
  const center = pageWidth / 2;

  // ---------- Title ----------
  doc.setFontSize(22);
  doc.setFont('times', 'bold');
  doc.text('COMMUNITY CERTIFICATE', center, y, { align: 'center' });
  y += 12;

  // ---------- Certificate Details (left aligned) ----------
  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  const details = [
    `Certificate No. : ${certNum}`,
    `Applicant Ref. No. : ${applicantRef}`,
    `Date : ${date}`
  ];
  details.forEach(line => {
    doc.text(line, margin + 5, y);
    y += 7;
  });
  y += 4;

  // ---------- Applicant Details (field: value) ----------
  const fields = [
    ['Name', name],
    ["Father's Name", father],
    ["Mother's Name", mother],
    ['Date of Birth', dob],
    ['Community', community],
    ['Caste', caste],
    ['Sub-Caste', subCaste],
    ['Village', app.village || 'N/A'],
    ['P.O.', app.po || 'N/A'],
    ['P.S.', app.ps || 'N/A'],
    ['Mouza', app.mouza || 'N/A'],
    ['PIN Code', app.pin || 'N/A'],
    ['Revenue Circle', app.revenue || 'N/A'],
    ['Sub-Division', app.subDivision || 'N/A'],
    ['District', app.district || 'N/A'],
    ['State', app.state || 'N/A']
  ];

  const col1X = margin + 10;
  const col2X = margin + 65; // value column start
  fields.forEach(([label, value]) => {
    doc.setFont('times', 'bold');
    doc.text(label + ' :', col1X, y);
    doc.setFont('times', 'normal');
    const wrapped = doc.splitTextToSize(value || 'N/A', maxWidth - 55);
    wrapped.forEach((line, idx) => {
      if (idx === 0) {
        doc.text(line, col2X, y);
      } else {
        doc.text(line, col2X, y + 5 * idx);
      }
    });
    y += (wrapped.length * 5 + 2);
  });
  y += 4;

  // ---------- Declaration ----------
  const declaration = `This is to certify that Shri ${name}, son of ${father} and ${mother}, is a permanent resident of the above-mentioned address and belongs to the ${community} Community and ${subCaste} Sub-Caste.`;
  const declLines = doc.splitTextToSize(declaration, maxWidth - 10);
  declLines.forEach(line => {
    doc.text(line, center, y, { align: 'center' });
    y += 7;
  });
  y += 4;

  const note = 'The community is recognized by the Government for official purposes as per applicable rules and records.';
  const noteLines = doc.splitTextToSize(note, maxWidth - 10);
  noteLines.forEach(line => {
    doc.text(line, center, y, { align: 'center' });
    y += 7;
  });
  y += 8;

  // ---------- Place ----------
  doc.text(`Place : ${place}`, margin + 10, y);
  y += 18;

  // ---------- Office details (right aligned) ----------
  const officeY = y;
  doc.text('OFFICE OF EXAMINER', pageWidth - margin - 10, officeY, { align: 'right' });
  doc.text('OFFICE OF SEAL', pageWidth - margin - 10, officeY + 8, { align: 'right' });
  doc.text('Signature', pageWidth - margin - 10, officeY + 16, { align: 'right' });
  doc.text('Issuing Authority', pageWidth - margin - 10, officeY + 24, { align: 'right' });
  doc.text('Office of Example', pageWidth - margin - 10, officeY + 32, { align: 'right' });

  // ---------- Footer ----------
  const footerY = pageHeight - margin - 6;
  doc.setFontSize(8);
  doc.setFont('times', 'italic');
  doc.text('This is a computer-generated certificate.', center, footerY, { align: 'center' });

  // ---------- Download ----------
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  const prefix = fileNamePrefix || 'community-cert';
  link.download = `${prefix}-${app.referenceNumber || 'download'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
