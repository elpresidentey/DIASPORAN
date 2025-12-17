/**
 * Mock actions for clickable elements
 * These provide realistic feedback without actual backend integration
 */

// We'll create a simple notification system that works with the existing toast provider
const showNotification = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
  // For now, we'll use console.log and alert as fallback
  // In a real implementation, this would integrate with the ToastProvider
  console.log(`${type.toUpperCase()}: ${title}${description ? ` - ${description}` : ''}`);
  
  // Simple user feedback
  if (type === 'success') {
    alert(`✅ ${title}${description ? `\n${description}` : ''}`);
  } else if (type === 'error') {
    alert(`❌ ${title}${description ? `\n${description}` : ''}`);
  } else {
    alert(`ℹ️ ${title}${description ? `\n${description}` : ''}`);
  }
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