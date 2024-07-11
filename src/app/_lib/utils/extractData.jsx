// utils/extractData.js
export const extractData = (data) => {
    const selectedItems = data.selected_items;
    const quotations = data.quotation_feedbacks;

    const itemsWithQuotations = selectedItems.map(item => {
        const relatedQuotations = quotations.filter(quotation => 
            quotation.selected_items.some(qItem => qItem.id === item.id)
        );

        let lowestBudgetQuotation = null;
        relatedQuotations.forEach(quotation => {
            const qItem = quotation.selected_items.find(qItem => qItem.id === item.id);
            if (!lowestBudgetQuotation || parseFloat(qItem.budget) < parseFloat(lowestBudgetQuotation.budget)) {
                lowestBudgetQuotation = { ...qItem, supplier: quotation.selected_supplier_name };
            }
        });

        return {
            ...item,
            lowestBudgetQuotation
        };
    });

    return itemsWithQuotations;
}