import React from 'react';
import { Text, View, TextInput, TouchableOpacity,StyleSheet } from 'react-native';
import * as firebase from 'firebase'
import db from '../config.js'
export default class WriteScreen extends React.Component {
  constructor(){
    super()
    this.state={
      story: ' ',
      author:' ',
      title:' ',
      writingMessage:' '
    }
  }
  initiateWriteStory = async()=>{
    db.collection("writing").add({
      'storyText':this.state.story,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'writingType': "Written"
    })
  
  db.collection("stories").doc(this.state.storyText).update({
    'storyText':this.state.story
  })
  }
  initiateNoStory = async ()=>{
    db.collection("writing").add({
      'storyText':this.state.story,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'writingType':"No story"
    })
    db.collection("stories").doc(this.state.story).update({
     storyText:' '
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
      }
      else{
        this.initiateNoStory();
        writingMessage = "WRITE YOUR STORY"
      }
    })
  }
  



    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.displayText}>WRITE YOUR STORY</Text>
          <View>
            <TextInput style={styles.inputBox }
            placeholder="TITLE OF THE STORY"
            onChangeText={text => {
            this.setState({ title: text });
          }}
          value={this.state.title}
           />
           <TextInput style={styles.inputBox1}
            placeholder="NAME OF THE AUTHOR"
             onChangeText={text => {
            this.setState({ author: text });
          }}
          value={this.state.author}
          />
           <TextInput style={styles.inputBox2}
            placeholder="WRITE YOUR STORY"
             onChangeText={text => {
            this.setState({ story: text});
          }}
          value={this.state.story}
        />

        <TouchableOpacity style={styles.submitButton}
        onPress = {async()=>{this.handleWritingMessage()}}>
        <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
        </View>
       </View>
        
    
      );
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
    }
  })