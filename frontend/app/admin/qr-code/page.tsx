'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';

export default function QRCodePage() {
  const menuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/menu`
    : 'http://localhost:3000/menu';

  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 400;
    canvas.height = 400;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 400, 400);
      const a = document.createElement('a');
      a.download = 'menu-qr-code.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">QR Code</h1>
        <p className="text-gray-500 text-sm mt-1">Print or download this QR code for your tables</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-6">
          <div ref={qrRef} className="p-4 bg-white rounded-xl border-2 border-gray-100">
            <QRCodeSVG
              value={menuUrl}
              size={220}
              bgColor="#ffffff"
              fgColor="#1a1a1a"
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Scan to view menu</p>
            <p className="text-sm font-medium text-gray-700 break-all">{menuUrl}</p>
          </div>
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-amber-500 hover:bg-amber-600"
            >
              Download PNG
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex-1"
            >
              Print
            </Button>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-semibold text-gray-800 mb-4">How to use</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Download or Print', desc: 'Download the QR code as PNG or print it directly from this page.' },
              { step: '2', title: 'Place on Tables', desc: 'Put the QR code on each table — use a table stand, laminate it, or stick it on the table.' },
              { step: '3', title: 'Customers Scan', desc: 'Customers scan the QR code with their phone camera and instantly see your full digital menu.' },
              { step: '4', title: 'Update Anytime', desc: 'Add or edit menu items from the admin panel. Changes appear instantly — no reprinting needed.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}