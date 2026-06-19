// Hamburger toggle
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  if (menu) menu.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('navToggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleMenu);
  document.addEventListener('click', function(event) {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('navToggle');
    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
      menu.classList.remove('active');
    }
  });
});

// Reference number generator
function generateRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'REF-';
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  ref += '-';
  for (let i = 0; i < 5; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
}

// Certificate number generator
function generateCertNum() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'CERT-';
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  ref += '-';
  for (let i = 0; i < 5; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
}
