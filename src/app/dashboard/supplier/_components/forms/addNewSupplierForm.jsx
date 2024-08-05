import React, { useEffect, useState } from 'react';
import { Divider, Input, Radio, Typography, Upload, Button, Select, Space, Rate, Form } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import MapPicker from "react-google-map-picker";
import Requisitionsapproval from '@/app/dashboard/components/requisitionsapproval/requisitionsapproval';
import { useAssetListQuery } from '@/app/_lib/redux/features/asset/asset_api';
import { useGetAllSupplierQuery, useGetSupplierRegisterIdQuery, useRegisterNewSupplierMutation } from '@/app/_lib/redux/features/supplier/supplier_api';

const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

function AddNewSupplierForm() {
    const { data: assetData, isSuccess } = useAssetListQuery()
    const { data: supplierId, isSuccess: supplierIdIsSuccess } = useGetSupplierRegisterIdQuery()
    const [registerNewSupplier] = useRegisterNewSupplierMutation()
    const { refetch } = useGetAllSupplierQuery()

    const [supplierType, setSupplierType] = useState('Company');

    const [contactInputs, setContactInputs] = useState([{ id: 1, value: '' }]);
    const [nextId, setNextId] = useState(2);

    const [supplierRegNo, setSupplierRegNo] = useState()
    const [assetsDataArray, setAssetDataArray] = useState()
    const [formStatus, setFormStatus] = useState(false)
    const [formSubmitData, setFormSubmitData] = useState()
    const [location, setLocation] = useState(DefaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);

    useEffect(() => {
        if (isSuccess) {
            setAssetDataArray(assetData.data.map(asset => ({
                label: asset.name,
                value: asset.id,
                desc: asset.name,
            })))
        }
        if (supplierIdIsSuccess) {
            setSupplierRegNo(supplierId.data.supplier_reg_no)
        }
    }, [assetData, supplierId])

    function handleChangeLocation(lat, lng) {
        setLocation({ lat, lng });
    }

    function handleChangeZoom(newZoom) {
        setZoom(newZoom);
    }


    const { Option } = Select;
    const selectBefore = (
        <Select defaultValue="http://">
            <Option value="http://">http://</Option>
            <Option value="https://">https://</Option>
        </Select>
    );

    const handleSetSupplierType = (e) => {
        setSupplierType(e.target.value);
    };

    const handleInputChange = (id, event) => {
        const newInputs = contactInputs.map(input => {
            if (input.id === id) {
                return { ...input, value: event.target.value };
            }
            return input;
        });
        setContactInputs(newInputs);
    };

    const addNewContactInput = () => {
        setContactInputs([...contactInputs, { id: nextId, value: '' }]);
        setNextId(nextId + 1);
    };

    const removeContactInput = (id) => {
        setContactInputs(contactInputs.filter(input => input.id !== id));
    };

    const fileList = [];

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const onFinish = async (values) => {
        let contactNo = {}
        const selectedAssets = values['assets_classes'].map(id => {
            const asset = assetsDataArray.find(option => option.value === id);
            return { id: asset.value, name: asset.label };
        });

        values["assets_classes"] = selectedAssets

        for (const key in values) {
            if (key.startsWith("Contact No ")) {
                contactNo[key] = values[key];
            }
        }

        values["contact_no"] = contactNo

        await registerNewSupplier({
            p_name: values.name,
            p_address: values.address,
            p_description: values.name,
            p_supplier_asset_classes: values.assets_classes,
            p_supplier_rating: values.supplier_rating,
            p_supplier_bussiness_name: values.business_name || null,
            p_supplier_bussiness_register_no: values.business_registration || null,
            p_supplier_primary_email: values.primary_email || null,
            p_supplier_secondary_email: values.secondary_email || null,
            p_supplier_br_attachment: values.br_attachment || null,
            p_supplier_website: values.website || null,
            p_supplier_tel_no: values.tel_no || null,
            p_supplier_mobile: values.mobile || null,
            p_supplier_fax: values.fax || null,
            p_supplier_city: values.city || null,
            p_supplier_location_latitude: location.lat || null,
            p_supplier_location_longitude: location.lng || null,
            p_contact_no: values.contact_no
        })

        refetch()

        console.log('Received values of form:', values);
        setFormSubmitData(values)
        setFormStatus(true)
    };


    return (
        <div>
            {
                !formStatus ? (<Form
                    onFinish={onFinish}
                    autoComplete="off"
                    className='pt-6 pl-2 pr-6'
                    style={{ overflowY: 'auto', maxHeight: '600px' }}
                >
                    <div className='flex flex-row justify-between'>
                        <Form.Item
                            name="supplier_type"
                        >
                            <Radio.Group value={supplierType} onChange={handleSetSupplierType}>
                                <Radio.Button value="Company">Company</Radio.Button>
                                <Radio.Button value="Individual">Individual</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <span className='font-bold'>{supplierRegNo}</span>
                    </div>

                    <div className='mt-10'>
                        <Divider orientation="left" orientationMargin="0" className="custom-divider">
                            <span className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>Personal</span>
                        </Divider>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white' >Name</Typography.Title>
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true }, { type: 'string', min: 6 }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} onChange={(e) => console.log('Name:', e.target.value)} />
                                </Form.Item>
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Address</Typography.Title>
                                <Form.Item
                                    name="address"
                                    rules={[{ required: true }, { type: 'string', min: 6 }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} onChange={(e) => console.log('Address:', e.target.value)} />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="flex-1">


                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Assets Classes</Typography.Title>
                                <Form.Item
                                    name="assets_classes"
                                    rules={[{ required: true }, { type: 'array', }]}
                                >
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="select one country"
                                        onChange={handleChange}
                                        options={assetsDataArray}
                                        optionRender={(option) => (
                                            <Space>
                                                {option.data.desc}
                                            </Space>
                                        )}

                                    />
                                </Form.Item>
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Supplier Rating</Typography.Title>
                                <Form.Item
                                    name="supplier_rating"
                                    rules={[{ required: true }]}
                                >
                                    <Rate />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="w-1/2 mt-4">
                            <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>
                                Contact No
                                <button className='ml-4' type="button" onClick={addNewContactInput}>
                                    <PlusOutlined />
                                </button>
                            </Typography.Title>
                            {contactInputs.map((input, index) => (
                                <div key={input.id} className="flex items-center mt-2">
                                    <Form.Item
                                        name={`contact_no ${input.id}`}
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            showCount
                                            maxLength={20}
                                            value={input.value}
                                            onChange={(e) => handleInputChange(input.id, e)}
                                            className="flex-1 custom-input"
                                        />
                                    </Form.Item>

                                    {contactInputs.length > 1 && (
                                        <button className='ml-4' type="button" onClick={() => removeContactInput(input.id)}>
                                            <MinusCircleOutlined />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {supplierType === 'Company' && (<div className='mt-10'>
                        <Divider orientation="left" orientationMargin="0" className="custom-divider">
                            <span className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>Company</span>
                        </Divider>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white' >Business Name</Typography.Title>
                                <Form.Item
                                    name="business_name"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Business Registration</Typography.Title>
                                <Form.Item
                                    name="business_registration"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Primary Email</Typography.Title>
                                <Form.Item
                                    name="primary_email"
                                    rules={[{ required: true }, { type: "email" }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Secondary Email</Typography.Title>
                                <Form.Item
                                    name="secondary_email"
                                    rules={[{ required: true }, { type: "email" }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>BR Attachment</Typography.Title>
                                <Form.Item
                                    name="br_attachment"
                                    rules={[{ required: true }]}
                                >
                                    <Upload
                                        action=""
                                        listType="picture"
                                        defaultFileList={[...fileList]}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Website</Typography.Title>
                                <Form.Item
                                    name="website"
                                    rules={[{ required: true }]}
                                >
                                    <Input addonBefore={selectBefore} defaultValue="mysite" />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Tel No</Typography.Title>
                                <Form.Item
                                    name="tel_no"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Mobile</Typography.Title>
                                <Form.Item
                                    name="mobile"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Fax</Typography.Title>
                                <Form.Item
                                    name="fax"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>City</Typography.Title>
                                <Form.Item
                                    name="city"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Latitude</Typography.Title>
                                <input className='text-sm font-medium text-gray-700 dark:text-white' type='text' value={location.lat} disabled />
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Longitude</Typography.Title>
                                <input className='text-sm font-medium text-gray-700 dark:text-white' type='text' value={location.lng} disabled />
                            </div>
                        </div>
                        <div className="flex mt-2 space-x-4">
                            <div className="flex-1">
                                <MapPicker
                                    defaultLocation={DefaultLocation}
                                    location={location}
                                    zoom={zoom}
                                    mapTypeId="roadmap"
                                    style={{ height: "350px" }}
                                    onChangeLocation={handleChangeLocation}
                                    onChangeZoom={handleChangeZoom}
                                    apiKey="AIzaSyD7y48-Ir_HKE43kMn_5DGf28FpJ8vRf-s"
                                />
                            </div>
                        </div>
                    </div>)}

                    <div className='mt-10'>
                        <Divider orientation="left" orientationMargin="0" className="custom-divider">
                            <span className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>Login Information</span>
                        </Divider>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Username</Typography.Title>
                                <Form.Item
                                    name="supplier_username"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                            <div className="flex-1">
                                <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Email</Typography.Title>
                                <Form.Item
                                    name="supplier_email"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="input placeholder" className="custom-input" showCount maxLength={20} />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='mt-6 ant-submit-btn'>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>)
                    :
                    <Requisitionsapproval RequisitionId={supplierRegNo} formData={formSubmitData} modelData={"Supplier Registration"} requestType={2} />
            }
        </div>
    );
}

export default AddNewSupplierForm;
