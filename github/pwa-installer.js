// PWA Installer - Handles installation prompts for all platforms
(function() {
  'use strict';

  let deferredPrompt = null;
  const installButton = createInstallButton();

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('✅ PWA đã được cài đặt');
    return;
  }

  // Detect platform
  const platform = detectPlatform();
  console.log('📱 Platform detected:', platform);

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    });
  }

  // Listen for beforeinstallprompt (Chrome, Edge, Samsung Internet)
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 Install prompt ready');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton(platform);
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    hideInstallButton();
    deferredPrompt = null;
    showSuccessMessage();
  });


    `;
    
    Object.assign(button.style, {
      position: 'fixed',
      right: '1rem',
      bottom: '1rem',
      padding: '0.75rem 1.25rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '2rem',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
      zIndex: '9999',
      display: 'none',
      alignItems: 'center',
      animation: 'pulse 2s infinite',
      fontFamily: 'Inter, system-ui, sans-serif'
    });

    button.addEventListener('click', handleInstallClick);
    document.body.appendChild(button);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      #pwa-install-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
      }
    `;
    document.head.appendChild(style);
    
    return button;
  }

  // Show install button
  function showInstallButton(platform) {
    if (!installButton) return;
    
    installButton.style.display = 'flex';
    
    // Show after delay
    setTimeout(() => {
      if (!deferredPrompt && platform !== 'android' && platform !== 'desktop') {
        showPlatformInstructions(platform);
      }
    }, 3000);
  }

  // Hide install button
  function hideInstallButton() {
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  // Handle install button click
  async function handleInstallClick() {
    const platform = detectPlatform();
    
    if (deferredPrompt) {
      // Chrome, Edge, Samsung
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('👤 User choice:', outcome);
      
      if (outcome === 'accepted') {
        hideInstallButton();
      }
      
      deferredPrompt = null;
    } else {
      // iOS or other platforms - show instructions
      showPlatformInstructions(platform);
    }
  }

  // Detect platform
  function detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(ua)) {
      return 'ios';
    } else if (/android/.test(ua)) {
      return 'android';
    } else if (/windows/.test(ua)) {
      return 'windows';
    } else if (/mac/.test(ua)) {
      return 'macos';
    } else {
      return 'desktop';
    }
  }

  // Show platform-specific instructions
  function showPlatformInstructions(platform) {
    const instructions = {
      ios: `
        <strong>📱 Cài đặt trên iOS (iPhone/iPad):</strong><br><br>
        1. Nhấn nút <strong>Chia sẻ</strong> ⬆️ (ở dưới cùng)<br>
        2. Cuộn xuống → chọn <strong>"Thêm vào Màn hình chính"</strong><br>
        3. Nhấn <strong>"Thêm"</strong> → Hoàn tất!<br><br>
        Icon sẽ xuất hiện trên màn hình chính giống app thật.
      `,
      android: `
        <strong>📱 Cài đặt trên Android:</strong><br><br>
        1. Mở <strong>Menu</strong> (⋮) góc trên bên phải<br>
        2. Chọn <strong>"Thêm vào màn hình chính"</strong><br>
        3. Hoặc <strong>"Cài đặt ứng dụng"</strong><br><br>
        App sẽ cài như ứng dụng thật, không cần Google Play!
      `,
      windows: `
        <strong>💻 Cài đặt trên Windows:</strong><br><br>
        1. Nhấn biểu tượng <strong>⊕ Cài đặt</strong> trên thanh địa chỉ<br>
        2. Hoặc Menu (⋮) → <strong>"Cài đặt Nhật-Visa..."</strong><br>
        3. Nhấn <strong>"Cài đặt"</strong><br><br>
        App sẽ mở như phần mềm desktop riêng!
      `,
      macos: `
        <strong>💻 Cài đặt trên Mac:</strong><br><br>
        <strong>Trên Chrome/Edge:</strong><br>
        1. Nhấn biểu tượng <strong>⊕ Cài đặt</strong> trên thanh địa chỉ<br>
        2. Hoặc Menu → <strong>"Cài đặt Nhật-Visa..."</strong><br><br>
        <strong>Trên Safari:</strong><br>
        File → Thêm vào Dock
      `,
      desktop: `
        <strong>💻 Cài đặt trên máy tính:</strong><br><br>
        1. Nhấn biểu tượng <strong>⊕ Cài đặt</strong> trên thanh địa chỉ<br>
        2. Hoặc vào Menu trình duyệt → <strong>"Cài đặt"</strong><br>
        3. App sẽ mở trong cửa sổ riêng!
      `
    };

    showModal(instructions[platform] || instructions.desktop);
  }

  // Show modal with instructions
  function showModal(content) {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn 0.3s;">
        <div style="background:white;border-radius:1rem;max-width:500px;width:100%;padding:2rem;box-shadow:0 20px 60px rgba(0,0,0,0.3);position:relative;animation:slideUp 0.3s;">
          <button onclick="this.closest('div[style*=fixed]').remove()" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#666;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;">×</button>
          <div style="font-size:1.25rem;font-weight:700;margin-bottom:1.5rem;color:#4f46e5;">Hướng dẫn cài đặt</div>
          <div style="line-height:1.8;color:#374151;">${content}</div>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="margin-top:1.5rem;width:100%;padding:0.75rem;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:0.5rem;font-weight:600;cursor:pointer;">Đã hiểu</button>
        </div>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from {opacity:0} to {opacity:1} }
      @keyframes slideUp { from {transform:translateY(20px);opacity:0} to {transform:translateY(0);opacity:1} }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
  }

  // Show success message
  function showSuccessMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="position:fixed;top:2rem;right:2rem;background:#10b981;color:white;padding:1rem 1.5rem;border-radius:0.5rem;box-shadow:0 10px 30px rgba(0,0,0,0.2);z-index:10001;animation:slideIn 0.5s;">
        ✅ Đã cài đặt thành công!
      </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 3000);
  }

  // Show update notification
  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#4f46e5;color:white;padding:1rem 1.5rem;border-radius:0.5rem;box-shadow:0 10px 30px rgba(0,0,0,0.2);z-index:10001;display:flex;gap:1rem;align-items:center;">
        <span>🔄 Có phiên bản mới!</span>
        <button onclick="location.reload()" style="background:white;color:#4f46e5;border:none;padding:0.5rem 1rem;border-radius:0.25rem;font-weight:600;cursor:pointer;">Cập nhật</button>
      </div>
    `;
    document.body.appendChild(notification);
  }

  // Show install button after delay if prompt not triggered
  setTimeout(() => {
    if (!deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
      showInstallButton(platform);
    }
  }, 2000);

})();
