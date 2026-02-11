import React from 'react';
import QRCodeLibrary from 'qrcode.react';

const QRCode = ({ value }) => {
  return (
    <QRCodeLibrary
      value={value}
      size={256}
      level={'H'}
      includeMargin={true}
    />
  );
};

export default QRCode;
