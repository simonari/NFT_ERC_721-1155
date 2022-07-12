import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
    const Contract = await ethers.getContractFactory("MyERC721");
    const contract = await Contract.deploy("MyNFT721", "NFT721");

    await contract.deployed();
    console.log(`Contract deployed on:\n ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })