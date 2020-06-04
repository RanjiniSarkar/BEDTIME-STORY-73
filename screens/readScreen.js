import React from 'react';
import { Text, View, Flatlist,TouchableOpacity,TextInput,StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler'
import db from '../config'

export default class ReadScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      allStories:[],
      lastVisibleStory: null,
        search:''
    }
  }

  retriveStories = async()=>{
    var text = this.state.search.toUpperCase()
    var enteredText = text.split("")

    
    if (enteredText[0].toUpperCase() ==='S'){
    const query = await db.collection("writing").where('stories','==',text).startAfter(this.state.lastVisibleStory).limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allStories: [...this.state.allStories, doc.data()],
        lastVisibleStory: doc
      })
    })
  }
  }

  searchStory= async(text) =>{
    var enteredText = text.split("")
    var text = text.toUpperCase()

    
    if (enteredText[0].toUpperCase() ==='S'){
      const story =  await db.collection("writing").where('storiesId','==',text).get()
      story.docs.map((doc)=>{
        this.setState({
          allStories:[...this.state.allStories,doc.data()],
          lastVisibleStory: doc
        })
      })
    }
    
  }


  componentDidMount = async()=>{
    const query = await db.collection("writing").get()
    query.docChanges.map((doc) => {
      this.setState({
        allStories:[...this.state.allStories, doc.data()]
      })
    })
  }
    render() {
      return (
        <View style={styles.container}>
        <View style={styles.searchBar}>
      <TextInput 
        style ={styles.bar}
        placeholder = "Enter Book Id or Student Id"
        onChangeText={(text)=>{this.setState({search:text})}}/>
        <TouchableOpacity
          style = {styles.searchButton}
          onPress={()=>{this.searchStory(this.state.search)}}
        >
          <Text>Search</Text>
        </TouchableOpacity>
        </View>


        <ScrollView>
          {this.state.allStories.map((writing)=>{
            return(
              <View key={index} style={{borderBottomWidth:2}}>
             <Text>{"StoriesId"+writing.storiesId}</Text>
            <Text>{"Writing Type"+writing.writingType}</Text>
            <Text>{"Date:"+writing.date.toDate()}</Text>
         
        </View>
         )
          })}
        
        
        </ScrollView>
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20
    },
    searchBar:{
      flexDirection:'row',
      height:40,
      width:'auto',
      borderWidth:0.5,
      alignItems:'center',
      backgroundColor:'grey',
  
    },
    bar:{
      borderWidth:2,
      height:30,
      width:300,
      paddingLeft:10,
    },
    searchButton:{
      borderWidth:1,
      height:30,
      width:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'green'
    }
  })