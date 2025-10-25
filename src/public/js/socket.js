// Socket.IO Client
let socket;

function initSocket() {
  socket = io();

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  // Listen for new cough detections
  socket.on('newCoughDetection', (data) => {
    console.log('New cough detection:', data);
    showNotification('Deteksi Batuk Baru', `Terdeteksi batuk baru dari perangkat ${data.deviceId}`);
    
    // Update UI if on relevant page
    if (window.location.pathname === '/dashboard' || window.location.pathname === '/coughs') {
      // Reload or update data
      location.reload();
    }
  });

  // Listen for device status updates
  socket.on('deviceStatusUpdate', (data) => {
    console.log('Device status update:', data);
    
    // Update UI if on devices page
    if (window.location.pathname === '/devices') {
      updateDeviceStatus(data);
    }
  });

  // Listen for notifications
  socket.on('notification', (data) => {
    console.log('New notification:', data);
    showNotification(data.title, data.message);
  });
}

// Show browser notification
function showNotification(title, message) {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  // Check permission
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/images/icon.png'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/images/icon.png'
        });
      }
    });
  }

  // Also show in-app notification
  showInAppNotification(title, message);
}

// Show in-app notification toast
function showInAppNotification(title, message) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 transform transition-all duration-300 translate-y-full';
  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium text-gray-900">${title}</p>
        <p class="mt-1 text-sm text-gray-500">${message}</p>
      </div>
      <div class="ml-4 flex-shrink-0">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="inline-flex text-gray-400 hover:text-gray-500">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-y-full');
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('translate-y-full');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Update device status in UI
function updateDeviceStatus(data) {
  const deviceElement = document.querySelector(`[data-device-id="${data.deviceId}"]`);
  if (deviceElement) {
    const statusBadge = deviceElement.querySelector('.device-status');
    if (statusBadge) {
      statusBadge.textContent = data.status;
      statusBadge.className = `device-status badge ${data.status === 'online' ? 'badge-success' : 'badge-danger'}`;
    }
  }
}

// Initialize socket when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSocket);
} else {
  initSocket();
}
