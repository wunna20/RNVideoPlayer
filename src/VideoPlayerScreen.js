import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation';
const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation, downloadUrl }) => {
    
    const { movie } = route.params;

    function setOrientation() {
        if (Dimensions.get('window').height > Dimensions.get('window').width) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
        else {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    }

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: movie.downloadUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={true}
                isLooping={false}
                useNativeControls
                onFullscreenUpdate={setOrientation}
                style={styles.video}
            />
            <Text>hello {movie.downloadUrl}</Text>
        </View>
    )
}

export default VideoPlayerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },

    video: {
        width: width,
        height: height / 3,
        marginBottom: 30
    },
})