import React from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView ,StyleSheet,Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';

export default class WriteScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      hasCameraPermissions : null,
      scanned : false,
      scannedId : '',
      buttonState : 'normal',
      writingMessage : '',
      story: ' ',
      author: ' ',
      title: ' ',
    }
  }

  getCameraPermissions = async (id) =>{
    const {status}  = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
        status === "granted" is false when user has not granted the permission
      */
      hasCameraPermissions : status === "granted",
      buttonState : id,
      scanned : false
    })
  }

  handleBarCodeScanned  = async ({type, data})=>{
    const { buttonState} = this.state

    if(buttonState === "StoriesId"){
      this.setState({
        scanned : true,
        scannedId : data,
        buttonState : 'normal'
      });
    }
    
  }

  initiateWriteStory = async ()=>{
    //add a transaction
    db.collection("transaction").add({
      'storiesId' : this.state.scannedId,
       'storyText':this.state.story,
       'author':this.state.author,
       'title':this.state.title,
      'data' : firebase.firestore.Timestamp.now().toDate(),
      'writingType': 'written'
    })

    //change book status
    db.collection("stories").doc(this.state.scannedId).update({
      'storyText':this.state.story,
      'author':this.state.author,
      'title':this.state.title
    })
    
    this.setState({
      scannedId : '',
      
    })
  }

  initiateNoStory = async ()=>{
    //add a transaction
    db.collection("writing").add({
      'storiesId' : this.state.scannedId,
      'storyText':this.state.story,
      'author':this.state.author,
      'title':this.state.title,
      'date'   : firebase.firestore.Timestamp.now().toDate(),
      'writingType': 'No story'
    })

    //change book status
    db.collection("stories").doc(this.state.scannedId).update({
      'storyText':' ',
      'author':' ',
      'title':' '
    })

    //change book status
    

    this.setState({
      scannedId : '',
      
    })
  }

  handleWriritngMessage = async()=>{
    var writingMessage = null;
    db.collection("stories").doc(this.state.scannedId).get()
    .then((doc)=>{
      var story = doc.data()
      if(story.storyText){
        this.initiateWriteStory();
        writingMessage='STORY SUBMITTED'
        Alert.alert(writingMessage)
        
      }
      else{
        this.initiateNoStory();
        writingMessage = " WRITE YOUR STORY"
        Alert.alert(writingMessage)
      }
    })

    this.setState({
      writingMessage:writingMessage
    })
  }

  render(){
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if(buttonState !== "normal" && hasCameraPermissions){
      return(
        <BarCodeScanner
          onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
          style = {StyleSheet.absoluteFillObject}
        />
      );
    }

    else if (buttonState === "normal"){
      return(
        <KeyboardAvoidingView style={styles.container} behavior = "padding" enabled>
        <View>
      <Text style={{textAlign:'center', fontSize:30,}}>BEDTIME STORY</Text>
        </View>
        <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Your Id"
              onChangeText={text =>this.setState({scannedId:text})}
              value={this.state.scannedId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("StoriesId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
            <View>
          
    <TextInput style = {styles.box1}
        multiline
        placeholder = "TITLE"
        onChangeText = {text => {
          this.setState({title: text})
        }}
        value = {this.state.title}
   />
        <TextInput
        style= {styles.box2}
        multiline
        placeholder= "NAME OF THE AUTHOR"
        onChangeText = {text=>{
          this.setState({author: text})
        }}
        value={
          this.state.author
        }
        
/>
      <TextInput
    style = {styles.box3}
    multiline
    placeholder= "WRITE YOUR STORY"
    onChangeText= {text =>{
      this.setState({story: text})
    }}
    value={this.state.story}
      />
  
        
       
        <TouchableOpacity
          style={styles.submitButton}
          onPress={async()=>{
            var writingMessage = await this.handleWriritngMessage();
          }}>
          <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          </View>
    </KeyboardAvoidingView>
     
      )
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  displayText:{
    fontSize: 15,
    textDecorationLine: 'underline'
  },
  scanButton:{
    backgroundColor: '#2196F3',
    padding: 10,
    margin: 10
  },
  buttonText:{
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10
  },
  inputView:{
    flexDirection: 'row',
    margin: 20
  },
  inputBox:{
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20
  },
  scanButton:{
    backgroundColor: '#66BB6A',
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0
  },
  submitButton:{
    backgroundColor: '#FBC02D',
    width: 100,
    height:50
  },
  submitButtonText:{
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight:"bold",
    color: 'white'
  },
  box1:{
    width:400,
    height:40,
    borderWidth:1.5,
    fontSize:20,
    marginTop:10
  },
  box2:{
    width:400,
    height:40,
    borderWidth:1.5,
    fontSize:20,
    marginTop:10
  },
  box3:{
    width:400,
    height:300,
    borderWidth:1.5,
    fontSize:20,
    marginTop:25,
    
  }
});