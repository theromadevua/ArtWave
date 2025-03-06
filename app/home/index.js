import { ActivityIndicator, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Animated as Animated2 } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { colors, paddings } from '../../constants/theme'
import { ap, hp, isWeb, wp } from '../../helpers/common'
import Categories from '../../components/Categories'
import { categories } from '../../constants/data'
import ParticleBackground from '../../components/ParticleBackground'
import { BlurView } from 'expo-blur'
import { apiCall } from '../../api'
import ImageGrid from '../../components/ImageGrid'
import Header from '../../components/Header';
import FiltersModal from '../../components/FiltersModal';
import { useRouter } from 'expo-router';
import { Animated } from 'react-native';

var page = 1;

const Home = () => {
    const { top } = useSafeAreaInsets();
    const [scrollY, setScrollY] = useState(0);
    const [search, setSearch] = useState('');
    const paddingTop = top > 0 ? top + 10 : 30;
    const searchInputRef = useRef();
    const [activeCategory, setActiveCategory] = useState(null);
    const [pictureCategories, setPictureCategories] = useState([]);
    const [images, setImages] = useState([]);
    const router = useRouter()
    const modalRef = useRef(null)
    const scrollRef = useRef(null)
    const [filters, setFilters] = useState([])
    const [isEndReached, setIsEndReached] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [newImage, setNewImage] = useState(null)

    useEffect(() => {
        fetchImages({ page: 1, q: "" });
    }, []);

    const fetchImages = async (params = { page: 1 }, append = false) => {
        setIsFetching(true)
        let res = await apiCall(params);
        if (res.success && res?.data?.hits) {
            if (append) {
                setImages([...images, ...res?.data?.hits]);
            } else {
                setImages([...res?.data?.hits]);
                if (params.q) {
                    setNewImage(res?.data?.hits[0]?.webformatURL);
                }else{
                    setNewImage(null); 
                }
            }
            setIsFetching(false)
        }
    };

    useEffect(() => {
        if (categories) {
            setPictureCategories(categories);
        }
    }, [categories]);

    const applyFilters = () => {
        if(filters){
            console.log('filters apllyed')
            page = 1;
            setImages([])
            let params = {
                page,
                ...filters
            }
            if(activeCategory) params.category = activeCategory
            if(search) params.q = search;
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const resetFilters = () => {
        if(filters){
            console.log('filters reset')
            page = 1;
            setImages([])
            setFilters([])
            let params = {
                page,
            }
            if(activeCategory) params.category = activeCategory
            if(search) params.q = search;
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const openFiltersModal = () => {
        modalRef?.current?.present()
    }

    const closeFiltersModal = () => {
        modalRef?.current?.close()
    }

    const handleChangeCategory = (cat) => {
        if (cat) {
            setPictureCategories((prevCategories) => {
                const updatedCategories = [cat, ...prevCategories.filter((item) => item !== cat)];
                return updatedCategories;
            });
        }
    
        setActiveCategory(cat);
        setSearch('');
        setImages([]);
        page = 1;
        let params = {
            page,
            category: cat ? cat : undefined,
            ...filters
        };
        fetchImages(params, false);
    };

    const filtersRef = useRef(filters);

    useEffect(() => {
        filtersRef.current = filters; 
    }, [filters]);
    
    const handleSearch = (text) => {
        setSearch(text);
        const currentFilters = filtersRef.current;
        if (text.length > 2 || text === "") {
            page = 1;
            const params = {
                page,
                q: text || "",
                ...currentFilters,
            };
            console.log("Fetching with filters:", params);
            fetchImages(params, false);
        }
    };

    const handleTextDebounce = useCallback((searchTerm) => {
        clearTimeout(window.searchTimeout); 
        window.searchTimeout = setTimeout(() => {
          handleSearch(searchTerm);
        }, 400);
      }, []);

    const handleScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        setScrollY(currentScrollY);
        const contentHeight = event.nativeEvent.contentSize.height
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height
        const bottomPosition = contentHeight - scrollViewHeight
       
        if(currentScrollY >= bottomPosition - 1){
            if(!isEndReached){
                setIsEndReached(true)
                page++;
                let params = {
                    page,
                    ...filters
                }
                if(activeCategory) params.category = activeCategory
                if(search) params.q = search
                fetchImages(params, true)
            }
        }else{
            setIsEndReached(false)
        }
    };

    const video = useRef(null);

    useEffect(() => {
        video.current?.playAsync();

    }, []);
    
    const clearThisFilter = (filter) => {
        const newFilters = filters
        delete newFilters[filter]
        setFilters(newFilters)
        setImages([]);
        page = 1;
        let params = {
            page,
            ...newFilters
        };
        if(activeCategory) params.category = activeCategory
        if(search) params.q = search;
        fetchImages(params, false);
    }

    const [currentImage, setCurrentImage] = useState(null); 
    const [fadeAnim] = useState(new Animated.Value(1));
    
    useEffect(() => {
        console.log(newImage, currentImage)
        if (newImage !== currentImage) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setCurrentImage(newImage); 
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [newImage])

    return (
        <ParticleBackground>
            
            <Header openFiltersModal={openFiltersModal} scrollY={scrollY} handleSearch={handleSearch} handleTextDebounce={handleTextDebounce} searchInputRef={searchInputRef} search={search} setSearch={(v) => {setSearch(v)}}/>

            <View style={[styles.container]}>
                <ScrollView
                    bounces={false}
                    overScrollMode='never'
                    contentContainerStyle={{ gap: 15 }}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    ref={scrollRef}
                    scrollEventThrottle={16} 
                >
                
                <View style={styles.firstSection}>
                    
                    <Animated.Image
                        source={currentImage ? { uri: currentImage } : require('../../assets/images/main-bg.jpg')}
                        style={[styles.backgroundImage, { opacity: fadeAnim }]}
                    />
                    <View style={styles.overlay} />
                    {currentImage && <BlurView experimentalBlurMethod='dimezisBlurView' intensity={50} style={StyleSheet.absoluteFill} tint="dark" />}
                    
                    <View style={styles.searchBarBlock}>
                        <Text style={styles.punchline}>
                            Beautiful wallpapers and pictures
                        </Text>
                        <View style={[styles.searchBar, styles.mainSearchBar]}>
                            <Feather name="search" size={24} color={colors.GRAY} />
                            <TextInput
                                ref={searchInputRef}
                                value={search}
                                onChangeText={(text) => {
                                    setSearch(text);
                                    handleTextDebounce(text);
                                }}
                                placeholder="Search pictures"
                                style={styles.searchInput}
                            />
                            {search && (
                                <Pressable style={styles.closeIcon} onPress={() => { setSearch(''); handleTextDebounce(''); }}>
                                    <Ionicons name="close" size={24} color={colors.GRAY} />
                                </Pressable>
                            )}
                        </View>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.infoText}>(?) content license info</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.categories}>
                        <Categories categories={pictureCategories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                    </View>

                    {
                        Object.keys(filters).length > 0 && (
                            <View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                                    {Object.keys(filters).map((key, index) => {
                                        return <View key={key} style={styles.filterItem}>
                                            {
                                                key=='colors'?
                                                <View style={{
                                                    height: 20,
                                                    width: 30,
                                                    borderRadius: 7,
                                                    backgroundColor: filters[key]
                                                }}/>:
                                                <Text style={styles.filterItemText}>{filters[key]}</Text>
                                            }
                                            <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                                                <Ionicons name='close' size={ap(0.7)} color={colors.DARK_GRAY}/> 
                                            </Pressable>
                                        </View>
                                    })}
                                </ScrollView>
                            </View>
                        )
                    }

                    <View>{images.length > 0 && <ImageGrid router={router} images={images} />}</View>
                </View>

                <View style={{marginBottom: 70, marginTop: images.length > 0 ? 10 : 70}}>
                    <ActivityIndicator size="large"/>
                </View>

                </ScrollView>

                <FiltersModal 
                    modalRef={modalRef}
                    filters={filters}
                    setFilters={setFilters}
                    onClose={closeFiltersModal}
                    onApply={applyFilters}
                    onReset={resetFilters}
                />
            </View>
        </ParticleBackground>
    );
};

export default Home;

const styles = StyleSheet.create({
    content: {
        gap: 15,
    },
    container: {
        flex: 1,
        gap: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 99,
        backgroundColor: colors.LIGHT_GRAY,
        marginRight: 30,
        width: wp(50),
        maxWidth: 400,
    },
    mainSearchBar: {
        width: 700,
        maxWidth: wp(80),
        padding: 15,
        paddingVertical: 10,
        backgroundColor: colors.WHITE,
    },
    searchBarBlock:{
        zIndex: 10,
        width: 700,
        maxWidth: wp(80),
    },
    firstSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(100),
        height: hp(35)
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: hp(1.8),
        fontFamily: 'outfit',
        outlineStyle: 'none',
    },
    punchline:{
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: ap(0.7),
        fontFamily: 'outfit'
    },
    closeIcon: {
        backgroundColor: colors.LIGHT_GRAY,
        borderRadius: 10,
    },
    backgroundImage: {
        width: wp(100),
        height: hp(35),
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    overlay: {
        width: wp(100),
        height: hp(35),
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.25)', 
    },
    info: {
        position: 'absolute',
        bottom: 10,
        left: 15
    },
    infoText: {
        color: colors.WHITE,
        fontFamily: 'outfit'
    },
    filters: {
        gap: 10,
        paddingHorizontal: 15
    },
    filterItem: {
        backgroundColor: colors.LIGHT_GRAY,
        padding: 5, 
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 7,
        gap: 10,
        paddingHorizontal: 10
    },
    filterItemText: {
        fontFamily: 'outfit',
        fontSize: ap(0.65)
    },
    filterCloseIcon: {
        backgroundColor: colors.GRAY,
        borderRadius: 4,
        height: ap(0.7),
    }
});
