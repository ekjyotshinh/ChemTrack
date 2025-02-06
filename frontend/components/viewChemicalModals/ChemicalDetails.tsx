import { BlurView } from 'expo-blur'
import { View, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '@/constants/Colors';
import CloseIcon from '@/assets/icons/CloseIcon';
import TextInter from '../TextInter';
import Size from '@/constants/Size';
import CustomButton from '../CustomButton';
import QrCodeIcon from '@/assets/icons/QRCodeIcon';
import ViewDocIcon from '@/assets/icons/ViewDocIcon';
import CustomEditIcon from '@/assets/icons/EditIcon';

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
}

interface props {
    selectedChemical: Chemical | null
    toggleSDSBottomSheet: () => void
    modalVisible: boolean
    closeModal: () => void
}

const ChemicalDetail = ({ property, value, color }: { property: string, value: string | null, color?: string }) => {
    if (!color) color = Colors.black
    return (
        <View style={stylesPopup.details}>
            <TextInter style={{ fontWeight: '700', fontSize: 18 }}>{property}</TextInter>
            <TextInter style={{ color: color, fontSize: 18 }}>{value || 'Unknown'}</TextInter>
        </View>
    )
}

const ChemicalDetails = ({ selectedChemical, toggleSDSBottomSheet, modalVisible, closeModal }: props) => {

    const gapSize = Size.height(15)

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

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <BlurView intensity={50} style={stylesPopup.blurContainer}>
                <View style={stylesPopup.modalView}>

                    {/* X (Close) button */}
                    <TouchableOpacity style={stylesPopup.closeButton} onPress={closeModal}>
                        <CloseIcon width={24} height={24} color={Colors.black} />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={stylesPopup.modalContent}>
                        {/* Chemical Details */}
                        {selectedChemical && (<>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginBottom: Size.height(10) }}>
                                {/* QR Code Placeholder */}
                                <View style={stylesPopup.qrCodePlaceholder}>
                                    <TextInter>QR Code</TextInter>
                                </View>
                            
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
                                    <TextInter style={stylesPopup.chemicalName}>{selectedChemical.name}</TextInter>
                                    <ChemicalDetail property={'CAS: '} value={selectedChemical.CAS} />
                                </View>
                            </View>


                            {/* Chemical Details */}
                            <ChemicalDetail property={'ID: '} value={selectedChemical.id} />
                            <View style={{flex: 1, marginBottom: gapSize, marginTop: gapSize}}>
                                <ChemicalDetail property={'Purchase Date: '} value={selectedChemical.purchase_date} />
                                <ChemicalDetail property={'Expiration Date: '} value={selectedChemical.expiration_date} />
                            </View>
                            <ChemicalDetail property={'School: '} value={selectedChemical.school} />
                            <ChemicalDetail property={'Room: '} value={selectedChemical.room} />
                            <ChemicalDetail property={'Cabinet: '} value={selectedChemical.cabinet} />
                            <ChemicalDetail property={'Shelf: '} value={selectedChemical.shelf} />

                            {/* Status */}
                            <View style={{flex: 1, marginBottom: gapSize, marginTop: gapSize}}>
                                <ChemicalDetail property={'Status: '} value={'On-site'} color={getStatusColor('On-site')} />
                                <ChemicalDetail property={'Quantity: '} value={'Good'} color={getQuantityColor('Good')} />
                            </View>
                            
                            <View style={stylesPopup.buttonContainer}>
                                <CustomButton 
                                    title={'Save QR Label'}
                                    icon={<QrCodeIcon color={Colors.black} strokeWidth='4' />}
                                    textColor={Colors.black}
                                    onPress={()=> {}}
                                    color={Colors.white}
                                    width={270}
                                    height={47}
                                    fontSize={14}
                                />
                                <CustomButton 
                                    title={'View SDS'}
                                    icon={<ViewDocIcon color={Colors.black} />}
                                    textColor={Colors.black}
                                    onPress={()=> {}}
                                    color={Colors.white}
                                    width={270}
                                    height={47}
                                    fontSize={14}
                                />
                                <CustomButton 
                                    title={'Edit Information'}
                                    icon={<CustomEditIcon color={Colors.white} />}
                                    onPress={()=> {}}
                                    color={Colors.blue}
                                    width={270}
                                    height={47}
                                    fontSize={14}
                                />
                            </View>
                            
                            </>)}
                    </ScrollView>
                </View>
            </BlurView>
        </Modal>
    )
}

const stylesPopup = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '100%',
        height: Size.height(691),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: Colors.offwhite,
        padding: 20,
        alignItems: 'center',
        elevation: 20,
        marginTop: 'auto',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 0,
        margin: 0,
    },
    closeButtonTextInter: {
        fontSize: 25,
        color: Colors.black,
    },
    modalContent: {
        width: '100%',
        marginTop: 20,
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
    onSiteStatus: {
        color: '#4285F4',
        fontWeight: 'bold',
    },
    actionButton: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    actionButtonTextInter: {
        fontSize: 16,
    },
    editButton: {
        width: '100%',
        backgroundColor: '#4285F4',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    editButtonTextInter: {
        color: 'white',
        fontSize: 16,
    },
    details: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }

});

export default ChemicalDetails;