import { useState } from 'react';

const ItemsPage = ({ procurement }) => {
  const [selectedSuppliers, setSelectedSuppliers] = useState(
    data.selected_items.map(item => ({
      itemId: item.id,
      supplierId: null,
      quotationDetails: null,
      supplierDetails: null,
    }))
  );

  const handleSupplierChange = (itemId, supplierId, quotationDetails, supplierDetails) => {
    setSelectedSuppliers(prev => 
      prev.map(supplier => 
        supplier.itemId === itemId ? { ...supplier, supplierId, quotationDetails, supplierDetails } : supplier
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedItems = data.selected_items.map(item => {
      const supplier = selectedSuppliers.find(s => s.itemId === item.id);
      return {
        ...item,
        selected_supplier_id: supplier ? supplier.supplierId : null,
        quotation_details: supplier ? supplier.quotationDetails : null,
        supplier_details: supplier ? supplier.supplierDetails : null,
      };
    });

    // Post the updated items to the Laravel API endpoint
    await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selected_items: updatedItems }),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quotations</h1>
      <form onSubmit={handleSubmit}>
        <table className="table-auto w-full mb-6">
          <thead>
            <tr>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Asset Type</th>
              <th className="px-4 py-2">Budget</th>
              <th className="px-4 py-2">Select Supplier</th>
              <th className="px-4 py-2">Quotation Details</th>
            </tr>
          </thead>
          <tbody>
            {procurement.selected_items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.item_name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.priority}</td>
                <td className="px-4 py-2">{item.asset_type}</td>
                <td className="px-4 py-2">{item.budget}</td>
                <td className="px-4 py-2">
                  {procurement.quotation_feedbacks
                    .filter(feedback => feedback.selected_items.some(si => si.id === item.id))
                    .map(feedback => (
                      <div key={feedback.id} className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`supplier-${item.id}`}
                            value={feedback.selected_supplier_id}
                            onChange={() => handleSupplierChange(item.id, feedback.selected_supplier_id, {
                              supplier_name: feedback.selected_supplier_name,
                              date: feedback.date,
                              available_date: feedback.available_date,
                              budget: feedback.selected_items.find(si => si.id === item.id).budget
                            })}
                            className="form-radio"
                          />
                          <span className="ml-2">{feedback.selected_supplier_name}</span>
                        </label>
                      </div>
                    ))}
                </td>
                <td className="px-4 py-2">
                  {procurement.quotation_feedbacks
                    .filter(feedback => feedback.selected_items.some(si => si.id === item.id))
                    .map(feedback => (
                      <div key={feedback.id} className="mt-2">
                        <p className="font-semibold">{feedback.selected_supplier_name}</p>
                        <p>Date: {feedback.date}</p>
                        <p>Available Date: {feedback.available_date}</p>
                        <p>Budget: {feedback.selected_items.find(si => si.id === item.id).budget}</p>
                      </div>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ItemsPage;
