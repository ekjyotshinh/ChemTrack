// IconsPage.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AddUserIcon from '@/assets/icons/AddUserIcon';
import AdminUserIcon from '@/assets/icons/AdminUserIcon';
import ArrowbackIcon from '@/assets/icons/ArrowbackIcon';
import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import BellIcon from '@/assets/icons/BellIcon';
import CheckMarkIcon from '@/assets/icons/CheckMarkIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import EditIcon from '@/assets/icons/EditIcon';
import EyeIcon from '@/assets/icons/EyeIcon';
import FilterIcon from '@/assets/icons/FilterIcon';
import HomeIcon from '@/assets/icons/HomeIcon';
import LoginIcon from '@/assets/icons/LoginIcon';
import MasterUserIcon from '@/assets/icons/MasterUserIcon';
import PdfIcon from '@/assets/icons/PdfIcon';
import PlusIcon from '@/assets/icons/PlusIcon';
import QRCodeIcon from '@/assets/icons/QRCodeIcon';
import ResetIcon from '@/assets/icons/ResetIcon';
import ReturnIcon from '@/assets/icons/ReturnIcon';
import SendIcon from '@/assets/icons/SendIcon';
import SortIcon from '@/assets/icons/SortIcon';
import UploadIcon from '@/assets/icons/UploadIcon';
import UserIcon from '@/assets/icons/UserIcon';
import ViewDocIcon from '@/assets/icons/ViewDocIcon';

const IconsPage = () => {
    const icons = [
        { component: <AddUserIcon width={24} height={24} color="black" />, name: 'Add User Icon' },
        { component: <AdminUserIcon width={24} height={24} color="black" />, name: 'Admin User Icon' },
        { component: <ArrowbackIcon width={24} height={24} color="black" />, name: 'Arrowback Icon' },
        { component: <AscendingSortIcon width={24} height={24} color="black" />, name: 'Ascending Sort Icon' },
        { component: <BellIcon width={24} height={24} color="black" />, name: 'Bell Icon' },
        { component: <CheckMarkIcon width={24} height={24} color="black" />, name: 'Check Mark Icon' },
        { component: <DescendingSortIcon width={24} height={24} color="black" />, name: 'Descending Sort Icon' },
        { component: <EditIcon width={24} height={24} color="black" />, name: 'Edit Icon' },
        { component: <EyeIcon width={24} height={24} color="black" />, name: 'Eye Icon' },
        { component: <FilterIcon width={24} height={24} color="black" />, name: 'Filter Icon' },
        { component: <HomeIcon width={24} height={24} color="black" />, name: 'Home Icon' },
        { component: <LoginIcon width={24} height={24} color="black" />, name: 'Login Icon' },
        { component: <MasterUserIcon width={24} height={24} color="black" />, name: 'Master User Icon' },
        { component: <PdfIcon width={24} height={24} color="black" />, name: 'PDF Icon' },
        { component: <PlusIcon width={24} height={24} color="black" />, name: 'Plus Icon' },
        { component: <QRCodeIcon width={24} height={24} color="black" />, name: 'QR Code Icon' },
        { component: <ResetIcon width={24} height={24} color="black" />, name: 'Reset Icon' },
        { component: <ReturnIcon width={24} height={24} color="black" />, name: 'Return Icon' },
        { component: <SendIcon width={24} height={24} color="black" />, name: 'Send Icon' },
        { component: <SortIcon width={24} height={24} color="black" />, name: 'Sort Icon' },
        { component: <UploadIcon width={24} height={24} color="black" />, name: 'Upload Icon' },
        { component: <UserIcon width={24} height={24} color="black" />, name: 'User Icon' },
        { component: <ViewDocIcon width={24} height={24} color="black" />, name: 'View Document Icon' },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {icons.map((icon, index) => (
                <View key={index} style={styles.iconContainer}>
                    {icon.component}
                    <Text style={styles.iconName}>{icon.name}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    iconContainer: {
        alignItems: 'center',
        margin: 20,
    },
    iconName: {
        marginTop: 8,
        fontSize: 16,
        color: '#333',
    },
});

export default IconsPage;
