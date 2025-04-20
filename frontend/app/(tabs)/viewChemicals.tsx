import { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Keyboard, Alert } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import CustomButton from '@/components/CustomButton';
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
import { useUser } from '@/contexts/UserContext';

// Is the chemical expired?
const isExpired = (expirationDate: string) => {
  if (!expirationDate) return false
  const today = new Date()
  const expiration = new Date(expirationDate)
  return expiration < today
}

// Add elipsis to long chemical names >= 30 characters
const processChemName = ({ name }: { name: string }) => {
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
    status: string;
    quantity: string;
    location: string;
    sdsURL: string;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false); // Added for Sort By Modal
  const [sortOption, setSortOption] = useState('Chemical Name'); // Added for sorting logic
  const [sortOrder, setSortOrder] = useState('Ascending'); // Added for sorting logic
  const [filtersVisible, setFiltersVisible] = useState(false); // State for controlling filter modal
  const [chemicalsData, setChemicalsData] = useState([]);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState("Newest first (by date)"); // Default sorting option

  // Add these above your component return statement
  const getIsSelected = (sectionTitle: string, option: string) => {
    switch (sectionTitle) {
      case 'Status': return selectedStatus.includes(option);
      case 'Purchase Date': return selectedPurchaseDate.includes(option);
      case 'Expiration Date': return selectedExpirationDate.includes(option);
      default: return false;
    }
  };

  const handleFilterSelect = (sectionTitle: string, option: string) => {
    switch (sectionTitle) {
      case 'Status':
        setSelectedStatus(prev =>
          prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
        );
        break;
      case 'Purchase Date':
        setSelectedPurchaseDate(prev =>
          prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
        );
        break;
      case 'Expiration Date':
        setSelectedExpirationDate(prev =>
          prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
        );
        break;
    }
  };

  const handleResetFilters = () => {
    setSelectedStatus([]);
    setSelectedPurchaseDate([]);
    setSelectedExpirationDate([]);
  };

  //Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false); // New state to track search status

  // Add state variables for selected filter options
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPurchaseDate, setSelectedPurchaseDate] = useState<string[]>([]);
  const [selectedExpirationDate, setSelectedExpirationDate] = useState<string[]>([]);

  // Function to handle search button click
  const handleSearch = () => {
    // Hide keyboard
    Keyboard.dismiss();

    // Set searching status to true to indicate search is being performed
    setIsSearching(true);

    // The actual filtering is already handled by the useEffect below
    // This function mainly focuses on UI feedback (hiding keyboard, etc.)

    console.log("Search performed for:", searchQuery);
  };

  const openModal = (chemical: Chemical) => {
    setSelectedChemical(chemical); // Set the selected chemical
    setModalVisible(true); // Open the modal
  };
 
  const closeSortModal = () => setSortModalVisible(false);
  const openFilterModal = () => setFiltersVisible(true);
  const closeFilterModal = () => setFiltersVisible(false);

  const [isSDSBottomSheetOpen, setIsSDSBottomSheetOpen] = useState(false);
  const toggleSDSBottomSheet = () => {
    setIsSDSBottomSheetOpen(!isSDSBottomSheetOpen);
    viewPdf();
  };

  // Function to view safety data sheet (SDS) in web browser
  const viewPdf = async () => {
    console.log("Click registered for View Pdf");

    try {
      // GET API for SDS
      if (!selectedChemical) {
        return;
      }
      const response = await fetch(`${API_URL}/api/v1/files/sds/${selectedChemical.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      const responseData = await response.json();
      // If API successful, show pdf
      if (response.ok) {
        // Handle successful response
        console.log('Chemical SDS found:', responseData);
        console.log('SDS URL: ', responseData.sdsURL);
        router.push({
          pathname: '/fileViewer',
          params: responseData.sdsURL
        });
      } else {
        // Handle server errors
        console.log('Failed to get SDS:', responseData);
        Alert.alert('Error', 'Error occured');
      }
    }
    // For other errors besides responses
    catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error occured');
    };

  };

  const { userInfo } = useUser();
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const fetchChemicals = async () => {
    if (!userInfo) return;
    try {
      // Only master users can fetch all chemicals
      // Otherwise, only get chemicals for the user's school
      const endpoint = userInfo.is_master ? `${API_URL}/api/v1/chemicals` :
        `${API_URL}/api/v1/chemicals?school=${encodeURIComponent(userInfo.school)}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch chemicals');
      }
      const data = await response.json();
      setChemicalsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const isFocused = useIsFocused();
  const hasFetched = useRef(false);

  //type-safe helper function
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase();
  };

  // Helper function for date validation
  const isValidDate = (dateString: string) => !isNaN(Date.parse(dateString));
  
  const filterChemicals = (search : string) => {
    let filteredList = chemicalsData.filter((chemical: Chemical) => {
    // 1. Enhanced Search Filter
    const searchMatches = [
      chemical.name,
      chemical.CAS,
      (userInfo && userInfo.is_master) && chemical.school,
      `${chemical.room} ${chemical.cabinet} ${chemical.shelf}`
    ].some(field => {
      const cleanField = safeString(field).replace(/[^a-z0-9]/g, '');
      const cleanSearch = search.replace(/[^a-z0-9]/g, '');
      return cleanField.includes(cleanSearch);
    });

    // 2. Status Filter with Priority
    const statusMatches = selectedStatus.length === 0 ||
      selectedStatus.includes(chemical.status);

    // 3. Date Handling with Validation
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
      purchaseDateMatches &&
      expirationDateMatches;
  })
    return filteredList;
  }

  const filterSections = [
    { title: 'Status', data: ['Low', 'Fair', 'Good', 'Off-site'] },
    { title: 'Purchase Date', data: ['Before 2020', '2020-2024', 'After 2024'] }, // Added Purchase Date filter
    { title: 'Expiration Date', data: ['Before 2025', '2025-2030', 'After 2030'] },
  ];

  const [sortVisible, setSortVisible] = useState(false);
  const sortOptions = [
    "Newest first (by date)",
    "Oldest first (by date)",
    "Status (High to Low)",
    "Status (Low to High)",
    "Lowest quantity first",
    "A-Z",
    "Z-A",
    "By expiration",
  ];

  // Sorting function
  const sortChemicals = ({option, sortedList} : {option: string, sortedList: []}) => {

    switch (option) {
      case "Status (Low to High)":
        sortedList.sort((a, b) => {
          const priority = { Low: 1, Fair: 2, Good: 3 }; // Define order
          return (priority[a['status']] || 4) - (priority[b['status']] || 4);
        });
        break
      case "Status (High to Low)":
        sortedList.sort((a, b) => {
          const priority = { Good: 1, Fair: 2, Low: 3 }; // Reverse order
          return (priority[a['status']] || 4) - (priority[b['status']] || 4);
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
    setSortVisible(false);
  };

  // Filter/Sort Data Logic
  // We want to filter first, since this based on fetched data
  // Once we have the filtered list, then we sort it
  // Returned list rendered to the user
  // Using useMemo for some potential performance benefits
  const filteredAndSortedData = useMemo(() => {
    let filteredData = filterChemicals(searchQuery);
    setIsSearching(false);
    return sortChemicals({option: selectedSort, sortedList: filteredData as []});
  }, [searchQuery, chemicalsData, selectedStatus,
    selectedPurchaseDate, selectedExpirationDate, selectedSort]);

  // Focus Logic
  useEffect(() => {
    if (isFocused && !hasFetched.current) {
      fetchChemicals(); // Fetch only if it hasn't been fetched before
      hasFetched.current = true; // Mark as fetched
    }
    
    if (!isFocused) {
      hasFetched.current = false; // Reset when leaving the screen
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Header headerText='View Chemicals' />

      {/* Sticky container for search bar, filter and sort options */}
      <View style={styles.modifyChemicalList}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={(userInfo && userInfo.is_master) ?
              "Chemical name, CAS, or school..." : "Chemical name or CAS"}
            placeholderTextColor={Colors.previewText}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text.toLowerCase().trim())}
            onSubmitEditing={handleSearch} // trigger search on submit/enter
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
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
              <TextInter>{selectedSort === option ? "✓ " : ""} {option}</TextInter>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Scrollable area */}
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>

          {/* Chemicals List */}
          {filteredAndSortedData.length > 0 ? (
            filteredAndSortedData.map((chemical: Chemical, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chemicalItem}
                onPress={() => openModal(chemical)}
              >
                <View style={styles.btnContainer}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <TextInter style={styles.chemicalName}>
                      {processChemName({ name: chemical.name || 'Unknown' })}
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
              {isSearching ? (
                <TextInter style={styles.noResultsText}>
                  Searching...
                </TextInter>
              ) : searchQuery ? (
                <TextInter style={styles.noResultsText}>
                  No chemicals found matching "{searchQuery}"
                </TextInter>
              ) : (
                <TextInter style={styles.noResultsText}>
                  No chemicals available for {userInfo.school}
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
                  <TextInter style={stylesSort.closeButtonText}>✕</TextInter>
                </TouchableOpacity>
                <TextInter style={stylesSort.modalHeader}>Sort Options</TextInter>

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
                      <TextInter style={stylesSort.optionText}>{option}</TextInter>
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

          {/* Replace your current Filter Modal with this */}
          <Modal
            animationType="slide"
            transparent
            visible={filtersVisible}
            onRequestClose={closeFilterModal}
          >
            <View style={sharedStyles.modalContainer}>
              <View style={sharedStyles.modalView}>
                {/* Close Button */}
                <TouchableOpacity
                  style={sharedStyles.closeButton}
                  onPress={closeFilterModal}
                >
                  <TextInter style={sharedStyles.closeButtonText}>✕</TextInter>
                </TouchableOpacity>

                {/* Header */}
                <Text style={sharedStyles.modalHeader}>Filter Options</Text>

                {/* Filter Sections */}
                <ScrollView style={sharedStyles.dropdownContainer}>
                  {filterSections.map((section) => (
                    <View key={section.title} style={sharedStyles.section}>
                      <TextInter style={sharedStyles.sectionTitle}>{section.title}</TextInter>

                      {section.data.map((option) => {
                        const isSelected = getIsSelected(section.title, option);

                        return (
                          <TouchableOpacity
                            key={option}
                            style={[
                              sharedStyles.optionItem,
                              isSelected && sharedStyles.selectedOption
                            ]}
                            onPress={() => handleFilterSelect(section.title, option)}
                          >
                            <TextInter style={sharedStyles.optionText}>{option}</TextInter>
                            {isSelected && <Text style={sharedStyles.checkmark}>✓</Text>}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </ScrollView>

                {/* Footer Buttons */}
                <View style={sharedStyles.footer}>
                  <CustomButton
                    title="Reset All"
                    onPress={handleResetFilters}
                    color={Colors.lightgrey}
                    textColor={Colors.black}
                    width={160}
                  />
                  <CustomButton
                    title="Apply Filters"
                    onPress={closeFilterModal}
                    color={Colors.blue}
                    width={160}
                  />
                </View>
              </View>
            </View>
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
          <TextInter style={stylesSDS.headerText}>SDS</TextInter>
          <TouchableOpacity style={stylesSDS.downloadButton}>
            <TextInter style={stylesSDS.downloadButtonText}>Download</TextInter>
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
const sharedStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blue,
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
  },
  selectedOption: {
    backgroundColor: '#f5f5f5',
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
  },
  checkmark: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.grey,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.blue,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
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