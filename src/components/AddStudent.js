import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

class AddStudent extends Component {
      constructor(props) {
      super(props);
      this.state = {open: false, name: '', email:'', message:''};
    };
    
    handleClickOpen = () => {
      this.setState( {open:true} );
    };

    handleClose = () => {
      this.setState( {open:false, name: '', email:'', message:''} );
    };

    handleChange = (event) => {
      this.setState({[event.target.name]: event.target.value});
    }

  // Save course and close modal form
    handleAdd = () => {
      const token = Cookies.get('XSRF-TOKEN');
                 let   rc = 0;
      fetch(`${SERVER_URL}/student`, 
        {  
          method: 'POST', 
                          headers: { 'Content-Type': 'application/json',
                                     'X-XSRF-TOKEN': token  }, 
                   body: JSON.stringify(
                      {name: this.state.name, email:this.state.email})
        } )
      .then((response) => { 
                     rc = response.status;
                     return response.json(); 
                 })
                 .then((response) => {
                   if (response.id) {
                      this.setState({id: response.id, message: "Student id="+response.id});
                   } else {
                      this.setState({message: "Add failed. Email already exists. rc="+rc});
                   }
                  })    
       .catch(err => {
        this.setState({message: "Add failed. "+err});
        }
       )
           }
  

    render()  { 
      return (
          <div>
            <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
              Add Student
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                  <TextField autoFocus fullWidth label="Student Name" name="name" onChange={this.handleChange}  />
                  <TextField autoFocus fullWidth label="Email" name="email" onChange={this.handleChange}  /> 
                </DialogContent>
                <DialogActions>
                  <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                  <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button>
                </DialogActions>
              </Dialog>      
          </div>
      ); 
    }
}

// required property:  addCourse is a function to call to perform the Add action
AddStudent.propTypes = {
  addStudent : PropTypes.func.isRequired
}

export default AddStudent;