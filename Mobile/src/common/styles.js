import { Platform, Dimensions } from 'react-native'
export default Styles = {
    FlatList: {
        height: Dimensions.get('window').height - (Platform.OS == 'android' ? 80 : 65),
        backgroundColor: '#fff'
    }
}