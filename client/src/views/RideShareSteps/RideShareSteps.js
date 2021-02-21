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
import CropFreeIcon from '@material-ui/icons/CropFree';
import image from "assets/img/ride.png";
import qrcode from "assets/img/qrcode.png";

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
import { LocationCity, LocationOn, TvRounded } from "@material-ui/icons";
import { CardActionArea, TextField } from "@material-ui/core";
import Input from '@material-ui/core/Input';
import Ride from '../../contracts/Ride.json';
import axios from 'axios';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-scanner'


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
      height: 120,
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
  const [loading, isLoading] = React.useState(true);
  const [seats, updateSeats] = React.useState(1);
  const [selectedDrivers, setSelectedDrivers] = React.useState([]);
  const [userSelectedDriver, setUserSelectedDriver] = React.useState('');
  const [rideRequests, setRideRequests] = React.useState([]);
  const [rideContractAddress, setRideContractAddress] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);
  const [previewStyle, setPreviewStyle] = React.useState({
    height: 300,
    width: 300,
  });
  const [qrcodeResult, setqrcodeResult] = React.useState('');

  
  function handleScan(data) {
    setqrcodeResult(data);
    if (data === rideContractAddress) {
      alert('QR code verified successfully! Enjoy your ride!');
      setActiveStep(4);
    }
  }

  function handleError(err) {
    console.error(err)
  }

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
                    className={classes.media}
                    image={image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Ride-Share Location
                  </Typography>
                    {
                      localStorage.getItem("destinationLng") === null ?
                        <Typography variant="body2" color="textSecondary" component="p">
                          To book a Ride-Share all you would need to do is login to your Ride-Share account and choose a location. Enter your pickup and drop locations and click on ‘Ride Now’.
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
                helperText="Before confirming the booking you would need to choose the number of seats that you would wish to book. You can book up to 2 seats on your Ola Share ride. If you choose to book 2 seats, the pickup and drop location of the co-passenger traveling should be same."
                variant="outlined"
              />
            </div>);
        case 2:
          return loading ? `` : <div>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Name", "Contact", "Car No.", "Rating", "Amount", "Accept/Decline"]}
                tableData={selectedDrivers}
              />
            </CardBody>
          </div>;
        case 3:
          return !confirmed ? `` : <QrReader
            delay={100}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />;
        case 4:
          return 'Ready to begin your Ride-Share journey for eco-friendly rides at pocket - friendly rates';
        case 5:
          return `Ride Completed!`;
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
                tableHead={["Ride Address", "Rider Address", "From", "To", "Accept/Decline"]}
                tableData={rideRequests}
              />
            </CardBody>
          </div>;
        case 1:
          return !confirmed ? `` : <QRCode value={rideContractAddress} />;
        case 2:
          return ``;
        default:
          return 'Unknown step';
      }
    }

  }
  const handleNext = async (e) => {
    const { value, id } = e.target;
    if (localStorage.getItem('type') !== null && localStorage.getItem('type') === "0") {

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
              setRideContractAddress(data[5][data[5].length - 1]);
              // isLoading(false);
              // let a = '';
              // while (a === '') {
              //   a = qrcodeResult;
              // }
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
            });
          // setActiveStep((prevActiveStep) => prevActiveStep + 1);

        }
      } else if (activeStep === 2) {
        isLoading(true);
        axios.post('http://localhost:8000/api/rider/request-ride', {
          user: {
            "account": account,
            "latitude": 25,
            "longitude": 25
          }
        }).then((response) => {
          console.log(response.data.selectedDrivers);
          let temp = response.data.selectedDrivers;
          const tempList = temp.map(data => {
            return (
              [
                web3.utils.hexToUtf8(data.name).trim(),
                web3.utils.hexToUtf8(data.contact).trim(),
                web3.utils.hexToUtf8(data.carNo).trim(),
                data.rating.toString(),
                "2 ETH", 
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => {
                    setUserSelectedDriver(data.ethAddress);
                    rideManager.methods.requestDriver(account, data.ethAddress, rideContractAddress).send({ from: account })
                      .once('receipt', async (receipt) => {
                        console.log(receipt);
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                      });
                  }}
                >
                  Accept
              </Button>
              ]
            );
          });
          console.log(tempList);
          setSelectedDrivers(tempList);
          isLoading(false);
        }).catch((err) => {
          console.log(err);
        })
        props.notifyNotificationListener("Sample")
        // setActiveStep((prevActiveStep) => prevActiveStep + 1);

      } else if (activeStep === 3) {
        const ride = new web3.eth.Contract(Ride.abi, rideContractAddress);
        let events = await ride.getPastEvents('UpdateConfirmationEvent', { filter: { _riderAddr: account }, fromBlock: 0, toBlock: 'latest' });
        events = events.filter((event) => {
          return event.returnValues._riderAddr === account && event.returnValues._driverAddr === userSelectedDriver;
        });
        console.log(events);
        if (events.length > 0) { 
          alert('Driver has accepted request');
          ride.methods.updateRiderConfirmation(true).send({ from: account })
            .once('receipt', async (receipt) => {
              console.log(receipt);
            });
          setConfirmed(true);

        }

      } else if (activeStep === 4) {
        const ride = new web3.eth.Contract(Ride.abi, rideContractAddress);
        ride.methods.updateRideComplete(true).send({ from: account })
          .once('receipt', async (receipt) => {
            console.log(receipt);
            let info = await ride.methods.getRideInfo().call({ from: account });
            console.log(info);
            alert('Ride Completed!');
          });
      }
    } else {
      //For Driver
      if (activeStep === 0) {
        console.log('heere');
        let events = await rideManager.getPastEvents('requestDriverEvent', { filter: { _driverAddr: account }, fromBlock: 0, toBlock: 'latest' });
        events = events.filter((event) => {
          return event.returnValues._driverAddr === account;
        });
        console.log(events);
        setRideContractAddress(events[events.length - 1].returnValues.rideAddr);

        const ride = new web3.eth.Contract(Ride.abi, events[events.length - 1].returnValues.rideAddr);
        let info = await ride.methods.getRideInfo().call({ from: account });
        var sourceDisplayName = '';
        var destDisplayName = '';


        axios.get('https://us1.locationiq.com/v1/reverse.php?key=pk.7440d726e8b0dde92f02c33d4b74dcfd&lat=' + info[2][0] + '&lon=' + info[2][1] + '&format=json')
          .then((response) => {
            sourceDisplayName = response.data.display_name;
            axios.get('https://us1.locationiq.com/v1/reverse.php?key=pk.7440d726e8b0dde92f02c33d4b74dcfd&lat=' + info[3][0] + '&lon=' + info[3][1] + '&format=json')
              .then((response) => {
                destDisplayName = response.data.display_name;
                setRideRequests([[events[events.length - 1].returnValues.rideAddr, info[0], sourceDisplayName, destDisplayName,
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => {
                    ride.methods.updateDriverAddress(account).send({ from: account })
                      .once('receipt', async (receipt) => {
                        console.log(receipt);
                        ride.methods.updateDriverConfirmation(true).send({ from: account })
                          .once('receipt', async (receipt) => {
                            console.log(receipt);
                            setConfirmed(true);
                            setActiveStep((prevActiveStep) => prevActiveStep + 1);
                          });
                      });
                  }}
                >
                  Accept
          </Button>
                ]]);
                isLoading(false);
                console.log(rideRequests);
              })
              .catch((e) => {
                console.log(e);
              })
          })
          .catch((e) => {
            console.log(e);
          })

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
        <GridItem xs={12} sm={12} md={10}>
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
