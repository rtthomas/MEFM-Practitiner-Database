/**
* This reducer deals with all state related to provinces and cities
*/
import * as actions from './locationActions';

const initialState = {
    provinces: [],
    citiesMap: {},
    idToProvinceMap: {}
}

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.STORE_PROVINCES:
            console.log(actions.STORE_PROVINCES)
            const provinces = action.provinces.map(province => {
                return province.name
            })
            const idToProvinceMap = action.provinces.reduce((idToProvinceMap, province) => {
                idToProvinceMap[province.id] =  province;
                return idToProvinceMap;
            }, {})
            return {
                ...state,
                provinces,
                idToProvinceMap
            }
 
        case actions.STORE_CITIES:
            console.log(actions.STORE_CITIES)
            if (!action.cities || action.cities.length === 0){
                return {
                    ...state,
                    citiesMap: []
                }
            }
            // Convert the cities list into a map of selection arrays for the selector
            const citiesMap = action.cities.reduce ( (citiesMap, city) => {
                const provinceName = state.idToProvinceMap[city.provinceId].name;
                if (!citiesMap[provinceName]){
                    citiesMap[provinceName] = [];
                }                
                // citiesMap[provinceName].push({value: city.name, label: city.name});
                citiesMap[provinceName].push(city.name);
                return citiesMap;
            }, {});
            // Sort each city set
            state.provinces.forEach(province => {
                if (citiesMap[province]){
                    citiesMap[province].sort();
                }
            });
            return {
                ...state,
                citiesMap
            }

        case actions.SELECT_PROVINCE:
            const provinceId = action.province.id;
            return {
                ...state,
                citiesInSelectedProvince: state.citiesMap[provinceId]
            }

        default:
            return state;
    }
}

export default locationReducer;    
