import React, { useEffect, useState } from 'react';
import { useAllApprovedRequisitionDataQuery } from '@/app/_lib/redux/features/procurement/procurement_api';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { CSSTransition } from 'react-transition-group';

const mockRequests = [
  {
    id: 206,
    user: {
      name: "chamod",
      email: "chamoddushantha2014@gmail.com",
      address: null,
      username: "chamod"
    },
    items: [
      {
        id: 213,
        files: [],
        budget: "100000",
        period: null,
        reason: "fwfwf",
        priority: "Moderate",
        quantity: 1,
        item_name: "laptop",
        period_to: "2024-07-26",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-08T08:29:57",
        updated_at: "2024-07-08T08:29:57",
        period_from: "2024-07-09",
        item_details: [
          {
            type: "color",
            details: "black"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-10",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frwfwf",
        consumables_kpi: [
          {
            details: "efefeff"
          }
        ],
        maintenance_kpi: [
          {
            details: "rferfer"
          }
        ],
        availabiity_type: "Hire",
        business_perpose: "wwfw",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fef"
          }
        ],
        asset_requisition_id: 206
      }
    ],
    created_at: "2024-07-08T08:29:57",
    updated_at: "2024-07-08T16:29:07",
    requisition_by: 1,
    requisition_id: "he5d26y5",
    requisition_date: "2024-07-08",
    requisition_status: "APPROVED"
  },
  {
    id: 212,
    user: {
      name: "dushyantha",
      email: "chamoddushyantha2017@gmail.com",
      address: null,
      username: "dushyantha randnei"
    },
    items: [
      {
        id: 219,
        files: [],
        budget: "11",
        period: null,
        reason: "dwedewd",
        priority: "High",
        quantity: 11,
        item_name: "bus",
        period_to: "2024-07-11",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-10T05:41:13",
        updated_at: "2024-07-10T05:41:13",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "dewd",
            details: "dwed"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-11",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "dwed",
        consumables_kpi: [
          {
            details: "dwed"
          }
        ],
        maintenance_kpi: [
          {
            details: "dewd"
          }
        ],
        availabiity_type: "Hire",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "wedew"
          }
        ],
        asset_requisition_id: 212
      }
    ],
    created_at: "2024-07-10T05:41:13",
    updated_at: "2024-07-10T05:41:13",
    requisition_by: 11,
    requisition_id: "ad5jvtrs",
    requisition_date: "2024-07-10",
    requisition_status: "APPROVED"
  },
  {
    id: 213,
    user: {
      name: "dushyantha",
      email: "chamoddushyantha2017@gmail.com",
      address: null,
      username: "dushyantha randnei"
    },
    items: [
      {
        id: 220,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      }
    ],
    created_at: "2024-07-11T06:34:37",
    updated_at: "2024-07-11T06:34:37",
    requisition_by: 11,
    requisition_id: "swpg995t",
    requisition_date: "2024-07-10",
    requisition_status: "APPROVED"
  },
  {
    id: 300,
    user: {
      name: "dushyantha",
      email: "chamoddushyantha2017@gmail.com",
      address: null,
      username: "dushyantha randnei"
    },
    items: [
      {
        id: 345,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      }
    ],
    created_at: "2024-07-11T06:34:37",
    updated_at: "2024-07-11T06:34:37",
    requisition_by: 11,
    requisition_id: "swpg995t",
    requisition_date: "2024-07-10",
    requisition_status: "APPROVED"
  },
  {
    id: 500,
    user: {
      name: "dushyantha",
      email: "chamoddushyantha2017@gmail.com",
      address: null,
      username: "dushyantha randnei"
    },
    items: [
      {
        id: 567,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      }
    ],
    created_at: "2024-07-11T06:34:37",
    updated_at: "2024-07-11T06:34:37",
    requisition_by: 11,
    requisition_id: "swpg995t",
    requisition_date: "2024-07-10",
    requisition_status: "APPROVED"
  },
  {
    id: 1000,
    user: {
      name: "dushyantha",
      email: "chamoddushyantha2017@gmail.com",
      address: null,
      username: "dushyantha randnei"
    },
    items: [
      {
        id: 1050,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
      {
        id: 1051,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
      {
        id: 1053,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
      {
        id: 1055,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
      {
        id: 1057,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
      {
        id: 1059,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
      {
        id: 1060,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
      {
        id: 1065,
        files: [],
        budget: "11",
        period: null,
        reason: "frefref",
        priority: "High",
        quantity: 11,
        item_name: "car",
        period_to: "2024-07-19",
        suppliers: ["chamod randnei", "sachintha madawa"],
        assesttype: "test1",
        created_at: "2024-07-11T06:34:37",
        updated_at: "2024-07-11T06:34:37",
        period_from: "2024-07-11",
        item_details: [
          {
            type: "fref",
            details: "erfer"
          },
          {
            type: "erf",
            details: "fref"
          }
        ],
        organization: 1,
        period_status: "Long period/terms",
        required_date: "2024-07-12",
        upgrade_or_new: "upgrade the existing one",
        business_impact: "frefref",
        consumables_kpi: [
          {
            details: "frefre"
          },
          {
            details: "ferfre"
          }
        ],
        maintenance_kpi: [
          {
            details: "fer"
          }
        ],
        availabiity_type: "Rent",
        business_perpose: "ded",
        expected_conditions: null,
        service_support_kpi: [
          {
            details: "fref"
          }
        ],
        asset_requisition_id: 213
      },
    ],
    created_at: "2024-07-11T06:34:37",
    updated_at: "2024-07-11T06:34:37",
    requisition_by: 11,
    requisition_id: "swpg995t",
    requisition_date: "2024-07-10",
    requisition_status: "APPROVED"
  }
];

const Drawer = ({ selectedItems, setSelectedItems }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchRequisitionInput, setRequisitionSearchInput] = useState('');
    
  const handleSearchRequisitionInputChange = (event) => {
      setRequisitionSearchInput(event.target.value);
  };

  const [filteredrequest, setFilteredRequest] = useState([]);
  const {
    data: Assestrequisition,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllApprovedRequisitionDataQuery();

  useEffect(() => {
      if (Assestrequisition) {
          const allrequisition = Object.values(Assestrequisition.requisition_data);
          console.log(allrequisition);
          const filtered = allrequisition.filter(requestitem => requestitem.requisition_id.toLowerCase().includes(searchRequisitionInput.toLowerCase()));
          setFilteredRequest(filtered);
      }
  }, [Assestrequisition, searchRequisitionInput]);



  const handleToggle = (id) => {
    setExpandedRow((prevExpandedRow) => (prevExpandedRow === id ? null : id));
  };

  const toggleItemSelection = (item, request) => {
    const isSelected = selectedItems.find((selectedItem) => selectedItem.id === item.id);
    const newSelection = isSelected
      ? selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      : [...selectedItems, { ...item, request: request }];

    setSelectedItems(newSelection);
  };

  const toggleRequestSelection = (request) => {
    const allItemsSelected = request.items.every((item) =>
      selectedItems.some((selectedItem) => selectedItem.id === item.id)
    );

    const newSelection = allItemsSelected
      ? selectedItems.filter(
          (selectedItem) => !request.items.some((item) => item.id === selectedItem.id)
        )
      : [
          ...selectedItems,
          ...request.items
            .filter((item) => !selectedItems.some((selectedItem) => selectedItem.id === item.id))
            .map((item) => ({ ...item, request: request })),
        ];

    setSelectedItems(newSelection);
  };

  return (
    <div className="relative p-[10px] w-[20%] bg-gray-200 h-[fit-content] max-h-[690px] border border-gray-200 rounded-lg shadow dark:bg-[#606368]">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assess Requests</h2>
      <div className="relative mb-[10px]">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
            >
                <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
            </svg>
          </div>
          <input
          type="text" id="input-group-search" className="block w-full ps-10 p-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search Requisition ID"
          value={searchRequisitionInput}
          onChange={handleSearchRequisitionInputChange}
          />
      </div>
      {filteredrequest.map((request) => (
        <div key={request.id} className="w-full my-[1px] bg-white border border-gray-200 rounded shadow dark:bg-[#3c4042] dark:border-gray-700">
          <div className='flex justify-between'>
            <a onClick={() => handleToggle(request.id)} className="flex justify-center items-center w-[24px] h-[24px] bg-white dark:bg-[#3c4042] dark:border-[#606368] row-enter-done">
              {expandedRow === request.id ? <IoIosArrowUp/> : <IoIosArrowDown/>}
            </a>
            <div className='flex justify-between w-[75%]'>
              <label className="flex items-center">
                <h3 className="text-gray-900 text-sm dark:text-white">{request.requisition_id}</h3>
              </label>
              <input
                  type="checkbox"
                  className="mr-2"
                  checked={request.items.every((item) =>
                    selectedItems.some((selectedItem) => selectedItem.id === item.id)
                  )}
                  onChange={() => toggleRequestSelection(request)}
              />
            </div>
          </div>
          <CSSTransition
              in={expandedRow === request.id}
              timeout={200}
              classNames="row"
              unmountOnExit
          >
            <ul>
              {request.items.map((item) => (
                <li
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative w-[100%] flex justify-end"
                >
                  <label className="text-gray-900 flex items-center text-sm w-[75%] justify-between pl-4 dark:text-white">
                    {item.item_name}
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={!!selectedItems.find((selectedItem) => selectedItem.id === item.id)}
                      onChange={() => toggleItemSelection(item, request)}
                    />
                  </label>
                  {hoveredItem && hoveredItem.id === item.id && (
                    <div className="absolute left-full ml-2 p-2 bg-white border border-gray-300 shadow-lg z-10">
                      <h4 className="text-sm font-bold">{item.item_name}</h4>
                      <p className="text-xs">{item.details}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </CSSTransition>
        </div>
      ))}
    </div>
  );
};

export default Drawer;