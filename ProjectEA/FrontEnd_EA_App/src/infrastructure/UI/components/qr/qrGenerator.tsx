import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGeneratorProps {
  attribute1: string;
  attribute2: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ attribute1, attribute2 }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <QRCode value={`Attribute1: ${attribute1}\nAttribute2: ${attribute2}`} size={200} />
    </View>
  );
};

export default QRCodeGenerator;
