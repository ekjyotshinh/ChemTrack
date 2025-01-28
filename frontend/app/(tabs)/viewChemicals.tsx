import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import CustomButton from '@/components/CustomButton';
import Accordion from 'react-native-collapsible/Accordion'; // Add Accordion component
import Colors from '@/constants/Colors';
import axios from 'axios';


export default function ViewChemicals() {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false); // Added for Sort By Modal
  const [sortOption, setSortOption] = useState('Chemical Name'); // Added for sorting logic
  const [sortOrder, setSortOrder] = useState('Ascending'); // Added for sorting logic
  const [filtersVisible, setFiltersVisible] = useState(false); // State for controlling filter modal
  const [expanded, setExpanded] = useState<number[]>([]);
  const router = useRouter();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openSortModal = () => setSortModalVisible(true);
  const closeSortModal = () => setSortModalVisible(false);
  const openFilterModal = () => setFiltersVisible(true);
  const closeFilterModal = () => setFiltersVisible(false);
  const toggleFilterSheet = () => setFiltersVisible(!filtersVisible);

  const [isSDSBottomSheetOpen, setIsSDSBottomSheetOpen] = useState(false);
  const toggleSDSBottomSheet = () => {
    setIsSDSBottomSheetOpen(!isSDSBottomSheetOpen);
  };

  const searchIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 3.75C6.77208 3.75 3.75 6.77208 3.75 10.5C3.75 14.2279 6.77208 17.25 10.5 17.25C12.3642 17.25 14.0506 16.4953 15.273 15.273C16.4953 14.0506 17.25 12.3642 17.25 10.5C17.25 6.77208 14.2279 3.75 10.5 3.75ZM2.25 10.5C2.25 5.94365 5.94365 2.25 10.5 2.25C15.0563 2.25 18.75 5.94365 18.75 10.5C18.75 12.5078 18.032 14.3491 16.8399 15.7793L21.5303 20.4697C21.8232 20.7626 21.8232 21.2374 21.5303 21.5303C21.2374 21.8232 20.7626 21.8232 20.4697 21.5303L15.7793 16.8399C14.3491 18.032 12.5078 18.75 10.5 18.75C5.94365 18.75 2.25 15.0563 2.25 10.5Z" fill="white"/>
  </svg>`;

  const filterSections = [
    { title: 'Status', data: ['On-site', 'Expired', 'In Transit'] },
    { title: 'Expiration Date', data: ['Before 2025', '2025-2030', 'After 2030'] },
    { title: 'Quantity', data: ['Low', 'Medium', 'High'] },
    { title: 'Location', data: ['Room', 'Cabinet', 'Shelf'] },
  ];

  
  interface ChemicalData {
    id: number;
    qr_code: string;
    name: string;
    cas: string;
    school: string;
    purchase_date: string;
    expiration_date: string;
    status: string;
    quantity: string;
    room: string;
    cabinet: string;
    shelf: string;
  }

  const [chemicals, setChemicals] = useState<ChemicalData[]>([]);

  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/chemicals/');
        setChemicals(response.data);
      } catch (error) {
        console.error('Error fetching chemicals:', error);
      }
    };

    fetchChemicals();
  }, []);  // TODO fix this thing that aint workin??


  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        View <Text style={styles.headerHighlight}>Chemicals</Text>
        </Text>
      
      {/* Search Button */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Chemical name..." />
        <TouchableOpacity style={styles.searchButton}>
          <SvgXml xml={searchIconSvg} width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Filter Button */}
      <View style={styles.filterSortContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={openFilterModal} // Open filter modal
        >
          <Text style={styles.buttonText}>Filter By</Text>
        </TouchableOpacity>

       {/* SORT BY BUTTON */}
        <TouchableOpacity style={styles.sortButton} onPress={openSortModal}>
          <Text style={styles.buttonText}>Sort By</Text>
        </TouchableOpacity>
      </View>

      {/* Chemicals List */}
      <ScrollView style={styles.chemicalsList}>
        {chemicalsData.map((chemical, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chemicalItem}
            onPress={openModal} //Route to the Popup Modal
          >
            <Text style={styles.chemicalName}>{chemical.name}</Text>
            <Text style={styles.chemicalCAS}>CAS: {chemical.cas}</Text>
            <Text>Purchased: {chemical.purchased}</Text>
            <Text>Expires: <Text style={chemical.isExpired ? styles.expiredText : null}>{chemical.expires}</Text></Text>
            <Text>Location: {chemical.location}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popup Modal for chemical details */}
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
              <Text style={stylesPopup.chemicalName}>Sodium Chloride</Text>
              <Text style={stylesPopup.chemicalId}>ID: 21978</Text>
              <Text style={stylesPopup.chemicalCAS}>CAS: 7647-14-5</Text>
              
              {/* QR Code Placeholder */}
              <View style={stylesPopup.qrCodePlaceholder}>
                <Text style={stylesPopup.qrCodeText}>QR Code</Text>
              </View>

              {/* Chemical Details */}
              <Text>Purchase Date: 2023-01-15</Text>
              <Text>Expiration Date: 2030-01-15</Text>
              <Text>School: Encina High School</Text>
              <Text>Room: 105B</Text>
              <Text>Cabinet: #2</Text>
              <Text>Shelf: #4</Text>
              <Text>Status: <Text style={stylesPopup.onSiteStatus}>On-site</Text></Text>
              <Text>Quantity: <Text style={stylesPopup.quantityGood}>Good</Text></Text>

              {/* Buttons */}
              <TouchableOpacity style={stylesPopup.actionButton}>
                <Text style={stylesPopup.actionButtonText}>Print QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesPopup.actionButton} onPress={toggleSDSBottomSheet}>
                <Text style={stylesPopup.actionButtonText}>View SDS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesPopup.editButton} /*onPress={() => router.push('/edit-chemical')}*/> {/* Route to the Edit Chemical Page */}
                <Text style={stylesPopup.editButtonText}>Edit Information</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </BlurView>
      </Modal>

      {/* Sort Modal */}
      <Modal animationType="slide" transparent={true} visible={sortModalVisible} onRequestClose={closeSortModal}>
        <View style={stylesSort.modalContainer}>
          <View style={stylesSort.modalView}>
            <TouchableOpacity onPress={closeSortModal} style={stylesSort.closeButton}>
              <Text style={stylesSort.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={stylesSort.modalHeader}>Sort Options</Text>
              
            {/* Dropdown for Sorting Options */}
            <View style={stylesSort.dropdownContainer}>
              {['Chemical Name', 'Purchase Date', 'Expiration Date', 'School Name', 'Quantity', 'Recent'].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSortOption(option); // Set the selected sort option
                    //closeSortModal(); // Close the modal after selection
                  }}
                  style={[
                    stylesSort.option,
                    sortOption === option && stylesSort.selectedOption, // Highlight selected option
                  ]}
                >
                  <Text style={stylesSort.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
                
            {/* Sorting Order Buttons */}
            <View style={stylesSort.orderButtons}>
              <CustomButton
                title={sortOption === 'Chemical Name' || sortOption === 'School Name' || sortOption === 'Quantity' ? "Ascending" : "New -> Old"}
                color={sortOrder === 'Ascending' ? Colors.blue : Colors.white}
                textColor={sortOrder === 'Ascending' ? Colors.white : Colors.black}
                onPress={() => setSortOrder('Ascending')}
                width={180} // Adjust width as needed
                icon={<AscendingSortIcon width={24} height={24} color={sortOrder === 'Ascending' ? Colors.white : Colors.black} />}
                iconPosition="right"
              />
              <CustomButton
                title={sortOption === 'Chemical Name' || sortOption === 'School Name' || sortOption === 'Quantity' ? "Descending" : "Old -> New"}
                color={sortOrder === 'Descending' ? Colors.blue : Colors.white}
                textColor={sortOrder === 'Descending' ? Colors.white : Colors.black}
                onPress={() => setSortOrder('Descending')}
                width={180} // Adjust width as needed
                icon={<DescendingSortIcon width={24} height={24} color={sortOrder === 'Descending' ? Colors.white : Colors.black} />}
                iconPosition="right"
              />
            </View>     
                
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filtersVisible}
        onRequestClose={closeFilterModal}
      >
        <BlurView intensity={50} style={stylesFilter.blurContainer}>
          <View style={[stylesFilter.modalView, { height: '75%' }]}>
            <TouchableOpacity style={stylesFilter.closeButton} onPress={closeFilterModal}>
              <Text style={stylesFilter.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={stylesFilter.modalContent}>
            <Accordion
              sections={filterSections}
              activeSections={expanded} // Manage active sections
              renderHeader={(section) => (
                <View style={stylesFilter.accordionHeader}>
                  <Text>{section.title}</Text>
                </View>
              )}
              renderContent={(section) => (
                <View style={stylesFilter.accordionContent}>
                  {section.data.map((item, index) => (
                    <TouchableOpacity key={index} style={stylesFilter.accordionItem}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              onChange={(expandedSections) => setExpanded(expandedSections)} // Set active sections
            />
            </ScrollView>
          </View>
        </BlurView>
      </Modal>
      
      {/* View SDS Bottom Sheet component */}
      {/*<BottomSheet
        index={isSDSBottomSheetOpen ? 0 : -1}
        snapPoints={['30%', '50%']}
        backgroundStyle={stylesSDS.bottomSheetBackground}
        handleIndicatorStyle={stylesSDS.handleIndicator}
        onClose={() => setIsSDSBottomSheetOpen(false)}
      >
        <View style={stylesSDS.container}>
          <Text style={stylesSDS.headerText}>SDS</Text>
          <TouchableOpacity style={stylesSDS.downloadButton}>
            <Text style={stylesSDS.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>*/}
    </View>
  );
}

// Example data for chemicals
const chemicalsData = [
  {
    id: 1,
    name: 'Sodium Chloride',
    cas: '7647-14-5',
    purchased: '2023-01-15',
    expires: '2030-01-15',
    location: 'Shelf #4',
    schoolName: 'Encina High School',
    quantity: 50,
    isExpired: false,
  },
  {
    id: 2,
    name: 'Hydrochloric Acid',
    cas: '7647-01-0',
    purchased: '2022-09-10',
    expires: '2027-09-10',
    location: 'Shelf #3',
    schoolName: 'Riverdale Academy',
    quantity: 20,
    isExpired: false,
  },
  {
    id: 3,
    name: 'Ethanol',
    cas: '64-19-7',
    purchased: '2021-10-05',
    expires: '2024-10-05',
    location: 'Shelf #5',
    schoolName: 'Encina High School',
    quantity: 100,
    isExpired: true,
  },
  {
    id: 4,
    name: 'Ammonium Hydroxide',
    cas: '64-19-7',
    purchased: '2022-03-05',
    expires: '2025-03-05',
    location: 'Shelf #5',
    schoolName: 'Riverdale Academy',
    quantity: 75,
    isExpired: false,
  },
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  headerHighlight: {
    color: '#4285F4',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 0,
    backgroundColor: '#4285F4',
    padding: 8,
    borderRadius: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sortButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  chemicalsList: {
    marginTop: 16,
  },
  chemicalItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chemicalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chemicalCAS: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  expiredText: {
    color: 'red',
  },
});

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

const stylesSort = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 15, // Rounded corners
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#888',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4285F4',
    textAlign: 'center',
  },
  dropdownContainer: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD', // Highlighted option background
  },
  orderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  orderButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Default background
  },
  activeOrderButton: {
    backgroundColor: '#4285F4', // Active button background
  },
  orderButtonText: {
    fontSize: 16,
    color: '#4285F4', // Default text color
  },
  activeOrderButtonText: {
    color: 'white', // Active button text color
  },
});
// Styles for the modal and accordion
const stylesFilter = StyleSheet.create({
  modalView: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    elevation: 20,
    marginTop: 'auto',
  },
  modalContent: {
    padding: 20,
    backgroundColor: "#f0f0f0", // Example color
    borderRadius: 10,
    alignItems: "center",
  },

  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionHeader: {
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  accordionContent: {
    padding: 10,
  },
  accordionItem: {
    padding: 8,
    backgroundColor: '#fff',
    marginVertical: 2,
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
});
const stylesSDS = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginVertical: 8,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  downloadButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4285F4',
    borderRadius: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
  },
});