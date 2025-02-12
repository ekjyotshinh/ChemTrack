import React, { useEffect, useState, useRef } from 'react';
import { View, ViewStyle, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
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
import { Card, CardContent } from '@/assets/icons/card';
import { Button } from '@/assets/icons/button';
import { ChevronDown } from "lucide-react";
import { CSSProperties } from "react";


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
    quantity: string;
  }
  


  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false); // Added for Sort By Modal
  const [sortOption, setSortOption] = useState('Chemical Name'); // Added for sorting logic
  const [sortOrder, setSortOrder] = useState('Ascending'); // Added for sorting logic
  const [filtersVisible, setFiltersVisible] = useState(false); // State for controlling filter modal
  const [expanded, setExpanded] = useState<number[]>([]);
  const [chemicalsData, setChemicalsData] = useState([]);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [selectedSort, setSelectedSort] = useState("Newest first (by date)"); // Default sorting option
  const [sortedChemicals, setSortedChemicals] = useState<Chemical[]>([]);
  const isFocused = useIsFocused();
  const hasFetched = useRef(false);
  const router = useRouter();

  const openModal = (chemical: Chemical) => {
    setSelectedChemical(chemical); // Set the selected chemical
    setModalVisible(true); // Open the modal
  };
  const closeModal = () => setModalVisible(false);
  const openSortModal = () => setSortModalVisible(true);
  /*const closeSortModal = () => setSortModalVisible(false);*/
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

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setTimeout(() => {
      // Force re-render if needed
    }, 0);
  };



  const [sortVisible, setSortVisible] = useState(false);

  const toggleSortModal = () => setSortVisible(!sortVisible);
  const closeSortModal = () => setSortVisible(false);

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
        sortedList.sort((a, b) => (a['quantity'] === "Low" ? -1 : 1));
        break;
      case "Highest quantity first":
        sortedList.sort((a, b) => (a['quantity'] === "Good" ? -1 : 1));
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

    setSortedChemicals(sortedList);
  };

  // Handle option selection
  const handleSortSelection = (option: string) => {
    setSelectedSort(option); // Move checkmark
    sortChemicals(option); // Sort list dynamically
    setSortVisible(false); // Close popup
  };

  // Use sorted list in UI instead of original chemicalsData
  useEffect(() => {
    setSortedChemicals(chemicalsData);
  }, [chemicalsData]);









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

      {/* Filter & Sort Buttons */}
      <View style={styles.filterSortContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal} // Open filter modal
        >
          <Text style={styles.buttonText}>
            <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 600 350"
            style={{ marginRight: "5px", width: "16px", height: "16px" }}
          >
            <path
              fill="currentColor"
              d="M496 72H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v24H16C7.2 72 0 79.2 0 88v16c0 8.8 7.2 16 16 16h208v24c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-24h208c8.8 0 16-7.2 16-16V88c0-8.8-7.2-16-16-16zm0 320H160v-24c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v24H16c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h80v24c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-24h336c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm0-160h-80v-24c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v24H16c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h336v24c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-24h80c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16z"
            />
          </svg>
            Filter By</Text>
        </TouchableOpacity>


        {/* NEW SORT BY BUTTON */}
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => setSortVisible(!sortVisible)}
        >
          <Text style={styles.buttonText}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fal"
              data-icon="sort-amount-down"
              className="svg-inline--fa fa-sort-amount-down fa-w-16 Du5qR"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 550 400"
              style={{ marginRight: "5px", width: "16px", height: "16px" }}
            >
              <path
                fill="currentColor"
                d="M376 288H264a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h112a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8zm-64 96h-48a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8zM504 96H264a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h240a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8zm-64 96H264a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h176a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8zM198.93 371.56a11.93 11.93 0 0 0-16.91-.09l-54 52.67V40a8 8 0 0 0-8-8H104a8 8 0 0 0-8 8v383.92l-53.94-52.35a12 12 0 0 0-16.92 0l-5.64 5.66a12 12 0 0 0 0 17l84.06 82.3a11.94 11.94 0 0 0 16.87 0l84-82.32a12 12 0 0 0 .09-17z"
              ></path>
            </svg>
              Sort
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: "5px", width: "16px", height: "16px" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Text> 
        </TouchableOpacity>


        


        {/*{isOpen && (
            <div style={stylesSort.dropdown}>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {sortOptions.map((option, index) => (
                  <li
                    key={index}
                    style={stylesSort.option}
                    onClick={() => {
                      console.log(option);
                      setIsOpen(false);
                    }}
                    onMouseOver={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = stylesSort.optionHover.backgroundColor || "";
                    }}
                    onMouseOut={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = "white";
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}*/}

        
       

        {/* OLD SORT BY BUTTON 
        <TouchableOpacity style={styles.sortButton} onPress={openSortModal}>
         <Text style={styles.buttonText}>Sort By</Text>
        </TouchableOpacity>*/}
      </View>
          
      {/* Sort Dropdown needs to situated here. Otherwise it hides behind the Chemical List*/}
      {sortVisible && (
        <View style={stylesSort.dropdown}>
          {sortOptions.map((option, index) => (
            <TouchableOpacity key={index} style={stylesSort.option} onPress={() => handleSortSelection(option)}>
              <Text>{selectedSort === option ? "✓ " : ""} {option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      
      {/* Chemicals List */}
      <ScrollView style={styles.chemicalsList}>
        {sortedChemicals.map((chemical: Chemical, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chemicalItem}
            onPress={() => openModal(chemical)}
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
                {selectedChemical && (
                  <>
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
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
          </BlurView>
        </Modal>
        
        {/* 
        {/* Sort Modal 
        <Modal animationType="slide" transparent={true} visible={sortModalVisible} onRequestClose={closeSortModal}>
          <View style={stylesSort.modalContainer}>
            <View style={stylesSort.modalView}>
              <TouchableOpacity onPress={closeSortModal} style={stylesSort.closeButton}>
                <Text style={stylesSort.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={stylesSort.modalHeader}>Sort Options</Text>

              {/* Dropdown for Sorting Options 
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
        

              {/* Sorting Order Buttons 
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
        
        */}

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


// Example data for chemicals
/*
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
];*/

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
    position: 'relative',
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
    overflow: 'visible', 
    position: 'relative',
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


/*
const stylesSort: { [key: string]: any } = {
  dropdown: {
    position: "absolute",
    top: "120%",
    right: "0",
    width: "50%",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    zIndex: 99999,
    elevation: 999,
  },
  option: {
    padding: "12px 15px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "16px",
    color: "#333",
  },
  optionHover: {
    backgroundColor: "#f9f9f9",
  },
};*/


const stylesSort = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 190,
    right: 15,
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