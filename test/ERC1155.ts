import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ERC1155 Test", async () => {
    let Contract;
    let contract: Contract;
    
    let signers: SignerWithAddress[];
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async () => {
        Contract = await ethers.getContractFactory("MyERC1155");
        contract = await Contract.deploy();

        signers = await ethers.getSigners();
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        await contract.deployed();
    })

    describe("Creation", async () => {
        let tokenIds: number[];
        let tokenAmountsStoredOwner: number[];
        let tokenAmountsStoredAddr1: number[];
        let tokenAmountsStoredAddr2: number[];
        let tokenAmountsToMintAndBurn = [1, 10, 25];
        let tokenURIs: string[];

        beforeEach(() => {
            tokenIds = [1, 2, 3]
            tokenAmountsStoredOwner = [0, 0, 0]
            tokenAmountsStoredAddr1 = [0, 0, 0]
            tokenAmountsStoredAddr2 = [0, 0, 0]
            tokenURIs = ["uri of token #1", "uri of token #2", "uri of token #3"]
        })
        
        describe("Single tokens", async () => {
            it("Should correctly mint and burn single tokens", async () => {
                await expect(contract
                .connect(addr1)
                .mintNFT(owner.address, tokenIds[0], tokenAmountsToMintAndBurn[0], tokenURIs[0]))
                .to.be.revertedWith("Ownable: caller is not the owner")


                await contract
                .mintNFT(owner.address, tokenIds[0], tokenAmountsToMintAndBurn[0], tokenURIs[0]);
                await contract
                .mintNFT(owner.address, tokenIds[1], tokenAmountsToMintAndBurn[2], tokenURIs[1]);

                tokenAmountsStoredOwner[0] += tokenAmountsToMintAndBurn[0];
                tokenAmountsStoredOwner[1] += tokenAmountsToMintAndBurn[2];

                expect(await contract
                .balanceOf(owner.address, tokenIds[0]))
                .to.equal(tokenAmountsStoredOwner[0]);
                
                expect(await contract
                .balanceOf(owner.address, tokenIds[1]))
                .to.equal(tokenAmountsStoredOwner[1]);

                await contract
                .mintNFT(addr1.address, tokenIds[1], tokenAmountsToMintAndBurn[1], tokenURIs[1]);
                await contract
                .mintNFT(addr1.address, tokenIds[0], tokenAmountsToMintAndBurn[2], tokenURIs[0]);

                tokenAmountsStoredAddr1[1] += tokenAmountsToMintAndBurn[1];
                tokenAmountsStoredAddr1[0] += tokenAmountsToMintAndBurn[2];

                expect(await contract
                .balanceOf(addr1.address, tokenIds[1]))
                .to.equal(tokenAmountsStoredAddr1[1]);
                expect(await contract
                .balanceOf(addr1.address, tokenIds[0]))
                .to.equal(tokenAmountsStoredAddr1[0]);

                
                await expect(contract
                .connect(addr1)
                .burnNFT(owner.address, tokenIds[0], tokenAmountsToMintAndBurn[0]))
                .to.be.revertedWith("Ownable: caller is not the owner");


                await contract
                .burnNFT(owner.address, tokenIds[0], tokenAmountsToMintAndBurn[0]);
                await contract
                .burnNFT(owner.address, tokenIds[1], tokenAmountsToMintAndBurn[2]);

                tokenAmountsStoredOwner[0] -= tokenAmountsToMintAndBurn[0];
                tokenAmountsStoredOwner[1] -= tokenAmountsToMintAndBurn[2];

                expect(await contract
                .balanceOf(owner.address, tokenIds[0]))
                .to.equal(tokenAmountsStoredOwner[0]);
                
                expect(await contract
                .balanceOf(owner.address, tokenIds[1]))
                .to.equal(tokenAmountsStoredOwner[1]);

                await contract
                .burnNFT(addr1.address, tokenIds[1], tokenAmountsToMintAndBurn[1]);
                await contract
                .burnNFT(addr1.address, tokenIds[0], tokenAmountsToMintAndBurn[2]);

                tokenAmountsStoredAddr1[1] -= tokenAmountsToMintAndBurn[1];
                tokenAmountsStoredAddr1[0] -= tokenAmountsToMintAndBurn[2];

                expect(await contract
                .balanceOf(addr1.address, tokenIds[1]))
                .to.equal(tokenAmountsStoredAddr1[1]);
                expect(await contract
                .balanceOf(addr1.address, tokenIds[0]))
                .to.equal(tokenAmountsStoredAddr1[0]);
            })
        })
        describe("Batch of tokens", async () => {
            it("Should correctry mint and burn batch of tokens", async () => {
                await expect(contract
                .connect(addr1)
                .mintBatchNFT(
                    owner.address, 
                    [tokenIds[0], tokenIds[2]], 
                    [tokenAmountsToMintAndBurn[1], tokenAmountsToMintAndBurn[2]],
                    [tokenURIs[0], tokenURIs[2]]))
                .to.be.revertedWith("Ownable: caller is not the owner");
    
    
                await contract
                .mintBatchNFT(
                    owner.address, 
                    [tokenIds[0], tokenIds[2], tokenIds[1]], 
                    [tokenAmountsToMintAndBurn[1], tokenAmountsToMintAndBurn[2], tokenAmountsToMintAndBurn[0]],
                    [tokenURIs[0], tokenURIs[2], tokenURIs[1]])

                tokenAmountsStoredOwner[0] += tokenAmountsToMintAndBurn[1];
                tokenAmountsStoredOwner[2] += tokenAmountsToMintAndBurn[2];
                tokenAmountsStoredOwner[1] += tokenAmountsToMintAndBurn[0];
                
                await contract
                .mintBatchNFT(
                    addr1.address, 
                    [tokenIds[2], tokenIds[1], tokenIds[0]], 
                    [tokenAmountsToMintAndBurn[2], tokenAmountsToMintAndBurn[0], tokenAmountsToMintAndBurn[1]],
                    [tokenURIs[2], tokenURIs[1], tokenURIs[0]])

                tokenAmountsStoredAddr1[2] += tokenAmountsToMintAndBurn[2];
                tokenAmountsStoredAddr1[1] += tokenAmountsToMintAndBurn[0];
                tokenAmountsStoredAddr1[0] += tokenAmountsToMintAndBurn[1];

                let balancesBN = await contract
                .balanceOfBatch(
                    [owner.address, addr1.address],
                    [tokenIds[0], tokenIds[1]])

                let balances: number[] = [];
                
                for (let i = 0; i < balancesBN.length; i++) {
                    balances.push(balancesBN[i].toNumber());
                }

                expect(balances)
                .to.equal([tokenAmountsStoredOwner[0], tokenAmountsStoredAddr1[1]])
            })
        })
    })
})