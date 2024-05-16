export const customSelectStyles = (theme) => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? '#3c4042' : 'bg-gray-50',
    borderColor: theme === 'dark' ? 'gray-500' : 'gray-300',
    color: theme === 'dark' ? 'white' : 'gray-900',
    borderRadius: '0.375rem', // rounded-lg
    padding: '0.625rem', // p-2.5
    boxShadow: 'none',
    '&:hover': {
      borderColor: theme === 'dark' ? 'primary-500' : 'primary-600',
    },
    '&:focus': {
      borderColor: theme === 'dark' ? 'primary-500' : 'primary-600',
      boxShadow: `0 0 0 1px ${theme === 'dark' ? 'primary-500' : 'primary-600'}`,
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 0.625rem',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0',
    color: theme === 'dark' ? 'white' : 'gray-900',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme === 'dark' ? 'white' : 'gray-900',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: theme === 'dark' ? 'gray-400' : 'gray-900',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.375rem', // rounded-lg
    boxShadow: theme === 'dark' ? '0 2px 10px rgba(0, 0, 0, 0.6)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme === 'dark' ? '#3c4042' : 'bg-gray-50',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? theme === 'dark' ? '#3c4042' : 'bg-gray-100'
      : state.isFocused
      ? theme === 'dark' ? '#3c4042' : 'bg-gray-50'
      : theme === 'dark' ? '#3c4042' : 'bg-gray-50',
    color: theme === 'dark' ? 'white' : 'gray-900',
    padding: '0.625rem 1rem', // p-2.5
    '&:hover': {
      backgroundColor: theme === 'dark' ? '#3c4042' : 'bg-gray-200',
    },
  }),
});