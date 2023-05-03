import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ref, remove} from "firebase/database";

export default function AlertDialog(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if(props.todos.length > 0){
        setOpen(true);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    
    alert('handleOk >>'+ JSON.stringify(props.todos)+', currentFilter >> '+props.currentFilter);
    props.todos.map((todo) => {
        remove(ref(props.db, `/${props.auth.currentUser.uid}/${todo.uidd}`));
        return todo;
    })
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleClickOpen} disabled={props.todos.length > 0 ? false : true}>
        Clear
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        PaperProps={{ sx: { width: "40%", height: "35%" } }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion !"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete {props.currentFilter} to-do's ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCancel} autoFocus>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleOk}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}