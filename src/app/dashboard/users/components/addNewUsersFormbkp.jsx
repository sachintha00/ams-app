'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddNewUserMutation, useUsersListQuery } from '@/app/_lib/redux/features/user/user_api';
import { IoClose } from "react-icons/io5";
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';
import SelectInput from '../../components/inputs/SelectInput';
import renderDesignationsItem from './menulist/renderDesignationsItem';
import { useDropzone } from 'react-dropzone';

function AddNewUsersForm({ }) {
    const dispatch = useDispatch()
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [usercreateerror, setUserCreateError] = useState('');
    const [formemessage, setmessage] = useState('');
    const [isOpenRoleList, setIsOpenRoleList] = useState(false);

    const refRoleList = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refRoleList.current && !refRoleList.current.contains(event.target)) {
                setIsOpenRoleList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSwitchView = (newView) => {
        setView(newView);
    };

    const toggleRoleListHandler = () => {
        setIsOpenRoleList((prev) => !prev);
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const {
        data: UserList,
        isLoading,
        isError,
        error,
        refetch,
    } = useUsersListQuery();

    useEffect(() => {
        if (!isLoading && !isError && UserList) {
            const roles = Object.values(UserList.Role);
            const filtered = roles.filter(role => role.name.toLowerCase().includes(searchInput.toLowerCase()));
            setFilteredRoles(filtered);
        }
    }, [isLoading, isError, UserList, searchInput, refetch]);

    // Designations
    const [designationsArray, setDesignationsArray] = useState([]);
    const [selectedDesignations, setSelectedDesignations] = useState(null);
    const [designationsSearchInput, setDesignationsSearchInput] = useState('');
          
    useEffect(() => {
      if (UserList) {
        const Alldesignations = Object.values(UserList.AllDesignations);
        const filtereddesignations = Alldesignations.filter(item => item.designation.toLowerCase().includes(designationsSearchInput.toLowerCase()));
        setDesignationsArray(filtereddesignations);
      }
    }, [UserList, designationsSearchInput]);

    // add user
    const [addNewUser] = useAddNewUserMutation();

    //add role form data
    const [user_name, setuser_name] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contact_no, setContact_no] = useState("");
    const [address, setAddress] = useState("");
    const [selectedValues, setSelectedValues] = useState([]);
    const [contactPersonMobile, setContactPersonMobile] = useState("");
    const [user_description, setuser_description] = useState("");
    const fileInputRef = useRef(null);

    const [profileImage, setProfileImage] = useState(null);
    const [image, setImage] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false, // Set to false for single file upload
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.bmp', '.tiff']
        },
        onDrop: (acceptedFiles) => {
          setProfileImage(acceptedFiles[0]); // Set the single file to state
        }
    });

    // Function to remove the uploaded image
    const removeImage = () => {
      setProfileImage(null); // Clear the uploaded image
    };

    const getPreview = (file) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <img
                src={imageUrl}
                alt={file.name}
                className="object-cover w-52 h-52 rounded-[100px]"
                onLoad={() => URL.revokeObjectURL(imageUrl)} // Clean up after image is loaded
            />
        );
    };

    const handleCheckboxChange = (event, removedValue) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedValues([...selectedValues, value]);
        } else {
            setSelectedValues(selectedValues.filter((item) => item !== value));
        }
        // Remove the specific value from selectedValues when the close button is clicked
        if (removedValue) {
            setSelectedValues(selectedValues.filter((item) => item !== removedValue));
        }
    };

    // Submit From
    const submitForm = async e => {
        e.preventDefault();
        try {
            const user = { user_name: user_name, email: email, name: name, contact_no: contact_no, profile_image: profileImage, address: address, roles: selectedValues, designation_id: selectedDesignations.id, contact_person: contactPersonMobile, user_description: user_description }
            addNewUser(user)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard/usergroups");
                    setuser_name("");
                    setEmail("");
                    setName("");
                    setContact_no("");
                    setAddress("");
                    setSelectedDesignations("");
                    setContactPersonMobile("");
                    setuser_description("");
                    setSelectedValues([]);
                    setmessage(response.message);
                    dispatch(handleClosePopupModel());
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                    setUserCreateError(error);
                    const timer = setTimeout(() => {
                        setUserCreateError('');
                    }, 5000); // Adjust the duration (in milliseconds) as needed
                    return () => clearTimeout(timer);
                });
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
            <>
              <form className="px-2 pt-2 overflow-y-scroll h-[500px]" onSubmit={submitForm} encType="multipart/form-data">
                {usercreateerror && (
                  <div
                    className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded"
                    role="alert"
                  >
                    {/* <strong className="font-bold">Holy smokes!</strong> */}
                    <span className="block sm:inline">{usercreateerror}</span>
                    <span
                      className="absolute top-0 bottom-0 right-0 px-4 py-3"
                      onClick={handleErrorClose}
                    >
                      <svg
                        className="w-6 h-6 text-red-500 fill-current"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                      </svg>
                    </span>
                  </div>
                )}
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <div className="mb-6">
                      <label
                        htmlFor="user_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        User Name
                      </label>
                      <input
                        type="text"
                        id="user_name"
                        onChange={(e) => setuser_name(e.target.value)}
                        name="user_name"
                        value={user_name}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter user user name"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="last_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        value={email}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter user email address"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        value={name}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter user full name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center w-full">
                      <label
                        for="dropzone-file"
                        className="flex flex-col items-center justify-center w-52 h-52 text-center border-2 border-gray-300 border-dashed rounded-[105px] cursor-pointer bg-white dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        {...getRootProps()}
                      >
                        {!profileImage ? (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and
                              drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                        ) : (
                            <div className='w-[100%] h-[100%] relative'>
                              {getPreview(profileImage)}
                              <a
                                className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white absolute"
                                onClick={removeImage}
                              >
                                <IoClose className="text-xl text-white" />
                              </a>
                            </div>
                        )}
                        <input {...getInputProps()} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact_no"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone number
                    </label>
                    <input
                      type="number"
                      id="contact_no"
                      onChange={(e) => setContact_no(e.target.value)}
                      name="name"
                      value={contact_no}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter user mobile number"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      onChange={(e) => setAddress(e.target.value)}
                      name="address"
                      value={address}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter user address"
                      required
                    />
                  </div>
                  <div className='relative'>
                    <label
                        htmlFor="last_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Role
                    </label>
                    <button
                      id="dropdownSearchButton"
                      data-dropdown-toggle="dropdownSearch"
                      className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      type="button"
                      onClick={toggleRoleListHandler}
                    >
                      Add role to this user
                      <svg
                        className="w-2.5 h-2.5 ms-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedValues.map((Role) => (
                        <span className="flex px-3 py-1 bg-gray-400 rounded-md">
                          {Role}
                          <button
                            className="ml-2"
                            onClick={(event) => handleCheckboxChange(event, Role)}
                          >
                            <IoClose className="text-2xl text-white hover:text-red-400" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {/* Dropdown menu */}
                    <div data-collapse={isOpenRoleList} ref={refRoleList} className='absolute w-[100%]'>
                      <div
                        id="dropdownSearch"
                        className="z-10 hidden bg-white rounded-lg shadow w-auto dark:bg-gray-700 rolelist"
                      >
                        <div className="p-3">
                          <label htmlFor="input-group-search" className="sr-only">
                            Search
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
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
                              type="text"
                              id="input-group-search"
                              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Search role name"
                              value={searchInput}
                              onChange={handleSearchInputChange}
                            />
                          </div>
                        </div>
                        <ul
                          className="h-auto px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownSearchButton"
                        >
                          {filteredRoles.map((Role) => (
                            <li>
                              <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input
                                  id="checkbox-item-11"
                                  type="checkbox"
                                  value={Role.name}
                                  onChange={handleCheckboxChange}
                                  checked={selectedValues.includes(Role.name)}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  htmlFor="checkbox-item-11"
                                  className="w-full text-sm font-medium text-gray-900 rounded ms-2 dark:text-gray-300"
                                >
                                  {Role.name}
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                      <label
                          htmlFor="last_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                          Designations
                      </label>
                      <SelectInput
                          placeholder="Search and Select Designation"
                          data={designationsArray}
                          onSelect={setSelectedDesignations}
                          selected={selectedDesignations}
                          searchInput={designationsSearchInput}
                          setSearchInput={setDesignationsSearchInput}
                          renderItem={renderDesignationsItem}
                          name={'designation'}
                      />
                  </div>

                  <div>
                    <label
                      htmlFor="user_description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      id="user_description"
                      rows="4"
                      onChange={(e) => setuser_description(e.target.value)}
                      name="user_description"
                      value={user_description}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Write short description about this user"
                    ></textarea>
                  </div>

                  <div>
                    <label
                      htmlFor="contact_no"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Contact Person Mobile Number
                    </label>
                    <input
                      type="number"
                      id="contact_no"
                      onChange={(e) => setContactPersonMobile(e.target.value)}
                      name="name"
                      value={contactPersonMobile}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter user mobile number"
                      required
                    />
                  </div>
                </div>

                {/* <div className="flex items-start mb-6">
                                                          <div className="flex items-center h-5">
                                                          <input
                                                              id="remember"
                                                              type="checkbox"
                                                              defaultValue=""
                                                              className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                                              required=""
                                                          />
                                                          </div>
                                                          <label
                                                          htmlFor="remember"
                                                          className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                                                          >
                                                          I agree with the{" "}
                                                          <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                                                              terms and conditions
                                                          </a>
                                                          .
                                                          </label>
                                                      </div> */}
                <button
                  type="submit"
                  className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                >
                  Save
                </button>
              </form>
            </>
    );
}

export default AddNewUsersForm;