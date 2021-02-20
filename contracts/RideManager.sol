pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

import './Ride.sol';

contract RideManager {
    
    //// Inits ////
    bytes32 constant NULL = "";
    address[] driversArray;

    //// Enums ////
    enum roles {
        rider,
        driver
    }
    
    enum currentStatus {
        free,
        busy
    }
    
    
    //// Structs ////
    struct riderStruct {
        bytes32 name;
        bytes32 contact;
        bytes32 email;
        roles role;
        address payable riderAddr;
        address[] rides;
    }
    
    
    struct driverStruct {
        bytes32 name;
        bytes32 contact;
        bytes32 email;
        bytes32 carNo;
        uint256 noOfSeats;
        uint256 rating;
        roles role;
        currentStatus status;
        address payable driverAddr; 
        address[] rides;
    }
    
    
    //// Mappings ////
    mapping (address => riderStruct) public ridersMapping;
    mapping (address => driverStruct) public driversMapping;


    //// Events ////
    event RiderRegister(address indexed _address, bytes32 name);
    event DriverRegister(address indexed _address, bytes32 name);
    event requestDriverEvent(address payable _riderAddr, address payable _driverAddr, address rideAddr);
    
    
    //// Constructor ////
    constructor() public {}
    
    
    //// Modifiers ////
    modifier onlyRider(address payable _riderAddr) {
        require(_riderAddr == msg.sender, "Cannot register rider");
        _;
    }
    
    modifier onlyDriver(address payable _driverAddr) {
        require(_driverAddr == msg.sender, "Cannot register driver");
        _;
    }

    
    //// Functions ////
    
    /// Riders ///
    function registerRider(bytes32 _name, bytes32 _contact, bytes32 _email, uint _role, address payable _riderAddr) external onlyRider(_riderAddr) {
        
        ridersMapping[_riderAddr].name = _name;
        ridersMapping[_riderAddr].contact = _contact;
        ridersMapping[_riderAddr].email = _email;
        ridersMapping[_riderAddr].role = roles(_role);
        ridersMapping[_riderAddr].riderAddr = _riderAddr;
        
        emit RiderRegister(_riderAddr, _name);
    }
    
    function getRiderInfo(address payable _riderAddr) external view returns(riderStruct memory _riderStruct) {
        return ridersMapping[_riderAddr];
    }
    
    function cancelRide(address payable _riderAddr) public returns(bool) {
        uint len = ridersMapping[_riderAddr].rides.length;
        delete ridersMapping[_riderAddr].rides[len - 1];
        return true;
    }
    
    function updateDriverRating(address payable _driverAddr, uint256 _rating) external {
        driversMapping[_driverAddr].rating = _rating;
    }
    
    
    /// Drivers ///

    function registerDriver(bytes32 _name, bytes32 _contact, bytes32 _email, bytes32 _carNo, uint256 _seats, uint _role, address payable _driverAddr) external onlyDriver(_driverAddr) {
        
        driversMapping[_driverAddr].name = _name;
        driversMapping[_driverAddr].contact = _contact;
        driversMapping[_driverAddr].email = _email;
        driversMapping[_driverAddr].carNo = _carNo;
        driversMapping[_driverAddr].noOfSeats = _seats;
        driversMapping[_driverAddr].rating = 5;
        driversMapping[_driverAddr].status = currentStatus(0);
        driversMapping[_driverAddr].role = roles(_role);
        driversMapping[_driverAddr].driverAddr = _driverAddr;
        
        driversArray.push(_driverAddr);
        
        emit DriverRegister(_driverAddr, _name);
    }
    
    function getDriverInfo(address payable _driverAddr) external view returns(driverStruct memory _driverStruct) {
        return driversMapping[_driverAddr];
    }
    
    function updateDriverStatus(address payable _driverAddr, uint _status) external {
        driversMapping[_driverAddr].status = currentStatus(_status);
    }
    
    function updateRideInformation(address _driverAddr, address _rideAddr) external {
        ridersMapping[_driverAddr].rides.push(_rideAddr);
    }
    
    
    /// Main ///
    
    function requestRide(address payable _riderAddr, string[] memory _fromAddr, string[] memory _toAddr, bytes32 _amount) public returns(address){
        Ride ride = new Ride(
            _riderAddr,
            address(0),
            _fromAddr,
            _toAddr,
            _amount
        );
        ridersMapping[_riderAddr].rides.push(address(ride));
        
        return address(ride);
    }
    
    function returnDriversAvailable() external view returns(address[] memory) {
        return driversArray;
    }
    
    function requestDriver(address payable _riderAddr, address payable _driverAddr, address _rideAddr) external {
        emit requestDriverEvent(_riderAddr, _driverAddr, _rideAddr);
    }
}