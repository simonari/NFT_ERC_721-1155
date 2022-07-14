import { task } from "hardhat/config";

task("mint1155", "Mints NFT")
    .addParam("contract", "Contract address")
    .addParam("owner", "Owner's address of NFT that will be created")
    .addParam("uri", "Metadata URI")
    .setAction(async (taskArgs, { ethers }) => {
        const Contract = await ethers.getContractFactory("MyERC721");
        const contract = await Contract.attach(taskArgs.contract);

        await contract.mint(taskArgs.owner, taskArgs.uri);
        console.log("Finished!");
    })