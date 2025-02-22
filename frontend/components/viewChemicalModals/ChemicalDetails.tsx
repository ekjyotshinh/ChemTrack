import { View, Modal, ScrollView, StyleSheet } from 'react-native'
import { ReactNode } from 'react'
import Colors from '@/constants/Colors';
import TextInter from '../TextInter';
import Size from '@/constants/Size';
import CustomButton from '../CustomButton';
import QrCodeIcon from '@/assets/icons/QRCodeIcon';
import ViewDocIcon from '@/assets/icons/ViewDocIcon';
import CustomEditIcon from '@/assets/icons/EditIcon';
import ModalContainer from './ModalContainer';
import processCAS from '@/functions/ProcessCAS';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

interface chemicalDetailProps {
    property: string
    value: string | null
    color?: string
    margin?: number
}

// Component for displaying chemical details (attributes such as school, status, etc.)
const ChemicalDetail = ({ property, value, color, margin = 0 }: chemicalDetailProps) => {
    if (!color) color = Colors.black
    return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: margin }}>
            <TextInter style={{ fontWeight: '700', fontSize: 18 }}>{property}</TextInter>
            <TextInter style={{ color: color, fontSize: 18 }}>{value || 'Unknown'}</TextInter>
        </View>
    )
}

// Scroll container with flexbox styling
const ScrollContainer = ({ children }: { children: ReactNode }) => {
    return (
        <View style={stylesPopup.modalContent}>
            <ScrollView style={{ width: '100%' }}>
                <View style={{ paddingBottom: 75, paddingHorizontal: 35 }}>
                    {children}
                </View>
            </ScrollView>
        </View>
    )
}

interface Chemical {
    id: string;
    name: string;
    CAS: string;
    purchase_date: string;
    expiration_date: string;
    school: string;
    room: string;
    cabinet: string;
    shelf: string;
    status: string;
    quantity: string;
}

interface props {
    selectedChemical: Chemical | null
    toggleSDSBottomSheet: () => void
    modalVisible: boolean
    closeModal: () => void
    router: ReturnType<typeof useRouter>;
}

const ChemicalDetails = ({ selectedChemical, toggleSDSBottomSheet, modalVisible, closeModal, router }: props) => {

    const gapSize = Size.height(12)

    // Determine color based on location status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On-site':
                return Colors.blue
            case 'Off-site':
                return Colors.red
            default:
                return 'black'
        }
    }

    // Determine color based on quantity level
    const getQuantityColor = (quantity: string) => {
        switch (quantity) {
            case 'Good':
                return Colors.green
            case 'Fair':
                return Colors.blue
            case 'Low':
                return Colors.red
            default:
                return 'black'
        }
    }

    const { userInfo } = useUser()

    return (
        <ModalContainer modalVisible={modalVisible} closeModal={closeModal}>
            <ScrollContainer>
                {selectedChemical && (<>
                    <View style={stylesPopup.qrTitleContainer}>
                        {/* QR Code Placeholder */}
                        <View style={stylesPopup.qrCodePlaceholder}>
                            <TextInter>QR Code</TextInter>
                        </View>

                        {/* Chemical Name & CAS */}
                        <View style={stylesPopup.nameCASContainer}>
                            <TextInter style={stylesPopup.chemicalName}>{selectedChemical.name}</TextInter>
                            <ChemicalDetail property={'CAS: '} value={processCAS(selectedChemical.CAS)} />
                        </View>
                    </View>


                    {/* Chemical Details */}
                    <ChemicalDetail property={'ID: '} value={selectedChemical.id} margin={gapSize} />

                    <ChemicalDetail property={'Purchase Date: '} value={selectedChemical.purchase_date} />
                    <ChemicalDetail property={'Expiration Date: '} value={selectedChemical.expiration_date} margin={gapSize} />

                    <ChemicalDetail property={'School: '} value={selectedChemical.school} />
                    <ChemicalDetail property={'Room: '} value={selectedChemical.room} />
                    <ChemicalDetail property={'Cabinet: '} value={selectedChemical.cabinet} />
                    <ChemicalDetail property={'Shelf: '} value={selectedChemical.shelf} margin={gapSize} />

                    {/* Status & Quantity */}
                    <ChemicalDetail property={'Status: '} value={selectedChemical.status} color={getStatusColor(selectedChemical.status)} />
                    <ChemicalDetail property={'Quantity: '} value={selectedChemical.quantity} color={getQuantityColor(selectedChemical.quantity)} margin={gapSize} />

                    {/* Buttons */}
                    <View style={stylesPopup.buttonContainer}>
                        <CustomButton
                            title={'Save QR Label'}
                            icon={<QrCodeIcon color={Colors.black} strokeWidth='4' />}
                            textColor={Colors.black}
                            onPress={() => { }}
                            color={Colors.white}
                            width={270}
                            height={47}
                            fontSize={14}
                        />
                        <CustomButton
                            title={'View SDS'}
                            icon={<ViewDocIcon color={Colors.black} />}
                            textColor={Colors.black}
                            onPress={toggleSDSBottomSheet}
                            color={Colors.white}
                            width={270}
                            height={47}
                            fontSize={14}
                        />
                        {userInfo && (userInfo.is_admin || userInfo.is_master) &&
                            <CustomButton
                                title={'Edit Information'}
                                icon={<CustomEditIcon color={Colors.white} />}
                                onPress={() => {
                                    closeModal();  // Close the modal
                                    const chemicalId = selectedChemical.id;
                                    router.push(`/editChemical?id=${chemicalId}`);
                                }}
                                color={Colors.blue}
                                width={270}
                                height={47}
                                fontSize={14}
                            />}
                    </View>

                </>)}
            </ScrollContainer>
        </ModalContainer>
    )
}

const stylesPopup = StyleSheet.create({
    modalContent: {
        width: '100%',
        marginTop: 20,
    },
    qrTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: Size.height(5)
    },
    nameCASContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5
    },
    buttonContainer: {
        alignItems: 'center',
    },
    chemicalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.blue,
        textAlign: 'center',
    },
    qrCodePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: Colors.grey,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

});

export default ChemicalDetails;