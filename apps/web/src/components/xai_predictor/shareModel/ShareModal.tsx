import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { ShareModalProps } from './types';

export function ShareModal({ show, shareLink, onClose, onCopy }: ShareModalProps) {
    return (
        <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent text-center">
                        Share Prediction Report
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-8 py-4">
                    {/* QR Code Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-cyan-100">
                            <QRCodeSVG
                                value={shareLink}
                                size={200}
                                level="H"
                                includeMargin={true}
                                bgColor="#ffffff"
                                fgColor="#000000"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                            Scan with your phone to view the report
                        </p>
                    </div>

                    {/* Share Link Section */}
                    <div className="w-full space-y-3">
                        <Label htmlFor="share-link" className="text-center block text-muted-foreground">Or Copy Link</Label>
                        <div className="flex gap-2">
                            <Input
                                id="share-link"
                                value={shareLink}
                                readOnly
                                className="bg-muted focus-visible:ring-cyan-500 cursor-text"
                                aria-label="Shareable link"
                            />
                            <Button
                                onClick={onCopy}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2"
                                aria-label="Copy link to clipboard"
                            >
                                <Copy size={18} />
                                Copy
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
