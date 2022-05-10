// Llamadas a las dependencias del proyecto
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const fetch = require('node-fetch');

// Llamadas a los archivos .json
const contractJson = require('../build/contracts/Oracle.json');

// Instancia de un objeto de web3
const web3 = new Web3('ws//127.0.0.1:7545');

// Informacion de direcciones de Ganache
const addressContract = '0xD35E63119B19dd288E949c08c3dCfE6cEe673Df7';
const contractInstance = new web3.Contract(contractJson.abi, addressContract);
const privateKey = Buffer.from('c2f45e99a405c5a38790c2be381b991958569ec29dbeed59837f17a4947efbb5', 'hex');
const address = '0x307303537c624b1AA8C49869aCc929B1029224dc';

// Obtener el numero de bloque
web3.eth.getBlockNumber().then(n => listenEvent(n-1));

// Funcion: ListenEvent
function listenEvent(lastBlock) {
    contractInstance.events.__callbackNewData({}, { fromBlock: lastBlock, toBlock: 'latest' },
        (err, event) => {
            event ? updateData() : null,
            err ? console.log(err) : null
        });
}

// Funcion de updateData()
function updateData() {
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-01-01&end_date=2022-01-07&api_key=DEMO_KEY';

    fetch(url)
        .then(response => response.json())
        .then(json => setDataContract(json.element_count))
}

// Funcion: setDataContract(_value)
function setDataContract(_value) {
    web3.eth.getTransactionCount(address, (err, txNum) => {
        contractInstance.methods.setNumberAsteroids(_value)
            .estimateGas({}, (err, gasAmount) => {
                let rawTx = {
                    nonce: web3.utils.toHex(txNum),
                    gasPrice: web3.utils.toHex(web3.toWei('1.4', 'gwei')),
                    gasLimit: web3.utils.toHex(gasAmount),
                    to: addressContract,
                    value: '0x00',
                    data: contractInstance.methods.setNumberAsteroids(_value).encodeABI()
                }
                const tx = new Tx(rawTx)
                tx.sign(privateKey)
                const serializedTx = tx.serialize().toString('hex')
                web3.eth.sendSignedTransaction('0x'+ serializedTx)
            })
    })
}