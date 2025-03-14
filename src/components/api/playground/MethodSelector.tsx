
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MethodSelectorProps {
  method: string;
  onMethodChange: (method: string) => void;
}

const MethodSelector: React.FC<MethodSelectorProps> = ({ method, onMethodChange }) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">HTTP Method</label>
      <Select value={method} onValueChange={onMethodChange}>
        <SelectTrigger>
          <SelectValue placeholder="HTTP Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GET">GET</SelectItem>
          <SelectItem value="POST">POST</SelectItem>
          <SelectItem value="PUT">PUT</SelectItem>
          <SelectItem value="DELETE">DELETE</SelectItem>
          <SelectItem value="PATCH">PATCH</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MethodSelector;
