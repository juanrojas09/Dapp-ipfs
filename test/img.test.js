const img = artifacts.require("img");
require('chai').use(require('chai-as-promised')).should();
contract("img",(accounts)=>{
let contrato
    before(async()=>{
        contrato=await img.deployed();
       
       
       })
       
       it('deploy',async () =>{
       const address=await contrato.address;
       console.log(address);
      
assert.notEqual(address,undefined);
assert.notEqual(address,0x0);
assert.notEqual(address,"");
       
       })


it('updates the hash',async ()=>{
let memHash
memHash='abc123'
await contrato.write(memHash)
const result=await contrato.read();
assert.equal(result,memHash);




})

});
