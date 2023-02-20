import { FlatList, StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import MovieCard from '../components/MovieCard';
import data from '../data.json'
import Loading from '../components/Loading';


const HomeScreen = () => {

    const [movieArr, setMovieArr] = useState(data)
    const [isLoading, setIsLoading] = useState(false)
    const [showMb, setShowMb] = useState()
    const [value, setValue] = useState(0);

    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: 'brown' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400'
                }}
            />
        )
    };

    // const callback = downloadProgress => {
    //     const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    //     setShowMb(progress)
    // };


    function downloadFile(uri, id) {
        // const tt = movieArr
        // const index = movieArr.findIndex(obj => obj.id === id)
        // tt[index].downloading = true
        // setMovieArr(tt)

        setIsLoading(true)

        console.log('brr', uri)
        console.log('id', id)
        var generateId = uuid.v4();



        let fileUri = FileSystem.documentDirectory + `${generateId}.mp4`;
        console.log('start')
        FileSystem.downloadAsync(uri, fileUri)
            .then(async (response) => {
                const item = { downloadUrl: response.uri }
                const index = movieArr.findIndex(obj => obj.id === id)

                movieArr[index] = { ...movieArr[index], ...item }
                const updated = [...movieArr, movieArr[index]]
                const removeItem = updated.slice(0, -1)
                setMovieArr(removeItem)

                // tt[index].downloading = false
                // setMovieArr(tt)
                await AsyncStorage.setItem('keys', JSON.stringify(removeItem))
                setIsLoading(false)
                console.log('finish')
            }).catch(error => {
                console.error('download error', error);
            })
    }

    const removeItem = async (id) => {
        try {
            const result = await AsyncStorage.getItem('keys')
            const movies = JSON.parse(result)
            const index = movies.findIndex(obj => obj.id === id)
            const item = { downloadUrl: null }
            movies[index] = { ...movies[index], ...item }
            console.log('inner delete', movies)
            setMovieArr(movies)
            await AsyncStorage.setItem('keys', JSON.stringify(movies))
        } catch (error) {
            console.log('delete err', error)
        }
    }


    const readMovie = async () => {
        const result = await AsyncStorage.getItem('keys')
        const updateData = JSON.parse(result)

        if (result !== null) {
            setMovieArr(updateData)
        }
        console.log('test res', movieArr)
    }


    useEffect(() => {
        readMovie();
        console.log('res', movieArr)
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {
                isLoading == true ? (
                    <View>
                        <Loading />
                    </View>
                ) : (
                    null
                )
            }
            <FlatList
                data={movieArr}
                numColumns={2}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <MovieCard movie={item} onDownload={() => downloadFile(item.videoUrl, item.id)} onDelete={() => removeItem(item.id)} />}
            />
            <Toast config={toastConfig} />


        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})