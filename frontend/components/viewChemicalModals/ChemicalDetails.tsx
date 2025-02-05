import { BlurView } from 'expo-blur'
import { View, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '@/constants/Colors';
import CloseIcon from '@/assets/icons/CloseIcon';
import TextInter from '../TextInter';

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
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                {/* QR Code Placeholder */}
                                <View style={stylesPopup.qrCodePlaceholder}>
                                    <TextInter style={stylesPopup.qrCodeTextInter}>QR Code</TextInter>
                                </View>

                            
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TextInter style={stylesPopup.chemicalName}>{selectedChemical.name}</TextInter>
                                    <TextInter style={stylesPopup.chemicalCAS}>CAS: {selectedChemical.CAS || 'N/A'}</TextInter>
                                </View>
                            </View>


                            {/* Chemical Details */}
                            <ChemicalDetail property={'ID:'} value={selectedChemical.id} />
                            <ChemicalDetail property={'Purchase Date:'} value={selectedChemical.purchase_date} />
                            <ChemicalDetail property={'Expiration Date:'} value={selectedChemical.expiration_date} />
                            <ChemicalDetail property={'School:'} value={selectedChemical.school} />
                            <ChemicalDetail property={'Room:'} value={selectedChemical.room} />
                            <ChemicalDetail property={'Cabinet:'} value={selectedChemical.cabinet} />
                            <ChemicalDetail property={'Shelf:'} value={selectedChemical.shelf} />

                            {/* Status */}
                            <ChemicalDetail property={'Status:'} value={'On-site'} color={getStatusColor('On-site')} />
                            <ChemicalDetail property={'Quantity:'} value={'Good'} color={getQuantityColor('Good')} />


                            {/* Buttons */}
                            <TouchableOpacity style={stylesPopup.actionButton}>
                                <TextInter style={stylesPopup.actionButtonTextInter}>Print QR Code</TextInter>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesPopup.actionButton} onPress={toggleSDSBottomSheet}>
                                <TextInter style={stylesPopup.actionButtonTextInter}>View SDS</TextInter>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesPopup.editButton}>
                                <TextInter style={stylesPopup.editButtonTextInter}>Edit Information</TextInter>
                            </TouchableOpacity></>)}
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
        height: '75%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // backgroundColor: 'blue',
        backgroundColor: Colors.white,
        padding: 20,
        alignItems: 'center',
        elevation: 20,
        marginTop: 'auto',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 0,
        margin: 0,
    },
    closeButtonTextInter: {
        fontSize: 25,
        color: Colors.black,
    },
    modalContent: {
        marginTop: 20,
        width: '100%',
        // alignItems: 'center',
        // backgroundColor: 'red'
    },
    chemicalName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4285F4',
        textAlign: 'center',
    },
    chemicalId: {
        fontSize: 16,
        marginTop: 5,
    },
    chemicalCAS: {
        fontSize: 16,
        marginBottom: 10,
    },
    qrCodePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    qrCodeTextInter: {
        color: '#999',
    },
    onSiteStatus: {
        color: '#4285F4',
        fontWeight: 'bold',
    },
    quantityGood: {
        color: 'green',
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