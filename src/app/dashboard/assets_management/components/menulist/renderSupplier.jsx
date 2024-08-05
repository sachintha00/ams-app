const renderSupplier = (Supplier, selected) => (
    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:bg-[#3c4042]">
        <label className="w-full text-sm font-medium text-gray-900 dark:text-gray-300">
            {Supplier.name}
        </label>
        {selected && selected.id === Supplier.id && (
            <svg
                className="w-3.5 h-3.5 text-green-500 dark:text-green-400 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
        )}
    </div>
);

export default renderSupplier;