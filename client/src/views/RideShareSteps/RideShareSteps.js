import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import Table from "components/Table/Table.js";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import { bugs, website, server } from "variables/general.js";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { LocationCity, LocationOn } from "@material-ui/icons";
import { CardActionArea, TextField } from "@material-ui/core";
import Input from '@material-ui/core/Input';
import Ride from '../../contracts/Ride.json';
import axios from 'axios';

const useStyles = makeStyles((theme) => {
  return {
    ...styles,
    button: {
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    media: {
      height: 140,
    },
  }
});
function getSteps() {
  if (localStorage.getItem('type') !== null && localStorage.getItem('type') === "0") {
    return [ 'Choose source & destination', 'Enter number of seats', 'Select Driver', 'Picked Up', 'Dropped off' ];
  } else {
    return [ 'Ride Confirmation', 'Picked Up', 'Dropped off' ];
  }
}

export default function RideShareSteps(props) {
  const classes = useStyles();
  const [rideManager, setRideManager] = React.useState(props.rideManager);
  const [account, setAccount] = React.useState(props.account);
  const [web3, setWeb3] = React.useState(props.web3);
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, isLoading] = React.useState(false);
  const [seats, updateSeats] = React.useState(1);
  const steps = getSteps();

  function getStepContent(step) {
    if (localStorage.getItem('type') !== null && localStorage.getItem('type') === "0") {
      switch (step) {
        case 0:
          return (
            <div>
              <Card>
                <CardActionArea>
                  <CardMedia
                    image=""
                    title="Google Maps"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      RideShare Location
                  </Typography>
                    {
                      localStorage.getItem("destinationLng") === null ?
                        <Typography variant="body2" color="textSecondary" component="p">
                          To book a RideShare all you would need to do is login to your RideShare account and choose a location. Enter your pickup and drop locations and click on ‘Ride Now’.
                </Typography>
                        :

                        <Typography variant="body2" color="textSecondary" component="p">
                          Time: {localStorage.getItem('time')}<br />
                          Distance: {localStorage.getItem('distance')}<br />
                        </Typography>

                    }
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="secondary"
                    href="/admin/maps"
                    className={classes.button}
                    startIcon={<LocationOn />}
                  >
                    Go To Maps
                  </Button>
                </CardActions>
              </Card>

            </div>);
        case 1:
          return (
            <div>
              <TextField
                type='number'
                label="No. of Seats"
                id="filled-margin-none"
                defaultValue="Default Value"
                onKeyDown={handleNext}
                className={classes.textField}
                onChange={handleNext}
                value={seats}
                helperText="Before confirming the booking you would need to choose the number of seats that you would wish to book."
                variant="outlined"
              />
            </div>);
        case 2:
          return ``;
        case 3:
          return ``;
        case 4:
          return ``;
        case 5:
          return ``;
        default:
          return 'Unknown step';
      }
    } else {
      switch (step) {
        case 0:
          return loading ? `` :  <div>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Ride No.", "Rider Address", "From", "To", "Accept/Decline"]}
                tableData={[
                  ["Dakota Rice", "Niger", "Oud-Turnhout", "To",<Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Accept
                  </Button>],
                  ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                  ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                  ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                  ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
                  ["Mason Porter", "Chile", "Gloucester", "$78,615"]
                ]}
              />
            </CardBody>
          </div>;
        case 1:
          return ``;
        case 2:
          return ``;
        default:
          return 'Unknown step';
      }
    }

  }
  const handleNext = async (e) => {
    const { value, id } = e.target;
    if (activeStep === 0) {
      console.log(account);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    else if (activeStep === 1) {
      updateSeats(value)
      if (e.key == 'Enter') {
        rideManager.methods.requestRide(
          account,
          [String(localStorage.getItem('sourceLat')), String(localStorage.getItem('sourceLng'))],
          [String(localStorage.getItem('destinationLat')), String(localStorage.getItem('destinationLng'))],
          web3.utils.padRight(web3.utils.fromAscii(20 + 0.5 * Number(localStorage.getItem('distance').split(" ")[0])), 64)).send({ from: account })
          .once('receipt', async (receipt) => {
            let data = await rideManager.methods.getRiderInfo(account).call({ 'from': account });
            console.log(data);
            var rideContractAddress = data[5][data[5].length - 1];
            isLoading(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          });
      }
    } else if (activeStep === 2) {
      axios.post('http://localhost:8000/api/rider/request-ride', {
        user: {
          "account": account,
          "latitude": 25.0045,
          "longitude": 25.001
        }
      }).then((response) => {
        console.log(response.data.selectedDrivers);
      }).catch((err) => {
        console.log(err);
      })
      props.notifyNotificationListener("Sample")
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      //For Driver
      if (activeStep === 0) {
        let events = await rideManager.getPastEvents('requestDriverEvent', { filter: { _driverAddr: account }, fromBlock: 0, toBlock: 'latest' });
        events = events.filter((event) => {
          return event.returnValues._driverAddr == account;
        });
        console.log(events);


        const ride = new web3.eth.Contract(Ride.abi, events[0].returnValues.rideAddr);
        let info = await ride.methods.getRideInfo().call({ from: account });

        console.log(info);

        // web3.utils.hexToUtf8(name).trim()
        
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

      } else if (activeStep == 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

      } else if (activeStep == 2) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Enjoy Ride Share</h4>
              <p className={classes.cardCategoryWhite}>
                Travel management made secure &amp; easy
              </p>
            </CardHeader>
            <CardBody>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <Typography>{getStepContent(index)}</Typography>
                      <div className={classes.actionsContainer}>
                        <div>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Back
                  </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                  <Typography>All steps completed - you&apos;re finished</Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
          </Button>
                </Paper>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
