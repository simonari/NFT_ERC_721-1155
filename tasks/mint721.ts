import { task } from "hardhat/config";

task("mint721", "Mints NFT")
    .addParam("contract", "Contract address")
    .addParam("owner", "Owner's address of NFT that will be created")
    .addParam("id", "NFT id")
    .addParam("amount", "Amount of NFT to mint")
    .addParam("uri", "Metadata URI")
    .setAction(async (taskArgs, { ethers }) => {
        const Contract = await ethers.getContractFactory("MyERC1155");
        const contract = await Contract.attach(taskArgs.contract);

        await contract.mint(
            taskArgs.owner, 
            taskArgs.id, 
            taskArgs.amount, 
            taskArgs.uri);
        
        console.log("Finished!");
    })