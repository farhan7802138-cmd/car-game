import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Share, Smartphone, Monitor, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

export function InstallModal({ onClose }) {
  const { isInstalled, promptInstall, platform, hasNativePrompt } = usePWAInstall();

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      const installed = await promptInstall();
      if (installed) {
        onClose();
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="install-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="install-modal-title-row">
            <div className="install-app-icon-mini">
              <Download size={20} className="text-cyan" />
            </div>
            <div>
              <h3>INSTALL APEX DRIFT 3D</h3>
              <p className="install-sub-text">Play anytime with zero downloads or app store required</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Already Installed Status */}
        {isInstalled ? (
          <div className="already-installed-box">
            <CheckCircle size={32} className="text-emerald" />
            <h4>App is already installed!</h4>
            <p>
              You can launch <strong>Apex Drift 3D</strong> directly from your device home screen or app drawer, or continue playing right here in your browser.
            </p>
          </div>
        ) : (
          <div className="install-steps-body">
            {/* Native 1-Click Install Button if supported */}
            {hasNativePrompt && (
              <div className="native-install-section">
                <button className="native-install-big-btn" onClick={handleInstallClick}>
                  <Download size={22} />
                  <span>INSTALL NOW (1-CLICK)</span>
                </button>
                <div className="or-divider"><span>OR FOLLOW STEPS BELOW</span></div>
              </div>
            )}

            {/* Platform Specific Guides */}
            {platform === 'ios' && (
              <div className="platform-guide-card ios-guide">
                <div className="guide-header">
                  <Smartphone size={18} className="text-cyan" />
                  <span>INSTALL ON iPHONE / iPAD (SAFARI)</span>
                </div>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-desc">
                      Tap the <strong>Share</strong> button <Share size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> at the bottom or top of Safari.
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-desc">
                      Scroll down and tap <strong>Add to Home Screen</strong>.
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-desc">
                      Tap <strong>Add</strong> in the top-right corner. The app icon will appear on your home screen!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {platform === 'android' && (
              <div className="platform-guide-card android-guide">
                <div className="guide-header">
                  <Smartphone size={18} className="text-emerald" />
                  <span>INSTALL ON ANDROID (CHROME / BROWSER)</span>
                </div>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-desc">
                      Tap the <strong>three dots menu (⋮)</strong> in the top-right corner of Chrome.
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-desc">
                      Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-desc">
                      Confirm by tapping <strong>Install</strong>. It installs instantly!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {platform === 'desktop' && (
              <div className="platform-guide-card desktop-guide">
                <div className="guide-header">
                  <Monitor size={18} className="text-cyan" />
                  <span>INSTALL ON PC / LAPTOP (CHROME / EDGE)</span>
                </div>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-desc">
                      Look at the top URL address bar of your browser on the right.
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-desc">
                      Click the <strong>Install App icon (⊕ or computer monitor)</strong>.
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-desc">
                      Click <strong>Install</strong> to open the game as a dedicated fullscreen desktop app!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seamless Dual Access Benefit Pill */}
            <div className="install-perks-pill">
              <Sparkles size={16} className="text-amber" />
              <span>
                <strong>Play Both Ways:</strong> Play in your browser whenever you want, OR open your installed app from the home screen for fullscreen gaming with zero address bar!
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button className="confirm-btn" onClick={onClose}>
            CONTINUE PLAYING
          </button>
        </div>
      </div>
    </div>
  );
}
