import { BlurView } from 'expo-blur'
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

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

const ChemicalDetails = ({ selectedChemical, toggleSDSBottomSheet, modalVisible, closeModal }: props) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <BlurView intensity={50} style={stylesPopup.blurContainer}>
                <View style={stylesPopup.modalView}>
                    <TouchableOpacity style={stylesPopup.closeButton} onPress={closeModal}>
                        <Text style={stylesPopup.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    <ScrollView contentContainerStyle={stylesPopup.modalContent}>
                        {/* Chemical Details */}
                        {selectedChemical && (<>
                            <Text style={stylesPopup.chemicalName}>{selectedChemical.name}</Text>
                            <Text style={stylesPopup.chemicalId}>ID: {selectedChemical.id || 'Unknown'}</Text>
                            <Text style={stylesPopup.chemicalCAS}>CAS: {selectedChemical.CAS || 'N/A'}</Text>

                            {/* QR Code Placeholder */}
                            <View style={stylesPopup.qrCodePlaceholder}>
                                <Text style={stylesPopup.qrCodeText}>QR Code</Text>
                            </View>

                            {/* Chemical Details */}
                            <Text>Purchase Date: {selectedChemical.purchase_date || 'Unknown'}</Text>
                            <Text>Expiration Date: {selectedChemical.expiration_date || 'Unknown'}</Text>
                            <Text>School: {selectedChemical.school || 'Unknown'}</Text>
                            <Text>Room: {selectedChemical.room || 'Unknown'}</Text>
                            <Text>Cabinet: {selectedChemical.cabinet || 'Unknown'}</Text>
                            <Text>Shelf: {selectedChemical.shelf || 'Unknown'}</Text>

                            <Text>Status: <Text style={stylesPopup.onSiteStatus}>On-site</Text></Text>
                            <Text>Quantity: <Text style={stylesPopup.quantityGood}>Good</Text></Text>

                            {/* Buttons */}
                            <TouchableOpacity style={stylesPopup.actionButton}>
                                <Text style={stylesPopup.actionButtonText}>Print QR Code</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesPopup.actionButton} onPress={toggleSDSBottomSheet}>
                                <Text style={stylesPopup.actionButtonText}>View SDS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesPopup.editButton}>
                                <Text style={stylesPopup.editButtonText}>Edit Information</Text>
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
    openText: {
        fontSize: 18,
        color: '#4285F4',
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '90%',
        borderRadius: 20,
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        elevation: 20,
        marginBottom: 30,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 20,
        color: '#555',
    },
    modalContent: {
        alignItems: 'center',
    },
    chemicalName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4285F4',
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
    qrCodeText: {
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
    actionButtonText: {
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
    editButtonText: {
        color: 'white',
        fontSize: 16,
    },

});

export default ChemicalDetails;