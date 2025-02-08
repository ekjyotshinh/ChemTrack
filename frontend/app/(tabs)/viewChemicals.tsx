import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import CustomButton from '@/components/CustomButton';
import Accordion from 'react-native-collapsible/Accordion'; // Add Accordion component
import Colors from '@/constants/Colors';
import { useIsFocused } from '@react-navigation/native';
import ChemicalDetails from '@/components/viewChemicalModals/ChemicalDetails';
import Header from '@/components/Header';
import Size from '@/constants/Size';
import SearchIcon from '@/assets/icons/SearchIcon';
import FilterIcon from '@/assets/icons/FilterIcon';
import SortIcon from '@/assets/icons/SortIcon';

export default function ViewChemicals() {

  // Define the type for the chemical data
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


  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false); // Added for Sort By Modal
  const [sortOption, setSortOption] = useState('Chemical Name'); // Added for sorting logic
  const [sortOrder, setSortOrder] = useState('Ascending'); // Added for sorting logic
  const [filtersVisible, setFiltersVisible] = useState(false); // State for controlling filter modal
  const [expanded, setExpanded] = useState<number[]>([]);
  const [chemicalsData, setChemicalsData] = useState([]);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const router = useRouter();

  const openModal = (chemical: Chemical) => {
    setSelectedChemical(chemical); // Set the selected chemical
    setModalVisible(true); // Open the modal
  };
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
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const fetchChemicals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/chemicals/`);

      if (!response.ok) {
        throw new Error('Failed to fetch chemicals');
      }
      const data = await response.json();
      setChemicalsData(data);
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  };
  const isFocused = useIsFocused();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (isFocused && !hasFetched.current) {
      fetchChemicals(); // Fetch only if it hasn't been fetched before
      hasFetched.current = true; // Mark as fetched
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) {
      hasFetched.current = false; // Reset when leaving the screen
    }
  }, [isFocused]);

  const filterSections = [
    { title: 'Status', data: ['On-site', 'Expired', 'In Transit'] },
    { title: 'Expiration Date', data: ['Before 2025', '2025-2030', 'After 2030'] },
    { title: 'Quantity', data: ['Low', 'Medium', 'High'] },
    { title: 'Location', data: ['Room', 'Cabinet', 'Shelf'] },
  ];

  return (
    <View style={styles.container}>
      <Header headerText='View Chemicals' />

      <View style={{ width: '100%', marginTop: Size.height(117), paddingHorizontal: Size.width(33) }}>
        {/* Search Button */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Chemical name..." placeholderTextColor={Colors.previewText} />
          <TouchableOpacity style={styles.searchButton}>
            <SearchIcon />
          </TouchableOpacity>
        </View>

        {/* Filter Button */}
        <View style={styles.filterSortContainer}>

          <CustomButton 
            title={'Filter By'}
            onPress={openFilterModal}
            width={165}
            icon={<FilterIcon width={24} height={24} color={Colors.white} />}
            iconPosition='right'
            isSpaceBetween={true}
          />

          <CustomButton 
            title={'Sort By'}
            onPress={openSortModal}
            width={165}
            icon={<SortIcon width={24} height={24} color={Colors.white} />}
            iconPosition='right'
            isSpaceBetween={true}
          />

        </View>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>

          {/* Chemicals List */}

          {chemicalsData.map((chemical: Chemical, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chemicalItem}
              onPress={() => openModal(chemical)} // Pass the selected chemical to openModal
            >
              <Text style={styles.chemicalName}>{chemical.name}</Text>
              <Text style={styles.chemicalCAS}>CAS: {chemical.CAS || 'N/A'}</Text>
              <Text>Purchased: {chemical.purchase_date || 'Unknown'}</Text>
              <Text>Expires: {chemical.expiration_date || 'Unknown'}</Text>
              <Text>School: {chemical.school || 'Unknown'}</Text>
            </TouchableOpacity>
          ))}

          {/* Modals need to be inside to scrollview to avoid Android issues */}

          {/* Popup Modal for chemical details */}
          <ChemicalDetails
            selectedChemical={selectedChemical}
            toggleSDSBottomSheet={toggleSDSBottomSheet}
            modalVisible={modalVisible}
            closeModal={() => setModalVisible(false)}
          />

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
                    width={165} // Adjust width as needed
                    icon={<AscendingSortIcon width={18} height={18} color={sortOrder === 'Ascending' ? Colors.white : Colors.black} />}
                    iconPosition="right"
                    isSpaceBetween={true}
                  />
                  <CustomButton
                    title={sortOption === 'Chemical Name' || sortOption === 'School Name' || sortOption === 'Quantity' ? "Descending" : "Old -> New"}
                    color={sortOrder === 'Descending' ? Colors.blue : Colors.white}
                    textColor={sortOrder === 'Descending' ? Colors.white : Colors.black}
                    onPress={() => setSortOrder('Descending')}
                    width={165} // Adjust width as needed
                    icon={<DescendingSortIcon width={18} height={18} color={sortOrder === 'Descending' ? Colors.white : Colors.black} />}
                    iconPosition="right"
                    isSpaceBetween={true}
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



        </View>
      </ScrollView>
      {/* View SDS Bottom Sheet component */}
      <BottomSheet
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
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.offwhite,
  },
  scroll: {
    width: '100%',
  },
  innerContainer: {
    marginHorizontal: Size.width(33),
  },
  searchContainer: {
    marginTop: Size.height(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: Size.height(45),
    backgroundColor: Colors.white,
    borderColor: Colors.lightgrey,
    borderWidth: 1,
    borderRadius: 0,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    paddingRight: 10,
    paddingLeft: 22,
    color: Colors.previewText,
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: Size.width(52),
    marginLeft: 0,
    backgroundColor: Colors.blue,
    padding: 8,
    height: Size.height(45),
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Size.height(10),
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