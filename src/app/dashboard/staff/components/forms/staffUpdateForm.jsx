import { useAssetListQuery } from '@/app/_lib/redux/features/asset/asset_api';
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';
import { useGetProcurementStaffQuery, useUpdateMemberFromProcurementStaffMutation } from '@/app/_lib/redux/features/procurementProcess/procurementApi';
import { useUserRetrieveFromQuerySearchMutation } from '@/app/_lib/redux/features/user/user_api';
import { Button, Form, Select, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StaffUpdateForm() {
    const notifySuccess = () => toast.success("Staff updated successfully!");
    const notifyError = () => toast.error("Failed to update member to procurement staff!");

    const dispatch = useDispatch();
    const [
        userRetrieveFromQuerySearch,
        { data: userData, isLoading, isSuccess },
    ] = useUserRetrieveFromQuerySearchMutation();
    const { data: assetTypes, isSuccess: assetTypeIsSuccess } = useAssetListQuery()
    const [updateMemberFromProcurementStaff] = useUpdateMemberFromProcurementStaffMutation()
    const { id: procurementStaffId } = useSelector((state) => state.popupModel);
    const { data: procurementStaff } = useGetProcurementStaffQuery();

    const member = procurementStaff.data.find(member => member.staff_id === procurementStaffId)
    const [users, setUsers] = useState()
    const [assetTypesArray, setAssetTypesArray] = useState()

    useEffect(() => {
        userRetrieveFromQuerySearch({ query: "", page: 1 });
    }, []);

    useEffect(() => {
        console.log(member)
        if (isSuccess && assetTypeIsSuccess) {
            setUsers(userData.data.map(user => ({
                label: user.name,
                value: user.id,
                desc: user.name,
            })));
            setAssetTypesArray(assetTypes.data.map(asset => ({
                label: asset.name,
                value: asset.id,
                desc: asset.name,
            })))
        }
    }, [isSuccess, userData, assetTypeIsSuccess, assetTypes]);


    const onFinish = async (values) => {
        try {
            await updateMemberFromProcurementStaff({
                staff_id: procurementStaffId,
                user_id: values.user,
                asset_class_id: values.assets_classes
            });

            dispatch(handleClosePopupModel());

            notifySuccess()

            console.log('Received values of form:', values);
        } catch (error) {
            notifyError()
            console.error('Failed to add new member to procurement staff:', error);
        }
    };
    return (
        <Form
            onFinish={onFinish}
            autoComplete="off"
            className='pt-6 pl-2 pr-6'
            style={{ overflowY: 'auto', maxHeight: '600px' }}
        >
            <div className="flex space-x-4">
                <div className="flex-1">
                    <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Users</Typography.Title>
                    <Form.Item
                        name="user"
                        rules={[{ required: true }]}
                    >
                        <Select
                            mode="single"
                            defaultValue={member.user_id}
                            style={{ width: '100%' }}
                            placeholder="select one user"
                            // onChange={handleChange}
                            options={users}
                            optionRender={(option) => (
                                <Space>
                                    {option.data.desc}
                                </Space>
                            )}

                        />
                    </Form.Item>
                </div>
                <div className="flex-1">
                    <Typography.Title level={5} className='text-sm font-medium text-gray-900 dark:text-white'>Assets Classes</Typography.Title>
                    <Form.Item
                        name="assets_classes"
                        rules={[{ required: true }]}
                    >
                        <Select
                            mode="single"
                            style={{ width: '100%' }}
                            defaultValue={member.asset_type_id}
                            placeholder="select one asset class"
                            // onChange={handleChange}
                            options={assetTypesArray}
                            optionRender={(option) => (
                                <Space>
                                    {option.data.desc}
                                </Space>
                            )}

                        />
                    </Form.Item>
                </div>
            </div>

            <Form.Item>
                <Button type="primary" htmlType="submit" className='mt-2 ant-submit-btn'>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default StaffUpdateForm
