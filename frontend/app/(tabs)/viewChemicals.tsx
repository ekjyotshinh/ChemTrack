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
import processCAS from '@/functions/ProcessCAS';
import TextInter from '@/components/TextInter';
import ChevronRight from '@/assets/icons/ChevronRightIcon';

// Is the chemical expired?
const isExpired = (expirationDate: string) => {
  if (!expirationDate) return false
  const today = new Date()
  const expiration = new Date(expirationDate)
  return expiration < today
}

// Add elipsis to long chemical names >= 30 characters
const processChemName = ({name} : {name: string}) => {
  name = name.toString()
  if (name.length <= 30) {
    return name
  }
  return name.substring(0, 27) + '...'
}

interface ChemDateSchoolProps {
  purchaseDate?: string
  expireDate?: string
  school?: string
  isExpired?: boolean
}

// Right side of the chemical item
// includes purchase date, expiration date, and school name
const ChemDateSchool = ({ purchaseDate, expireDate, school, isExpired = false }: ChemDateSchoolProps) => {
  return (
    <View style={{ marginRight: 5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInter style={styles.btnText}>Purchased: </TextInter>
        <TextInter style={styles.btnText}>{purchaseDate || 'Unknown'}</TextInter>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInter style={styles.btnText}>Expires: </TextInter>
        <TextInter style={[styles.btnText, { color: isExpired ? Colors.red : Colors.black }]}>
          {expireDate || 'Unknown'}
        </TextInter>
      </View>

      <TextInter style={{ fontSize: 12.5 }}>{school || 'Unknown'}</TextInter>
    </View>
  )
}

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
    status: string; // Added
    quantity: string; // Added
    location: string; // Added
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
  const [selectedSort, setSelectedSort] = useState("Newest first (by date)"); // Default sorting option
  const [sortedChemicals, setSortedChemicals] = useState<Chemical[]>([]);

  //Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChemicals, setFilteredChemicals] = useState<Chemical[]>([]);

  // Add state variables for selected filter options
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedPurchaseDate, setSelectedPurchaseDate] = useState<string[]>([]);
  const [selectedExpirationDate, setSelectedExpirationDate] = useState<string[]>([]);

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
      const response = await fetch(`${API_URL}/api/v1/chemicals`);

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

  //type-safe helper function
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase();
  };

  // Helper function for date validation
  const isValidDate = (dateString: string) => !isNaN(Date.parse(dateString));


// Filter logic
useEffect(() => {
  if (!chemicalsData) return;

  const searchLower = searchQuery.toLowerCase().trim();

  const filtered = chemicalsData.filter((chemical: Chemical) => {
    // 1. Enhanced Search Filter
    const searchMatches = [
      chemical.name,
      chemical.CAS,
      chemical.school,
      `${chemical.room} ${chemical.cabinet} ${chemical.shelf}`
    ].some(field => {
      const cleanField = safeString(field).replace(/[^a-z0-9]/g, '');
      const cleanSearch = searchLower.replace(/[^a-z0-9]/g, '');
      return cleanField.includes(cleanSearch);
    });

    // 2. Status Filter with Priority
    const statusMatches = selectedStatus.length === 0 || 
      selectedStatus.includes(chemical.status);

    // 3. Quantity Filter (case-insensitive exact match)
    const quantityMatches = selectedQuantity.length === 0 || 
      selectedQuantity.some(q => 
        safeString(chemical.quantity) === safeString(q)
      );

    // 4. Location Filter (dynamic property access)
    const locationMatches = selectedLocation.length === 0 || 
      selectedLocation.some(locationType => {
        const value = safeString(chemical[locationType.toLowerCase() as keyof Chemical]);
        return value.trim() !== '';
      });

    // 5. Date Handling with Validation
    const purchaseDate = isValidDate(chemical.purchase_date) ? 
      new Date(chemical.purchase_date) : null;
    const expirationDate = isValidDate(chemical.expiration_date) ? 
      new Date(chemical.expiration_date) : null;

    // Date Filter Logic
    const purchaseDateMatches = selectedPurchaseDate.length === 0 || (
      (selectedPurchaseDate.includes('Before 2020') && purchaseDate && purchaseDate < new Date('2020-01-01')) ||
      (selectedPurchaseDate.includes('2020-2024') && purchaseDate && 
        purchaseDate >= new Date('2020-01-01') && 
        purchaseDate <= new Date('2024-12-31')) ||
      (selectedPurchaseDate.includes('After 2024') && purchaseDate && purchaseDate > new Date('2024-12-31'))
    );

    const expirationDateMatches = selectedExpirationDate.length === 0 || (
      (selectedExpirationDate.includes('Before 2025') && expirationDate && expirationDate < new Date('2025-01-01')) ||
      (selectedExpirationDate.includes('2025-2030') && expirationDate && 
        expirationDate >= new Date('2025-01-01') && 
        expirationDate <= new Date('2030-12-31')) ||
      (selectedExpirationDate.includes('After 2030') && expirationDate && expirationDate > new Date('2030-12-31'))
    );

    return searchMatches && 
           statusMatches && 
           quantityMatches && 
           locationMatches && 
           purchaseDateMatches && 
           expirationDateMatches;
  });

  setFilteredChemicals(filtered);
}, [searchQuery, chemicalsData, selectedStatus, selectedQuantity, 
   selectedLocation, selectedPurchaseDate, selectedExpirationDate]);

  useEffect(() => {
    if (!isFocused) {
      hasFetched.current = false; // Reset when leaving the screen
    }
  }, [isFocused]);

  const filterSections = [
    { title: 'Status', data: ['On-site', 'Off-site'] },
    { title: 'Quantity', data: ['Low', 'Fair', 'Good'] },
    { title: 'Location', data: ['Room', 'Cabinet', 'Shelf'] },
    { title: 'Purchase Date', data: ['Before 2020', '2020-2024', 'After 2024'] }, // Added Purchase Date filter
    { title: 'Expiration Date', data: ['Before 2025', '2025-2030', 'After 2030'] },
  ];

  const [sortVisible, setSortVisible] = useState(false);
  const sortOptions = [
    "Newest first (by date)",
    "Oldest first (by date)",
    "Highest quantity first",
    "Lowest quantity first",
    "A-Z",
    "Z-A",
    "By expiration",
  ];

  // Sorting function
  const sortChemicals = (option: string) => {
    let sortedList = [...chemicalsData];
  
    switch (option) {
      case "Lowest quantity first":
        sortedList.sort((a, b) => {
          const priority = { Low: 1, Fair: 2, Good: 3 }; // Define order
          return (priority[a['quantity']] || 4) - (priority[b['quantity']] || 4);
        });
        break;

      case "Highest quantity first":
        sortedList.sort((a, b) => {
          const priority = { Good: 1, Fair: 2, Low: 3 }; // Reverse order
          return (priority[a['quantity']] || 4) - (priority[b['quantity']] || 4);
        });
        break;
      case "Newest first (by date)":
        sortedList.sort(
          (a, b) => new Date(b['purchase_date']).getTime() - new Date(a['purchase_date']).getTime()
        );
        break;
      case "Oldest first (by date)":
        sortedList.sort(
          (a, b) => new Date(a['purchase_date']).getTime() - new Date(b['purchase_date']).getTime()
        );
        break;
      case "A-Z":
        sortedList.sort((a, b) => (a['name'] > b['name'] ? 1 : -1));
        break;
      case "Z-A":
        sortedList.sort((a, b) => (a['name'] < b['name'] ? 1 : -1));
        break;
      case "By expiration":
        sortedList.sort(
          (a, b) => new Date(a['expiration_date']).getTime() - new Date(b['expiration_date']).getTime()
        );
        break;
      default:
        break;
    }
    return sortedList; // Return the sorted array instead of modifying state here
  };
  


  // Handle option selection
  const handleSortSelection = (option: string) => {
    setSelectedSort(option); // Move checkmark
    sortChemicals(option); // Sort list dynamically
    setSortVisible(false); 
  };

  useEffect(() => {
    if (chemicalsData.length > 0) {
      let sortedList = sortChemicals(selectedSort); // Get sorted array
  
      setSortedChemicals(sortedList); // Update sorted list state
      setFilteredChemicals(sortedList); // Ensure displayed list is sorted
    }
  }, [chemicalsData, selectedSort]); // Trigger sorting when data or selection changes
  
  return (
    <View style={styles.container}>
      <Header headerText='View Chemicals' />

      {/* Sticky container for search bar, filter and sort options */}
      <View style={styles.modifyChemicalList}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Chemical name, CAS, or school..." 
          placeholderTextColor={Colors.previewText}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
          <TouchableOpacity style={styles.searchButton}>
            <SearchIcon />
          </TouchableOpacity>
        </View>

        {/* Container for filter and sort buttons */}
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
            onPress={() => setSortVisible(!sortVisible)}
            width={165}
            icon={<SortIcon width={24} height={24} color={Colors.white} />}
            iconPosition='right'
            isSpaceBetween={true}
          />

        </View>
      </View>


      {/* Sort Dropdown needs to situated here. Otherwise it hides behind the Chemicals List */}
      {sortVisible && (
        <View style={stylesSort.dropdown}>
          {sortOptions.map((option, index) => (
            <TouchableOpacity key={index} style={stylesSort.option} onPress={() => handleSortSelection(option)}>
              <Text>{selectedSort === option ? "✓ " : ""} {option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Scrollable area */}
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>

          {/* Chemicals List */}
          {filteredChemicals.length > 0 ? (
            filteredChemicals.map((chemical: Chemical, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chemicalItem}
                onPress={() => openModal(chemical)}
              >
                <View style={styles.btnContainer}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <TextInter style={styles.chemicalName}>
                      {processChemName({name: chemical.name || 'Unknown'})}
                    </TextInter>
                    
                    <TextInter style={styles.chemicalCAS}>
                      <TextInter style={{ fontWeight: 'bold' }}>CAS: </TextInter>
                      {processCAS(chemical.CAS) || 'N/A'}
                    </TextInter>
                  </View>
                  <ChemDateSchool
                    purchaseDate={chemical.purchase_date}
                    expireDate={chemical.expiration_date}
                    school={chemical.school}
                    isExpired={isExpired(chemical.expiration_date)}
                  />
                  <ChevronRight />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              {searchQuery ? (
                <TextInter style={styles.noResultsText}>
                  No chemicals found matching "{searchQuery}"
                </TextInter>
              ) : (
                <TextInter style={styles.noResultsText}>
                  No chemicals available
                </TextInter>
              )}
            </View>
          )}

          {/* Modals need to be inside to scrollview to avoid Android issues */}

          {/* Popup Modal for chemical details */}
          <ChemicalDetails
            selectedChemical={selectedChemical}
            toggleSDSBottomSheet={toggleSDSBottomSheet}
            modalVisible={modalVisible}
            closeModal={() => setModalVisible(false)}
            router={router}
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
                        {section.data.map((item, index) => {
                          const isSelected = (() => {
                            switch (section.title) {
                              case 'Status':
                                return selectedStatus.includes(item);
                              case 'Quantity':
                                return selectedQuantity.includes(item);
                              case 'Location':
                                return selectedLocation.includes(item);
                              case 'Purchase Date':
                                return selectedPurchaseDate.includes(item);
                              case 'Expiration Date':
                                return selectedExpirationDate.includes(item);
                              default:
                                return false;
                            }
                          })();
                          return (
                            <TouchableOpacity
                              key={index}
                              style={[
                                stylesFilter.accordionItem,
                                isSelected && stylesFilter.selectedAccordionItem,
                              ]}
                              onPress={() => {
                                switch (section.title) {
                                  case 'Status':
                                    setSelectedStatus(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                                    break;
                                  case 'Quantity':
                                    setSelectedQuantity(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                                    break;
                                  case 'Location':
                                    setSelectedLocation(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                                    break;
                                  case 'Purchase Date':
                                    setSelectedPurchaseDate(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                                    break;
                                  case 'Expiration Date':
                                    setSelectedExpirationDate(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                                    break;
                                  default:
                                    break;
                                }
                              }}
                            >
                              <Text style={[
                                stylesFilter.accordionItemText,
                                isSelected && stylesFilter.selectedAccordionItemText,
                              ]}>{item}</Text>
                            </TouchableOpacity>
                          );
                        })}
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
    marginHorizontal: Size.width(14),
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
    fontFamily: 'Inter_400Regular',
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: Size.width(52),
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
  chemicalItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  chemicalName: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chemicalCAS: {
    fontSize: 14,
  },
  expiredText: {
    color: Colors.red,
  },
  btnContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnText: {
    fontSize: 12.5,
  },
  modifyChemicalList: {
    width: '100%',
    marginTop: Size.height(110),
    paddingHorizontal: Size.width(33),
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.previewText,
    textAlign: 'center',
  },

});

const stylesSort = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 255,
    right: 32,
    width: 220,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 99999,
    elevation: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#f1f1f1", // Highlight selected option
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
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
  /*
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
  },*/
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
    padding: 30,
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
  selectedAccordionItem: {
    backgroundColor: Colors.blue, // Blue color for selected items
  },
  accordionItemText: {
    color: Colors.black,
  },
  selectedAccordionItemText: {
    color: Colors.white, // White text for selected items
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