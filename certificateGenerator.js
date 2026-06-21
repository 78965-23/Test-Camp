// certificateGenerator.js – Universal generator for all types
function generateCertificatePDF(app, fileNamePrefix) {
  if (!app) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const margin = 25;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - 2 * margin - 10;

  const isCommunity = (app.type === 'community');
  const completionTypes = ['academic', 'training', 'coaching'];
  const isCompletion = completionTypes.includes(app.type);

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
  const place = app.city || app.district || 'Fantasy, Comedy Nagar';
  const date = app.submissionDate || new Date().toISOString().split('T')[0];

  // ---------- Border ----------
  doc.setDrawColor(0);
  doc.setLineWidth(0.8);
  doc.rect(margin - 5, margin - 5, pageWidth - 2 * (margin - 5), pageHeight - 2 * (margin - 5));

  let y = margin + 8;
  const center = pageWidth / 2;

  // ---------- Title ----------
  doc.setFontSize(22);
  doc.setFont('times', 'bold');
  if (isCommunity) {
    doc.text('COMMUNITY CERTIFICATE', center, y, { align: 'center' });
  } else if (isCompletion) {
    doc.text('CERTIFICATE OF COMPLETION', center, y, { align: 'center' });
  } else {
    doc.text('CERTIFICATE', center, y, { align: 'center' });
  }
  y += 12;

  // ---------- Community Certificate (special) ----------
  if (isCommunity) {
    // Certificate No. etc.
    const certNum = `COM/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`;
    const applicantRef = app.referenceNumber || 'N/A';
    const details = [
      `Certificate No. : ${certNum}`,
      `Applicant Ref. No. : ${applicantRef}`,
      `Date : ${date}`
    ];
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    details.forEach(line => {
      doc.text(line, margin + 5, y);
      y += 7;
    });
    y += 4;

    // Applicant fields
    const fields = [
      ['Name', name],
      ["Father's Name", father],
      ["Mother's Name", mother],
      ['Date of Birth', dob],
      ['Community', app.community || 'N/A'],
      ['Caste', app.caste || 'N/A'],
      ['Sub-Caste', app.subCaste || 'N/A'],
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
    const col2X = margin + 65;
    fields.forEach(([label, value]) => {
      doc.setFont('times', 'bold');
      doc.text(label + ' :', col1X, y);
      doc.setFont('times', 'normal');
      const wrapped = doc.splitTextToSize(value || 'N/A', maxWidth - 55);
      wrapped.forEach((line, idx) => {
        if (idx === 0) doc.text(line, col2X, y);
        else doc.text(line, col2X, y + 5 * idx);
      });
      y += (wrapped.length * 5 + 2);
    });
    y += 4;

    // Declaration
    const declaration = `This is to certify that Shri ${name}, son of ${father} and ${mother}, is a permanent resident of the above-mentioned address and belongs to the ${app.community || '________'} Community and ${app.subCaste || '________'} Sub-Caste.`;
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

    // Place
    doc.text(`Place : ${place}`, margin + 10, y);
    y += 18;

    // Office details
    const officeY = y;
    doc.text('OFFICE OF EXAMINER', pageWidth - margin - 10, officeY, { align: 'right' });
    doc.text('OFFICE OF SEAL', pageWidth - margin - 10, officeY + 8, { align: 'right' });
    doc.text('Signature', pageWidth - margin - 10, officeY + 16, { align: 'right' });
    doc.text('Issuing Authority', pageWidth - margin - 10, officeY + 24, { align: 'right' });
    doc.text('Office of Example', pageWidth - margin - 10, officeY + 32, { align: 'right' });

  } else if (isCompletion) {
    // ----- Certificate of Completion -----
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    const lines = [
      `This is to certify that Mr./Ms. ${name}`,
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
      if (line.trim() === '') { y += 6; return; }
      const wrapped = doc.splitTextToSize(line, maxWidth - 10);
      wrapped.forEach(w => { doc.text(w, center, y, { align: 'center' }); y += 7; });
    });
    y += 6;
    doc.text(`Date: ${date}`, margin + 10, y);
    doc.text(`Place: ${place}`, pageWidth - margin - 40, y);
    y += 18;
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
    // ----- Character Certificate (sworn) for professional, billionaire, etc. -----
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    const lines = [
      `This is to certify that Mr./Ms. ${name},`,
      `son/daughter of ${father},`,
      `resident of ${fullAddress},`,
      'is known to me and the particulars furnished by him/her have been',
      'verified and found correct to the best of my knowledge and belief.',
      '',
      'This certificate is issued on the basis of available records and',
      'personal verification for official purposes.'
    ];
    lines.forEach(line => {
      if (line.trim() === '') { y += 6; return; }
      const wrapped = doc.splitTextToSize(line, maxWidth - 10);
      wrapped.forEach(w => { doc.text(w, center, y, { align: 'center' }); y += 7; });
    });
    y += 8;
    doc.text(`Place: ${place}`, margin + 10, y);
    doc.text(`Date: ${date}`, pageWidth - margin - 40, y);
    y += 20;
    doc.text('Signature: _________________________', margin + 10, y);
    y += 12;
    doc.text(`Name: ${name}`, margin + 10, y);
    y += 12;
    doc.text('Designation: _________________________', margin + 10, y);
    y += 12;
    doc.text('Office Seal', pageWidth - margin - 40, y);
  }

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
  const prefix = fileNamePrefix || 'certificate';
  link.download = `${prefix}-${app.referenceNumber || 'download'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
