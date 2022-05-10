// SPDX-Licence-Identifier: MIT// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oracle {

    // Direccion del owner
    address owner;

    // Numero de asteroides
    uint public numberAsteroids;

    // Evento que reciba datos del oraculo
    event __callbackNewData();

    // Constructor
    constructor () public {
        owner = msg.sender;
    }

    // Restriccion de la ejecucion de las funciones
    modifier onlyOwner(){
        require(msg.sender == owner, 'Only owner');
        _;
    }

    // Recibe datos del oraculo
    function update() public onlyOwner {
        emit __callbackNewData();
    }

    // Funcion para configuracion manual del numero de asteroides
    function setNumberAsteroids(uint _num) public onlyOwner {
        numberAsteroids = _num;
    }
}