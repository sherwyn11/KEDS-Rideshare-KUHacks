pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Ride {

    address payable riderAddr;
    address payable driverAddr;
    string[] fromAddr;
    string[] toAddr;
    bytes32 amount;
    bool complete;
    bool confirmedByRider;
    bool confirmedByDriver;
    
    event UpdateConfirmationEvent(address payable indexed _driverAddr, address payable indexed _riderAddr);

    
    constructor(address payable _riderAddr, address payable _driverAddr, string[] memory _fromAddr, string[] memory _toAddr, bytes32 _amount) public {
        riderAddr = _riderAddr;
        driverAddr = _driverAddr;
        fromAddr = _fromAddr;
        toAddr = _toAddr;
        amount = _amount;
        complete = false;
        confirmedByRider = false;
        confirmedByDriver = false;
    }
    
    function getRideInfo() view public returns(address, address, string[] memory, string[] memory, bytes32, bool, bool, bool) {
        return (riderAddr, driverAddr, fromAddr, toAddr, amount, complete, confirmedByRider, confirmedByDriver);
    }
    
    function updateDriverAddress(address payable _driverAddr) public {
        driverAddr = _driverAddr;
        emit UpdateConfirmationEvent(_driverAddr, riderAddr);
    }
    
    function updateRiderConfirmation(bool _status) public {
        require(confirmedByRider != _status, 'Some error occurred!');
        confirmedByRider = _status;
    }
    
    function updateDriverConfirmation(bool _status) public {
        require(confirmedByDriver != _status, 'Some error occurred!');
        confirmedByDriver = _status;
    }
    
    function updateRideComplete(bool _complete) public {
        require(complete != _complete, 'Some error occurred!');
        complete = _complete;
    }
}