import React, { useEffect, useState } from 'react';
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { useSelector } from "react-redux";
import Requisitionsapproval from "../../components/requisitionsapproval/requisitionsapproval";
import { formatKeys } from "@/app/_lib/utils/formatKeys";
import { useAssestRequisitionStatusUpdateMutation } from "@/app/_lib/redux/features/assestrequisition/assest_requisition_api";
import ThumbnailImageOnViewPage from './imagedisplay/ThumbnailImageOnViewPage';
import ThumbnailMainImageOnViewPage from './imagedisplay/ThumbnailMainImageOnViewPage';

function ViewAssetsDetails({  }) {
    const [procuremenSelectedItems, setProcuremenSelectedItems] = useState([]);
    const [SupplierQuotation, setSupplierQuotation] = useState([]);
    const { value } = useSelector((state) => state.popupModel);
    const Assets = value;

    // useEffect(() => {
    //     if (value) {
    //         setProcuremenSelectedItems(value.selected_items);
    //         setSupplierQuotation(value.quotation_feedbacks);
    //     }
    // }, []);
    // State to store the currently selected image (default is the first one)
    const [selectedImage, setSelectedImage] = useState(Assets.thumbnail_image[0]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleImageClick = (image) => {
        // Start the fade-out transition
        setIsTransitioning(true);
        // Delay setting the new image until the fade-out is complete
        setTimeout(() => {
          setSelectedImage(image);
          setIsTransitioning(false);
        }, 300); // Match this time to your transition duration
      };

    const [timeSinceRegister, setTimeSinceRegister] = useState('');

    useEffect(() => {
        const calculateTimeDifference = () => {

            const registerDate = new Date(Assets.register_date);
            const now = new Date();

            const timeDifference = now - registerDate; // Difference in milliseconds

            // Convert time difference to readable format (years, months, days)
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
            const seconds = Math.floor((timeDifference / 1000) % 60);

            setTimeSinceRegister(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds ago`);
        };

        calculateTimeDifference();

        // Optionally update the time every second
        const interval = setInterval(calculateTimeDifference, 1000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);
      
    return (
        <>
            <div 
                className="px-2 pt-2 overflow-y-scroll h-auto max-h-[600px]"
                style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
            >
                <section className="relative ">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2 ">
                    <div className="img">
                        <div className="img-box h-[75%] max-lg:mx-auto ">
                            {/* <img 
                            className={`h-[100%] w-[100%] mx-auto rounded-lg shadow-lg border border-gray-200 transition-opacity duration-300 ease-in-out 
                                ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} 
                            // src={`${process.env.NEXT_PUBLIC_API_URL}${selectedImage}`}  
                            src={`${process.env.NEXT_PUBLIC_API_URL}storage/${selectedImage.replace('public/', '')}`}/> */}
                            <ThumbnailMainImageOnViewPage image={selectedImage} name={Assets.sub_category_name} isTransitioning={isTransitioning}/>
                        </div>
                        {/* Thumbnail images */}
                        <div className='max-w-[550px] overflow-x-scroll w-auto p-[5px]'>
                            <div className='flex mt-3 gap-3'>
                                {Assets.thumbnail_image.map((image, index) => (
                                    // <img 
                                    //     key={index} 
                                    //     // src={`${process.env.NEXT_PUBLIC_API_URL}${image}`} 
                                    //     src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image.replace('public/', '')}`}
                                    //     alt={`Thumbnail ${index + 1}`} 
                                    //     onClick={() => handleImageClick(image)}
                                    //     className={`w-24 h-auto cursor-pointer rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 
                                    //     ${selectedImage === image ? 'ring-4 ring-blue-400' : 'ring-1 ring-gray-300'}`}
                                    // />
                                    <ThumbnailImageOnViewPage image={image} name={Assets.sub_category_name} onClick={handleImageClick} selectedImage={selectedImage}/>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex flex-col max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                        <div className='grid gap-6 md:grid-cols-5'>
                            <div className="col-span-4 data w-full max-w-xl">
                                <p className="text-lg font-medium leading-8 text-[#213389] mb-4">
                                    {Assets.category_name}&nbsp; /&nbsp; {Assets.sub_category_name}
                                </p>
                                <h2 className="font-semibold text-gray-700 dark:text-white text-[25px]">
                                    Serial No:{Assets.serial_number}
                                </h2>
                                <p className="font-normal text-xs text-gray-700 dark:text-gray-400">
                                    Model No:{Assets.model_number}
                                </p>
                            </div>
                            <div>
                                <img className="rounded" src="/sampleqr.jpg" alt="" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pr-5 mr-5">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <h6 className="text-2xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5 dark:text-gray-400">
                                    Rs.{Assets.assets_value}
                                </h6>
                                <div className="flex items-center gap-2 pr-5 sm:border-r border-gray-200 mr-5">
                                    <span className="pl-2 font-normal leading-7 text-gray-500 text-sm ">
                                        Assets Type : {Assets.assets_type_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pr-5 mr-5">
                            <span className="font-normal leading-7 text-gray-500 text-sm ">
                             Time Since Registered: {timeSinceRegister}
                            </span>
                        </div>
                        <div className='w-full mb-5 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700'>
                            <h4 className='mr-3 font-semibold text-gray-700 dark:text-white text-base'>Purchase Details</h4>
                            <div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Purchase Order Number : {Assets.category_name}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Supplier Name : {Assets.supplier_name}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Purchase Cost : Rs.{Assets.purchase_cost}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Purchase Type Name : {Assets.purchase_type_name}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Received Condition : {Assets.received_condition}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Warranty : {Assets.warranty}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Other Purchase Details : {Assets.other_purchase_details}
                                        </span>
                                    </div>
                            </div>
                        </div>
                        <div className='w-full mb-5 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700'>
                            <h4 className='mr-3 font-semibold text-gray-700 dark:text-white text-base'>Other Details</h4>
                            <div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Insurance Number : {Assets.insurance_number}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Expected Life Time : {Assets.expected_life_time}
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Depreciation Value : {Assets.depreciation_value}%
                                        </span>
                                    </div>
                                    <div className="my-2 text-black flex">
                                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        </strong>
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Responsible Person Name : {Assets.responsible_person_name}
                                        </span>
                                    </div>
                            </div>
                        </div>
                        {/* <p className="text-gray-500 text-base font-normal mb-5">
                            Introducing our vibrant Basic Yellow Tropical Printed Shirt - a
                            celebration of style and sunshine! Embrace the essence of summer
                            wherever you go with this eye-catching piece that effortlessly
                            blends comfort and tropical flair.{" "}
                            <a href="#" className="text-indigo-600">
                            More....
                            </a>
                        </p>
                        <ul className="grid gap-y-4 mb-8">
                            <li className="flex items-center gap-3">
                            <svg
                                width={26}
                                height={26}
                                viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width={26} height={26} rx={13} fill="#4F46E5" />
                                <path
                                d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                stroke="white"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                />
                            </svg>
                            <span className="font-normal text-base text-gray-900 ">
                                Branded shirt
                            </span>
                            </li>
                            <li className="flex items-center gap-3">
                            <svg
                                width={26}
                                height={26}
                                viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width={26} height={26} rx={13} fill="#4F46E5" />
                                <path
                                d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                stroke="white"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                />
                            </svg>
                            <span className="font-normal text-base text-gray-900 ">
                                3 color shirt
                            </span>
                            </li>
                            <li className="flex items-center gap-3">
                            <svg
                                width={26}
                                height={26}
                                viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width={26} height={26} rx={13} fill="#4F46E5" />
                                <path
                                d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                stroke="white"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                />
                            </svg>
                            <span className="font-normal text-base text-gray-900 ">
                                Pure Cotton Shirt with 60% as 40%
                            </span>
                            </li>
                            <li className="flex items-center gap-3">
                            <svg
                                width={26}
                                height={26}
                                viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width={26} height={26} rx={13} fill="#4F46E5" />
                                <path
                                d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                stroke="white"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                />
                            </svg>
                            <span className="font-normal text-base text-gray-900 ">
                                all size is available
                            </span>
                            </li>
                        </ul> */}
                    </div>
                    </div>
                </div>
                </section>
            </div>
        </>
    );
}

export default ViewAssetsDetails; 