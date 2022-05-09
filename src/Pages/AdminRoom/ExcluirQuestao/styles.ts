import { makeStyles, createStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto 0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1em'
    
  },
  modalDisplay: {
    display: 'flex',
    margin: 'auto 0',
  },
  deleteIcon: {
    width: 70,
    height: 70,
  },
  boxButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  }
}));

export default useStyles;
