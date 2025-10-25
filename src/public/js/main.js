// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  console.log('TBVector loaded successfully!');

  // Auto-hide flash messages after 5 seconds
  const flashMessages = document.querySelectorAll('[x-data*="show"]');
  flashMessages.forEach(message => {
    setTimeout(() => {
      const closeButton = message.querySelector('button');
      if (closeButton) {
        closeButton.click();
      }
    }, 5000);
  });

  // Add active class to current navigation item
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a, aside a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

// Utility function for formatting dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Utility function for formatting time
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Utility function for formatting date time
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
