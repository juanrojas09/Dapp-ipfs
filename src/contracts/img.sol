// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;

contract img{
    //smart contract code
string memHash;
//funcion que escriba el hash
function write(string memory _memHash) public {
    memHash=_memHash;
}

//funcion que lea el hash
function read() public view returns(string memory _memHash){
    return memHash;
}






}