import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Share, Smartphone, CheckCircle, Sparkles } from 'lucide-react';
import { getMobilePlatform } from '../../utils/device';

export function InstallModal({ onClose }) {
  const { isInstalled, promptInstall, hasNativePrompt } = usePWAInstall();
  const mobilePlatform = getMobilePlatform();

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
              <h3>DOWNLOAD / INSTALL APP</h3>
              <p className="install-sub-text">Add to your home screen for fullscreen mobile gaming</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Already Installed */}
        {isInstalled ? (
          <div className="already-installed-box">
            <CheckCircle size={32} className="text-emerald" />
            <h4>App is already installed!</h4>
            <p>
              You can open <strong>Apex Drift 3D</strong> directly from your phone's home screen or app drawer, or keep playing directly here in your mobile browser.
            </p>
          </div>
        ) : (
          <div className="install-steps-body">
            {/* Native 1-Click Install Button if supported */}
            {hasNativePrompt && (
              <div className="native-install-section">
                <button className="native-install-big-btn" onClick={handleInstallClick} type="button">
                  <Download size={22} />
                  <span>TAP TO INSTALL APP (1-CLICK)</span>
                </button>
                <div className="or-divider"><span>OR FOLLOW STEPS BELOW</span></div>
              </div>
            )}

            {/* iOS / iPhone / iPad Guide */}
            {mobilePlatform === 'ios' ? (
              <div className="platform-guide-card ios-guide">
                <div className="guide-header">
                  <Smartphone size={18} className="text-cyan" />
                  <span>INSTALL ON iPHONE / iPAD (SAFARI)</span>
                </div>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-desc">
                      Tap the <strong>Share</strong> button <Share size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> in the bottom bar of Safari.
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
                      Tap <strong>Add</strong> in the top-right corner. The app will be installed on your phone!
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Android Guide */
              <div className="platform-guide-card android-guide">
                <div className="guide-header">
                  <Smartphone size={18} className="text-emerald" />
                  <span>INSTALL ON ANDROID (CHROME)</span>
                </div>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-desc">
                      Tap the <strong>three dots (⋮)</strong> menu in the top-right corner of Chrome.
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
                      Tap <strong>Install</strong> to add the app to your phone.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seamless Web vs App Option Clarification */}
            <div className="install-perks-pill">
              <Sparkles size={16} className="text-amber" />
              <span>
                <strong>Play Either Way:</strong> You can play directly on this website in your browser anytime, OR open the installed app from your home screen for fullscreen gaming with zero browser address bars!
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button className="confirm-btn" onClick={onClose} type="button">
            CONTINUE PLAYING ON WEBSITE
          </button>
        </div>
      </div>
    </div>
  );
}
