import CloseIcon from '@/assets/icons/CloseIcon'
import Colors from '@/constants/Colors'
import Size from '@/constants/Size'
import { ReactNode } from 'react'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native'

interface ModalContainerProps {
    children: ReactNode;
    modalVisible: boolean;
    closeModal: () => void;
}

// Reusable component for modals in view chemical screen
const ModalContainer = ({ children, modalVisible, closeModal }: ModalContainerProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={styles.blurContainer}>
                <View style={styles.modalView}>

                    {/* X (Close) button */}
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <CloseIcon width={24} height={24} color={Colors.black} />
                    </TouchableOpacity>
                    
                    {children}

                </View>
            </View>
        </Modal>
    )
}

export default ModalContainer

const styles = StyleSheet.create({
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(249, 249, 249, 0.75)',
    },
    modalView: {
        width: '100%',
        height: Size.height(691),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 10.0,
        marginTop: 'auto',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 0,
        marginTop: 20,
        marginRight: 20,
    },
})
