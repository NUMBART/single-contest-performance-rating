import React, { Component } from 'react';
import UserInput from "./components/UserInput.js";
import './App.css';
import Button from "@material-ui/core/Button";
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const rating_freq = [798, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 53, 224, 51, 31, 31, 36, 41, 45, 37, 22, 26, 17, 16, 20, 12, 10, 8, 13, 8, 11, 10, 8, 12, 52, 67, 40, 42, 36, 36, 33, 48, 41, 41, 36, 36, 30, 42, 51, 52, 49, 73, 50, 69, 59, 66, 69, 66, 86, 57, 72, 86, 84, 88, 90, 100, 93, 93, 112, 111, 105, 105, 121, 106, 106, 105, 122, 111, 113, 135, 122, 119, 137, 127, 128, 125, 140, 133, 130, 137, 132, 148, 133, 148, 128, 133, 120, 122, 134, 148, 117, 123, 129, 123, 106, 120, 127, 116, 119, 124, 98, 96, 133, 133, 108, 102, 103, 96, 100, 91, 88, 97, 91, 93, 85, 74, 70, 100, 77, 72, 76, 74, 62, 79, 63, 79, 80, 72, 83, 76, 73, 64, 63, 58, 70, 67, 59, 53, 53, 53, 54, 53, 50, 56, 54, 51, 46, 50, 46, 35, 39, 66, 46, 47, 45, 27, 41, 61, 36, 50, 30, 34, 35, 34, 33, 33, 42, 31, 20, 24, 21, 25, 32, 22, 28, 22, 43, 42, 48, 52, 32, 37, 24, 36, 28, 28, 25, 24, 26, 20, 17, 29, 16, 15, 18, 13, 20, 21, 9, 14, 9, 12, 10, 11, 8, 13, 9, 8, 13, 9, 9, 10, 7, 12, 10, 3, 8, 9, 4, 8, 5, 9, 3, 8, 3, 3, 3, 6, 9, 4, 6, 6, 4, 2, 1, 7, 0, 2, 6, 6, 2, 2, 1, 0, 2, 3, 1, 3, 2, 2, 0, 3, 3, 3, 1, 2, 2, 0, 1, 1, 1, 0, 5, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ];


class App extends Component {
  state = {
    handle: '',
    showResult: false,
    jsonData: ''
  }

  nameChangedHandler = event => {
    this.setState({
      handle: event.target.value
    });
  }
  loadResults = async () => {
    // alert("loading results for " + this.state.handle);
    const ratingURL = "https://codeforces.com/api/user.rating?handle=" + this.state.handle;
    const response = await fetch(ratingURL);
    const jsonData = await response.json();
    console.log(jsonData);
    if(jsonData.status !== "OK") alert("Please enter a valid handle");
    else{
      this.setState({
        showResult: true,
        jsonData: jsonData
      })
    }
  }

  rankToExpectedRating = rank => {
    let begin = 0, end = 4000, exp_rating;
    while(begin <= end){
      let mid = (begin+end)/2;
      if(this.ratingToExpectedRank(mid) > rank){
        begin = mid+1;
      }
      else{
        end = mid-1;
        exp_rating = mid;
      }
    }
    return exp_rating;
  }

  ratingToExpectedRank = rating => {
    let rank = 1.0;
    for (let i = 0; i < 400; ++i) {
        let opponentRating = i*10; //trash value
        let exponent = ((rating - opponentRating))/ 400.0;
        let lossProbability = 1.0 / (1.0 + Math.pow(10.0, exponent));
        rank += lossProbability*rating_freq[i];
    }
    return rank;
  }

  findSCPR = (oldRating, newRating) => {
    let delta = newRating - oldRating;
		let cur_rating = newRating - delta, meanrank_rating = newRating+delta;
		let cur_exp_rank = this.ratingToExpectedRank(cur_rating);
		let mean_rank = this.ratingToExpectedRank(meanrank_rating);
		const actual_rank = mean_rank*mean_rank/cur_exp_rank;
    let SCP_rating = this.rankToExpectedRating(actual_rank);
    return SCP_rating;
  }

  render(){
    const InputHandle = {
      margin: '20%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '390px',
      height: '140px',
      padding: '16px',
      backgroundColor: '#f0f0f0',
      borderRadius: '3px',
    }

    let content = 
    <div style={InputHandle} className="InputHandleDiv">
      <UserInput changed = {this.nameChangedHandler} name = {this.state.handle}/>
      <Button variant="contained" color = "secondary" style = {{fontSize: 12}} onClick = {this.loadResults}>View Results</Button>
    </div>;
    if(this.state.showResult){
      content =
      <div>
        <TableContainer component={Paper}>
          <Table style={{minWidth: 650}} aria-label="simple-table">
            <TableHead>
              <TableRow>
                <TableCell style={{backgroundColor: "#e8055a"}}><Typography style={{color: "white", fontWeight: 500}}>Contest Id.</Typography></TableCell>
                <TableCell style={{backgroundColor: "#e8055a"}}><Typography style={{color: "white", fontWeight: 500}}>Contest Name</Typography></TableCell>
                <TableCell align="right" style={{backgroundColor: "#e8055a"}}><Typography style={{color: "white", fontWeight: 500}}>Old rating</Typography></TableCell>
                <TableCell align="right" style={{backgroundColor: "#e8055a"}}><Typography style={{color: "white", fontWeight: 500}}>Delta</Typography></TableCell>
                <TableCell align="right" style={{backgroundColor: "#e8055a"}}><Typography style={{color: "white", fontWeight: 500}}>New Rating</Typography></TableCell>
                <TableCell align="right" style={{backgroundColor: "#e8055a"}}><Typography style={{color: "white", fontWeight: 500}}>SCP Rating</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.jsonData.result.reverse().map((row) => (
                <TableRow key={row.contestId}>
                  <TableCell>{row.contestId}</TableCell>
                  <TableCell>{row.contestName}</TableCell>
                  <TableCell align="right">{row.oldRating}</TableCell>
                  <TableCell align="right">{row.newRating - row.oldRating}</TableCell>
                  <TableCell align="right">{row.newRating}</TableCell>
                  <TableCell align="right">{this.findSCPR(row.oldRating, row.newRating) > 0 ? Math.round(this.findSCPR(row.oldRating, row.newRating)) : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>;
    }

    return (
      <div className="App">
        <AppBar>
          <Toolbar>
            <IconButton 
              edge="start" 
              style={{marginRight: 2}} 
              onClick={() => {this.setState({
                                showResult: false,
              })}}
              color="inherit" aria-label="menu">
              <ArrowBackIosIcon />
            </IconButton>
            <Typography align="center" variant="h6" style={{flex: 1}}>
              Codeforces Single Contest Performance Ratings
            </Typography>
            <Button color="inherit">About</Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop: "6%"}}>
          {content}
        </div>
      </div>
    );
  }
}

export default App;
