import { Copy, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { ShareModalProps } from './types';

export function ShareModal({ show, shareLink, onClose, onCopy }: ShareModalProps) {
    if (!show) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 id="share-modal-title">Share Prediction Report</h3>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close share modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="share-content">
                        {/* QR Code Section */}
                        <div className="qr-code-section">
                            <h4>Scan QR Code</h4>
                            <div className="qr-code-container">
                                <QRCodeSVG
                                    value={shareLink}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                />
                            </div>
                            <p className="qr-hint">Scan with your phone to view the report</p>
                        </div>

                        {/* Share Link Section */}
                        <div className="share-link-section">
                            <h4>Or Copy Link</h4>
                            <div className="share-link-container">
                                <input
                                    type="text"
                                    value={shareLink}
                                    readOnly
                                    className="share-link-input"
                                    aria-label="Shareable link"
                                />
                                <button
                                    className="btn-copy"
                                    onClick={onCopy}
                                    aria-label="Copy link to clipboard"
                                >
                                    <Copy size={18} />
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
