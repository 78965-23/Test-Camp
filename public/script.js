// Hamburger toggle
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

// Attach event listener to toggle button
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('navToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMenu);
  }

  // Close menu on outside click
  document.addEventListener('click', function(event) {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('navToggle');
    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
      menu.classList.remove('active');
    }
  });
});

// Reference number generator (exposed globally)
function generateRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'REF-';
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  ref += '-';
  for (let i = 0; i < 5; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
}

// Certificate number generator (exposed globally)
function generateCertNum() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'CERT-';
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  ref += '-';
  for (let i = 0; i < 5; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
}
