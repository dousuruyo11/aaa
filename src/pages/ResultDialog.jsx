import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ResultDialog(prm) {
  const toggleOpen = () => {
    prm.setOpenResult(!prm.openResult);
  };
  const strTitle = "GAME CLEAR!";
  const strContent = `${prm.difficulity}
  クリアタイム：${prm.time}秒`;

  return (
    <Dialog
      open={prm.openResult}
      onClose={toggleOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{strTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{strContent}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleOpen}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ResultDialog);
