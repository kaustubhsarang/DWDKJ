import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Button, Label } from "./Utils";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import ReactLoading from "react-loading";

class App extends Component {
  constructor() {
    super();
    this.state = {

      isSelect: false,
      data: ' ',
      columns: [],
      sessionId:-1,
      done:undefined,
      currUser: ' ',
      currSong:' '
  
    };
    this.getData();
    this.getCurrent();

  }

stopSong=()=>{
  this.setState({done:true});
  var sessionId = this.state.sessionId;
  axios.get('https://webapp-191120202122.azurewebsites.net/api/v1/sessionId/'+sessionId+'/stop')
  .then(response=>{
    this.getData();
  })
  .then(a=>this.setState({done:false}))
}

getCurrent=()=>{
  axios.get('https://webapp-191120202122.azurewebsites.net/Karaoke/gig/1/getCurrentUserQueue')
  .then(response=>{
    this.setState({currSong:response.data.songName,currUser:response.data.userName, sessionId:response.data.sessionId });
    // var user = response.data.userName;
    // var list = [];
    // list.push(user);
    // list.push(song);
  })
}

  playNext=()=>{
    this.setState({done:true});
    var sessionId = this.state.sessionId;
    console.log(sessionId);
    axios.get('https://webapp-191120202122.azurewebsites.net/api/v1/sessionId/'+sessionId+'/play')
    // axios.get('http://localhost:8080/api/v1/sessionId/'+sessionId+'/play')
    .then(response=>{
      this.getData();
      this.getCurrent();
    })
    .then(a=>this.setState({done:false}))
  }

  getData = () => {


    console.log(this.state.data)
    axios.get('https://webapp-191120202122.azurewebsites.net/Karaoke/gig/1/getUserQueue')
      .then(response => {
          console.log(response.data);

          var returnData = [] ;
          let setColumns = [];
          const isSelect = true;
        
            
            if (response.data.length>0) {
              Object.keys(response.data[0]).forEach(key => {
                setColumns.push({
                  Header: key,
                  accessor: key
                })
              })

              returnData = response.data;
                        this.setState(state => {
           return ({ data:returnData, columns: setColumns, isSelect})
          })
          }


      })
      .catch(error => {
          console.log(error);
          this.setState(state => {
            return ({ data: error.message})
          }) 
      });
  }



  
  render() {
    const { data, columns, isSelect  } = this.state;
 // const { currentSong } = this.state;
    return (
      <div style={{margin: 'auto', textAlign: 'center'}}>

        <h1> Karaoke DJ Portal</h1>
         
          {/* new */}
        {this.state.done?(<div style={{margin:'200px'}}><ReactLoading type={"bars"} color={"red"} /></div>):(
        <div>
        <div>
          {this.state.data!==" "?
            <div>        
        <label value='Label1' style={{color:'black', fontFamily:'cursive', fontSize:'30px'}}>Currently Playing: </label>
        <label value='Label2'style={{color:'black', fontFamily:'cursive', fontSize:'30px'}}>"{this.state.currSong}" by "</label>
        <label value='Label3'style={{color:'black', fontFamily:'cursive', fontSize:'30px'}}>{this.state.currUser}" </label>
         </div> 
           :<div> <label value='Label4' style={{color:'black', fontFamily:'cursive', fontSize:'30px'}}>Currently Playing: </label>
          </div> }       
        </div>


  
        <div style={{display: 'flex',margin: '5px',border: '2px solid #ececec', justifyContent: 'space-between'}}>
          <Button value={'Play'}  style={{backgroundColor: '#3dce3d'}}/>
          <Button value={'Pause'}  style={{backgroundColor: '#FFA500'}}/>
          <Button value={'Next'} onClick={this.playNext} style={{backgroundColor: '#1E90FF'}}/>
        </div>
        <br />
        <br />
       
        {this.state.data !== " "  && isSelect ?
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        : <p>{data}</p> }
        </div> )}
      </div>
    );
  }
}


export default App;
