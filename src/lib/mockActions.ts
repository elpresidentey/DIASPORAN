/**
 * Mock actions for clickable elements
 * These provide realistic feedback without actual backend integration
 */

// Better UX notification system with less intrusive feedback
const showNotification = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
  console.log(`${type.toUpperCase()}: ${title}${description ? ` - ${description}` : ''}`);
  
  // Create a more subtle notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 350px;
    word-wrap: break-word;
  `;
  
  // Set colors based on type
  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    notification.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;"><span>✅</span><div><strong>${title}</strong>${description ? `<br><span style="opacity: 0.9; font-size: 12px;">${description}</span>` : ''}</div></div>`;
  } else if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    notification.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;"><span>❌</span><div><strong>${title}</strong>${description ? `<br><span style="opacity: 0.9; font-size: 12px;">${description}</span>` : ''}</div></div>`;
  } else {
    notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    notification.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;"><span>ℹ️</span><div><strong>${title}</strong>${description ? `<br><span style="opacity: 0.9; font-size: 12px;">${description}</span>` : ''}</div></div>`;
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
};

export const mockActions = {
  // Partners page actions
  applyToPartner: () => {
    showNotification("success", "Partnership application submitted!", "We'll review your application and get back to you within 3-5 business days.");
  },

  downloadPartnershipGuide: () => {
    showNotification("info", "Download started", "Partnership guide (PDF, 2.3MB) is being downloaded to your device.");
    // Simulate download
    setTimeout(() => {
      showNotification("success", "Download complete", "Partnership guide saved to Downloads folder.");
    }, 2000);
  },

  // Press page actions
  downloadMediaKit: () => {
    showNotification("info", "Preparing media kit...", "Compressing assets and generating download link.");
    setTimeout(() => {
      showNotification("success", "Media kit ready!", "Complete media kit (ZIP, 15.7MB) downloaded successfully.");
    }, 2500);
  },

  contactPressTeam: () => {
    showNotification("success", "Redirecting to press contact", "Opening email client to contact press@diasporan.com");
    // Simulate email client opening
    setTimeout(() => {
      window.open('mailto:press@diasporan.com?subject=Press Inquiry&body=Hello Diasporan Press Team,', '_blank');
    }, 1000);
  },

  downloadMediaAsset: (assetName: string) => {
    showNotification("info", `Downloading ${assetName}...`, "Asset is being prepared for download.");
    setTimeout(() => {
      showNotification("success", "Download complete", `${assetName} saved to Downloads folder.`);
    }, 1500);
  },

  // Careers page actions
  applyForJob: (jobTitle: string) => {
    showNotification("success", "Application submitted!", `Your application for ${jobTitle} has been received. We'll be in touch soon!`);
  },

  sendResume: () => {
    showNotification("info", "Opening application form...", "Redirecting to our careers portal.");
    setTimeout(() => {
      showNotification("success", "Form opened", "Please fill out the application form with your details.");
    }, 1500);
  },

  // Newsletter and contact actions
  subscribeNewsletter: (email: string) => {
    if (!email || !email.includes('@')) {
      showNotification("error", "Invalid email", "Please enter a valid email address.");
      return false;
    }
    
    showNotification("success", "Welcome to our newsletter!", `Confirmation sent to ${email}. Check your inbox!`);
    return true;
  },

  contactSupport: () => {
    showNotification("info", "Opening support chat...", "Connecting you with our support team.");
    setTimeout(() => {
      showNotification("success", "Chat opened", "A support agent will be with you shortly.");
    }, 1500);
  },

  // About page actions
  learnAboutValues: () => {
    showNotification("info", "Loading company values", "Redirecting to our values and culture page.");
  },

  // General actions
  comingSoon: (feature: string) => {
    showNotification("info", `${feature} coming soon!`, "This feature is currently in development. Stay tuned for updates!");
  },

  externalLink: (url: string, siteName: string) => {
    showNotification("info", `Opening ${siteName}`, "Redirecting to external website in new tab.");
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 500);
  },

  copyToClipboard: (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showNotification("success", `${label} copied!`, `${text} has been copied to your clipboard.`);
    }).catch(() => {
      showNotification("error", "Copy failed", "Unable to copy to clipboard. Please try again.");
    });
  },
};