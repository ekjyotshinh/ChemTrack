import React, { useEffect, useState, useRef } from 'react';
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
import { useIsFocused } from '@react-navigation/native';


// ======================================================================
// Interface Definitions
// ======================================================================

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
  status?: string;  // Add optional modifier
  quantity?: string;
}

// ======================================================================
// Main Component
// ======================================================================

export default function ViewChemicals() {
  // ====================================================================
  // State Management
  // ====================================================================

  // UI State
  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isSDSBottomSheetOpen, setIsSDSBottomSheetOpen] = useState(false);

  // Data State
  const [chemicalsData, setChemicalsData] = useState<Chemical[]>([]);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  
  // Filter/Sort State
  const [sortOption, setSortOption] = useState('Chemical Name');
  const [sortOrder, setSortOrder] = useState('Ascending');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // References
  const router = useRouter();
  const hasFetched = useRef(false);
  const isFocused = useIsFocused();
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;

  // ====================================================================
  // Constants & Configuration
  // ====================================================================

  const filterOptions = [
    { category: 'Status', options: ['On-site', 'Off-site', 'In Transit'] },
    { category: 'Quantity', options: ['Good', 'Fair', 'Low'] },
    { category: 'Location', options: ['Room', 'Cabinet', 'Shelf'] },
    { category: 'Expired Date', options: ['Before 2025', '2025-2030', 'After 2030'] },
    { category: 'Purchase Date', options: ['Before 2020', '2020-2024', 'After 2024'] }
  ];

  const searchIconSvg = `<svg ... />`; // Keep your existing SVG string

  // ====================================================================
  // Data Handling & API Calls
  // ====================================================================

  const fetchChemicals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/chemicals`);
      if (!response.ok) throw new Error('Failed to fetch chemicals');
      const data = await response.json();
      setChemicalsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFocused && !hasFetched.current) {
      fetchChemicals();
      hasFetched.current = true;
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) hasFetched.current = false;
  }, [isFocused]);

  // ====================================================================
  // Filtering Logic
  // ====================================================================

  const filteredChemicals = chemicalsData.filter((chemical) => {
    // Group selected filters by their category
    const filtersByCategory = selectedFilters.reduce((acc, filter) => {
      const category = filterOptions.find(opt => opt.options.includes(filter))?.category;
      if (category) {
        acc[category] = acc[category] || [];
        acc[category].push(filter);
      }
      return acc;
    }, {} as Record<string, string[]>);
  
    // Check if chemical matches all active categories
    return Object.entries(filtersByCategory).every(([category, filters]) => {
      // Check if any filter in the category matches (OR logic within category)
      return filters.some(filter => {
        switch (category) {
          case 'Status':
            return chemical.status?.toLowerCase() === filter.toLowerCase();
          
          case 'Quantity':
            return chemical.quantity?.toLowerCase() === filter.toLowerCase();
          
          case 'Location':
            // Search across all location fields
            return ['room', 'cabinet', 'shelf'].some(field =>
              chemical[field as keyof Chemical]?.toString().toLowerCase().includes(filter.toLowerCase())
            );
  
          case 'Expired Date': {
            if (!chemical.expiration_date) return false;
            const expDate = new Date(chemical.expiration_date);
            if (isNaN(expDate.getTime())) return false; // Handle invalid dates
            
            const year = expDate.getFullYear();
            switch (filter) {
              case 'Before 2025': return year < 2025;
              case '2025-2030': return year >= 2025 && year <= 2030;
              case 'After 2030': return year > 2030;
              default: return true;
            }
          }

          case 'Purchase Date': {
            if (!chemical.purchase_date) return false;
            const purchaseDate = new Date(chemical.purchase_date);
            if (isNaN(purchaseDate.getTime())) return false;
            const year = purchaseDate.getFullYear();
            return (
              (filter === 'Before 2020' && year < 2020) ||
              (filter === '2020-2024' && year >= 2020 && year <= 2024) ||
              (filter === 'After 2024' && year > 2024)
            );
          }
  
          default:
            return true;
        }
      });
    }) && 
    // Global search filter
    (chemical.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     chemical.CAS.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  

  // ====================================================================
  // Modal Handlers
  // ====================================================================

  const openModal = (chemical: Chemical) => {
    setSelectedChemical(chemical);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);
  const toggleSDSBottomSheet = () => setIsSDSBottomSheetOpen(!isSDSBottomSheetOpen);

  // ====================================================================
  // Render Components
  // ====================================================================

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Text style={styles.headerText}>
        View <Text style={styles.headerHighlight}>Chemicals</Text>
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Chemical name..." />
        <TouchableOpacity style={styles.searchButton}>
          <SvgXml xml={searchIconSvg} width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Filter/Sort Controls */}
      <View style={styles.filterSortContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFiltersVisible(true)}>
          <Text style={styles.buttonText}>Filter By</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortModalVisible(true)}>
          <Text style={styles.buttonText}>Sort By</Text>
        </TouchableOpacity>
      </View>

      {/* Chemicals List */}
      <ScrollView style={styles.chemicalsList}>
        {filteredChemicals.map((chemical, index) => (
          <ChemicalListItem 
            key={index}
            chemical={chemical}
            onPress={() => openModal(chemical)}
          />
        ))}

        {/* Chemical Details Modal */}
        <ChemicalDetailsModal
          visible={modalVisible}
          onClose={closeModal}
          chemical={selectedChemical}
          toggleSDS={toggleSDSBottomSheet}
        />

        {/* Sort Modal */}
        <SortModal
          visible={sortModalVisible}
          onClose={() => setSortModalVisible(false)}
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        {/* Filter Modal */}
        <FilterModal
          visible={filtersVisible}
          onClose={() => setFiltersVisible(false)}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          filterOptions={filterOptions}
        />
      </ScrollView>

      {/* SDS Bottom Sheet */}
      <SDSBottomSheet
        isOpen={isSDSBottomSheetOpen}
        onClose={() => setIsSDSBottomSheetOpen(false)}
      />
    </View>
  );
}

// ======================================================================
// Sub-Components
// ======================================================================

const ChemicalListItem = ({ chemical, onPress }: { chemical: Chemical, onPress: () => void }) => (
  <TouchableOpacity style={styles.chemicalItem} onPress={onPress}>
    <Text style={styles.chemicalName}>{chemical.name}</Text>
    <Text style={styles.chemicalCAS}>CAS: {chemical.CAS || 'N/A'}</Text>
    <Text>Purchased: {chemical.purchase_date || 'Unknown'}</Text>
    <Text>Expires: {chemical.expiration_date || 'Unknown'}</Text>
    <Text>School: {chemical.school || 'Unknown'}</Text>
  </TouchableOpacity>
);

// Chemical Details Modal
const ChemicalDetailsModal = ({ 
  visible, 
  onClose, 
  chemical,
  toggleSDS
}: {
  visible: boolean;
  onClose: () => void;
  chemical: Chemical | null;
  toggleSDS: () => void;
}) => {
  if (!chemical) return null; // Prevent rendering if no chemical is selected

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <BlurView intensity={50} style={stylesPopup.blurContainer}>
        <View style={stylesPopup.modalView}>
          <TouchableOpacity style={stylesPopup.closeButton} onPress={onClose}>
            <Text style={stylesPopup.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={stylesPopup.modalContent}>
            {/* Chemical Details */}
            <Text style={stylesPopup.chemicalName}>{chemical.name}</Text>
            <Text style={stylesPopup.chemicalId}>ID: {chemical.id || 'Unknown'}</Text>
            <Text style={stylesPopup.chemicalCAS}>CAS: {chemical.CAS || 'N/A'}</Text>

            {/* QR Code Placeholder */}
            <View style={stylesPopup.qrCodePlaceholder}>
              <Text style={stylesPopup.qrCodeText}>QR Code</Text>
            </View>

            {/* Additional Chemical Details */}
            <Text>Purchase Date: {chemical.purchase_date || 'Unknown'}</Text>
            <Text>Expiration Date: {chemical.expiration_date || 'Unknown'}</Text>
            <Text>School: {chemical.school || 'Unknown'}</Text>
            <Text>Room: {chemical.room || 'Unknown'}</Text>
            <Text>Cabinet: {chemical.cabinet || 'Unknown'}</Text>
            <Text>Shelf: {chemical.shelf || 'Unknown'}</Text>

            <Text>Status: <Text style={stylesPopup.onSiteStatus}>On-site</Text></Text>
            <Text>Quantity: <Text style={stylesPopup.quantityGood}>Good</Text></Text>

            {/* Action Buttons */}
            <TouchableOpacity style={stylesPopup.actionButton}>
              <Text style={stylesPopup.actionButtonText}>Print QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesPopup.actionButton} onPress={toggleSDS}>
              <Text style={stylesPopup.actionButtonText}>View SDS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesPopup.editButton}>
              <Text style={stylesPopup.editButtonText}>Edit Information</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};


const SortModal = ({ 
  visible, 
  onClose, 
  sortOption, 
  setSortOption, 
  sortOrder, 
  setSortOrder 
}: {
  visible: boolean;
  onClose: () => void;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={stylesSort.modalContainer}>
        <View style={stylesSort.modalView}>
          <TouchableOpacity onPress={onClose} style={stylesSort.closeButton}>
            <Text style={stylesSort.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={stylesSort.modalHeader}>Sort Options</Text>

          {/* Sorting Options */}
          <View style={stylesSort.dropdownContainer}>
            {['Chemical Name', 'Purchase Date', 'Expiration Date', 'School Name', 'Quantity', 'Recent'].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSortOption(option)}
                style={[
                  stylesSort.option,
                  sortOption === option && stylesSort.selectedOption
                ]}
              >
                <Text style={stylesSort.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sorting Order Buttons */}
          <View style={stylesSort.orderButtons}>
            <CustomButton
              title={['Chemical Name', 'School Name', 'Quantity'].includes(sortOption) ? "Ascending" : "New -> Old"}
              color={sortOrder === 'Ascending' ? Colors.blue : Colors.white}
              textColor={sortOrder === 'Ascending' ? Colors.white : Colors.black}
              onPress={() => setSortOrder('Ascending')}
              width={180}
              icon={<AscendingSortIcon width={24} height={24} color={sortOrder === 'Ascending' ? Colors.white : Colors.black} />}
              iconPosition="right"
            />
            <CustomButton
              title={['Chemical Name', 'School Name', 'Quantity'].includes(sortOption) ? "Descending" : "Old -> New"}
              color={sortOrder === 'Descending' ? Colors.blue : Colors.white}
              textColor={sortOrder === 'Descending' ? Colors.white : Colors.black}
              onPress={() => setSortOrder('Descending')}
              width={180}
              icon={<DescendingSortIcon width={24} height={24} color={sortOrder === 'Descending' ? Colors.white : Colors.black} />}
              iconPosition="right"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// filter model 
const FilterModal = ({ 
  visible, 
  onClose, 
  selectedFilters, 
  setSelectedFilters, 
  filterOptions 
}: {
  visible: boolean;
  onClose: () => void;
  selectedFilters: string[];
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  filterOptions: Array<{ category: string; options: string[] }>;
}) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={stylesFilter.modalContainer}>
        <View style={stylesFilter.modalView}>
          <TouchableOpacity onPress={onClose} style={stylesFilter.closeButton}>
            <Text style={stylesFilter.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={stylesFilter.modalHeader}>Filter Options</Text>

          {/* Scrollable Filter Options */}
          <ScrollView style={stylesFilter.scrollContainer}>
            {filterOptions.map((section, sectionIndex) => (
              <View key={`section-${sectionIndex}`} style={stylesFilter.sectionContainer}>
                <Text style={stylesFilter.sectionHeader}>{section.category}</Text>
                <View style={stylesFilter.buttonGrid}>
                  {section.options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        stylesFilter.filterButton,
                        selectedFilters.includes(option) && stylesFilter.selectedFilterButton,
                      ]}
                      onPress={() => {
                        setSelectedFilters(prevFilters => {
                          // Allow only one filter per category
                          const updatedFilters = prevFilters.filter(f => 
                            !section.options.includes(f)
                          );
                          return [...updatedFilters, option];
                        });
                      }}
                    >
                      <Text
                        style={[
                          stylesFilter.filterButtonText,
                          selectedFilters.includes(option) && stylesFilter.selectedFilterButtonText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Apply & Reset Buttons */}
          <View style={stylesFilter.buttonContainer}>
            <CustomButton
              title="Apply"
              color={Colors.blue}
              textColor={Colors.white}
              onPress={onClose}
              width={100}
            />
            <CustomButton
              title="Reset"
              color={Colors.white}
              textColor={Colors.black}
              onPress={() => setSelectedFilters([])}
              width={100}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// SDSBottomSheet Component
const SDSBottomSheet = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <BottomSheet
    index={isOpen ? 0 : -1}
    snapPoints={['30%', '50%']}
    backgroundStyle={stylesSDS.bottomSheetBackground}
    handleIndicatorStyle={stylesSDS.handleIndicator}
    onClose={onClose}
  >
    <View style={stylesSDS.container}>
      <Text style={stylesSDS.headerText}>SDS</Text>
      <TouchableOpacity style={stylesSDS.downloadButton}>
        <Text style={stylesSDS.downloadButtonText}>Download</Text>
      </TouchableOpacity>
    </View>
  </BottomSheet>
);


// ======================================================================
// Style Sheets 
// ======================================================================

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Same dim background as sorting modal
  },
  modalView: {
    backgroundColor: 'white', // White outside border
    borderRadius: 15, // Rounded corners
    padding: 20,
    width: '100%', // Compact modal width
    maxHeight: '50%', // Limited height for a better fit
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
    fontSize: 20, // Slightly smaller
    fontWeight: 'bold',
    color: '#888',
  },
  modalHeader: {
    fontSize: 22, // Reduced font size for better fit
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  scrollContainer: {
    width: '100%',
    maxHeight: '100%', // Allows scrolling for long lists
  },
  sectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#F3F4F6', // Gray background inside
    borderRadius: 10,
    padding: 8,
    elevation: 3, // Light shadow effect
  },
  sectionHeader: {
    fontSize: 17, // Smaller header font
    fontWeight: '700', // Keep section titles bold
    color: '#4285F4',
    marginBottom: 5,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15, // Adjusted for compact spacing
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  filterButton: {
    width: 100, // Increased width for better spacing
    paddingVertical: 12,
    backgroundColor: 'transparent', // Remove background color
    borderWidth: 1, // Add subtle border
    borderColor: '#ccc', // Light gray border to keep visible
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  selectedFilterButton: {
    backgroundColor: '#4285F4', // Blue background when selected
    borderColor: '#4285F4', // Blue border when selected
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'normal', // Ensures text remains unbolded
    color: '#333', // Default text color
  },
  selectedFilterButtonText: {
    color: 'white', // White text when selected
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
  }
});

