import { task } from "hardhat/config";

task("mint721", "Mints NFT and returns URI for token")
    .addParam("contract", "Contract address")
    .addParam("owner", "Owner's address of NFT that will be created")
    .setAction(async (taskArgs, { ethers }) => {
        const Contract = await ethers.getContractFactory("MyERC721");
        const contract = await Contract.attach(taskArgs.contract);

        let id = Number(await contract.mint(taskArgs.owner));
        let uri = String(await contract.tokenURI(id));
        // console.log(`Token #${id} metadata located on ${uri}`);
        console.log("Finished!");
    })