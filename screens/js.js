import React from 'react';
import { Text, View, TextInput, TouchableOpacity,StyleSheet,Alert,ToastAndroid,KeyboardAvoidingView} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase'
import db from '../config.js'
export default class WriteScreen extends React.Component {
  constructor(){
    super()
    this.state={
      hasCameraPermissions: null,
        scanned: false,
        scannedId: ' ',
        buttonState: 'normal',
      story: ' ',
      author:' ',
      title:' ',
      writingMessage:' ',
    
    }
  }
  
  initiateWriteStory = async()=>{
    db.collection("writing").add({
      'storyText':this.state.story,
      'author':this.state.author,
       'title':this.state.title,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'writingType': "Written"

    })
   
  db.collection("stories").doc(this.state.storyText).update({
    'storyText':this.state.story,
    'author':this.state.author,
    'title':this.state.title
  })
  }
  initiateNoStory = async ()=>{
    db.collection("writing").add({
      'storyText':this.state.story,
      'author':this.state.author,
      'title':this.state.title,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'writingType':"No story"
    })
    db.collection("stories").doc(this.state.story).update({
     storyText:' ',
     author:' ',
     title:' '
    })
  }
  handleWritingMessage = async()=>{
    var writingMessage
    db.collection("stories").doc(this.state.storyText).get()
    .then((doc)=>{
      //console.log(doc.data())
      var story = doc.data()
      if(story.storyText){
        this.initiateWriteStory();
        writingMessage = "STORY SUBMITTED"
        Alert.alert(writingMessage)
        
      }
      else{
        this.initiateNoStory();
        writingMessage = "WRITE YOUR STORY"
        Alert.alert(writingMessage)
      }
    })
    this.setState({
      writingMessage: writingMessage
    })
  }
  

  getCameraPermissions = async (id) =>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    
    this.setState({
      /*status === "granted" is true when user has granted permission
        status === "granted" is false when user has not granted the permission
      */
      hasCameraPermissions: status === "granted",
      buttonState: id,
      scanned: false
    });
  }

  handleBarCodeScanned = async({type, data})=>{
    this.setState({
      scanned: true,
      scannedData: data,
      buttonState: 'normal'
    });
  }

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== "normal" && hasCameraPermissions){
      return(
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    else if (buttonState === "normal"){
      return (
        <KeyboardAvoidingView style={styles.container} behavior = 'padding' enabled>
          <View style = {styles.inputView}>
            <TextInput
            style= {styles.inputBox3}
            placeholder="YOUR ID"
            value={this.state.scannedId}
            />
            <TouchableOpacity style= {styles.scanButton} 
            onPress = {()=>{
              this.getCameraPermissions("YOUR ID")
            }}>
              <Text style = {styles.buttonText}>SCAN</Text>

            </TouchableOpacity>
          </View>
          <Text style={styles.displayText}>WRITE YOUR STORY</Text>
          <View>
            <TextInput style={styles.inputBox }
            multiline
            placeholder = "TITLE OF THE STORY"
            onChangeText={text => {
            this.setState({ title: text });
          }}
          value={this.state.title}
           />
           <TextInput style={styles.inputBox1}
           multiline
            placeholder="NAME OF THE AUTHOR"
             onChangeText={text => {
            this.setState({ author: text });
          }}
          value={this.state.author}
          />
           <TextInput style={styles.inputBox2}
           multiline
            placeholder="WRITE YOUR STORY"
             onChangeText={text => {
            this.setState({ story: text});
          }}
          value={this.state.story}
        />

        <TouchableOpacity style={styles.submitButton}
        onPress = {async()=>{ var writingMessage = this.handleWritingMessage()
        this.setState({
          story: ' ',
          author:' ',
          title:' '
        })}}>
        <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
       
        
    
      );
    }
  }
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputBox2:{
      width: 400,
      height: 300,
      borderWidth: 1.5,
      fontSize: 20,
      marginTop:20
    },
    inputBox1:{
      width: 400,
      height: 40,
      borderWidth: 1.5,
      fontSize: 20,
      marginTop:150,
    },
    inputBox:{
      width: 400,
      height: 40,
      borderWidth: 1.5,
      fontSize: 20,
      marginBottom:-120
    },
    submitButton:{
      backgroundColor: '#2196F3',
      width: 125,
      height:50,
      marginBottom:-140,
      marginLeft:140,
      marginTop:10

    },
    submitButtonText:{
      padding: 10,
      textAlign: 'center',
      fontSize: 20,
      fontWeight:"bold",
      color: 'white'
    },
    displayText:{
      padding:-30,
      textAlign:'center',
      fontSize:30,
      fontWeight:'bold',
      color:'blue'
    },
    scanButton:{
      backgroundColor:'#2196F3',
      padding:5,
      margin:10,
      marginLeft:50
    },
    buttonText:{
      fontSize:15,
      textAlign: 'center',
      marginTop:10,
    },
    inputBox3:{
      height:40,
      borderWidth:1.5,
      borderRightWidth:0,
      fontSize:20,
      width:200,
      margin:-30

    },
    inputView:{
      flexDirection: 'row',
      margin:-20
    }
  })