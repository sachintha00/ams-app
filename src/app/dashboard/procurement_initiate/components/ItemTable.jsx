import { useState } from 'react';

const ItemTable = ({ data, onQuotationSelect, selectedQuotations, onSubmit }) => {
  const handleQuotationChange = (itemId, event) => {
    const selected = data.quotation_feedbacks
      .flatMap(feedback => feedback.selected_items)
      .find(quote => quote.id === parseInt(event.target.value));

    onQuotationSelect(itemId, selected);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Item Name</th>
            <th className="py-2 px-4 border">Priority</th>
            <th className="py-2 px-4 border">Budget</th>
            <th className="py-2 px-4 border">Quantity</th>
            <th className="py-2 px-4 border">Quotation</th>
            <th className="py-2 px-4 border">Supplier</th>
            <th className="py-2 px-4 border">Quoted Budget</th>
            <th className="py-2 px-4 border">Available Date</th>
          </tr>
        </thead>
        <tbody>
          {data.selected_items.map(item => {
            const relatedQuotations = data.quotation_feedbacks
              .flatMap(feedback => feedback.selected_items)
              .filter(quoteItem => quoteItem.id === item.id);

            return (
              <tr key={item.id}>
                <td className="py-2 px-4 border">{item.item_name}</td>
                <td className="py-2 px-4 border">{item.priority}</td>
                <td className="py-2 px-4 border">{item.budget}</td>
                <td className="py-2 px-4 border">{item.quantity}</td>
                <td className="py-2 px-4 border">
                  <select
                    className="p-2 border rounded"
                    onChange={(e) => handleQuotationChange(item.id, e)}
                    value={selectedQuotations[item.id]?.id || ''}
                  >
                    <option value="" disabled>Select a quotation</option>
                    {relatedQuotations.map(quote => (
                      <option key={quote.id} value={quote.id}>
                        {quote.selected_supplier_name} - ${quote.budget}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border">{selectedQuotations[item.id]?.selected_supplier_name || '-'}</td>
                <td className="py-2 px-4 border">{selectedQuotations[item.id]?.budget || '-'}</td>
                <td className="py-2 px-4 border">{selectedQuotations[item.id]?.available_date || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
        onClick={onSubmit}
      >
        Submit Selected Quotations
      </button>
    </div>
  );
};

export default ItemTable;
