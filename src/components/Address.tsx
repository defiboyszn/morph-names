import React, { useEffect, useState } from 'react';

interface AddressProps {
  address: string;
  maxLength?: number;
}

const Address: React.FC<AddressProps> = ({ address, maxLength }) => {

  return <span>{address}</span>;
};

export default Address;
