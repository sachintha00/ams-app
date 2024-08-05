import { useState } from 'react';
import ItemTable from './ItemTable';


const Comparison = ({ data }) => {
  const [selectedQuotations, setSelectedQuotations] = useState({});

  const handleQuotationSelect = (itemId, quotation) => {
    setSelectedQuotations(prev => ({ ...prev, [itemId]: quotation }));
  };

  const handleSubmit = async () => {
    const selectedItems = data.selected_items.map(item => ({
      ...item,
      selected_quotation: selectedQuotations[item.id]
    }));

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_items: selectedItems })
    });

    if (response.ok) {
      alert('Quotations submitted successfully!');
    } else {
      alert('Failed to submit quotations');
    }
  };

  return (
    <div>
      <ItemTable
        data={data}
        onQuotationSelect={handleQuotationSelect}
        selectedQuotations={selectedQuotations}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Comparison;