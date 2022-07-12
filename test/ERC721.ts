import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("ERC721 Test", async () => {
    let Contract;
    let contract: Contract;
    
    let signers: SignerWithAddress[];
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async () => {
        Contract = await ethers.getContractFactory("MyERC721");
        contract = await Contract.deploy("Name", "Symbol");

        signers = await ethers.getSigners();
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        await contract.deployed();
    })
    
    describe("Getters", async () => {
        it("Should return name of token", async () => {
            expect(await contract.name()).to.equal("Name");
        })

        it("Should return symbol of token", async () => { 
            expect(await contract.symbol()).to.equal("Symbol");
        })
    })

    describe("Creation", async () => {
        it("Should correctly create tokens", async () => {
            let tokenCounterSummary: number = 0;
            let tokenCounterOwner: number = 0;
            let tokenCounterAddr1: number = 0;
            
            await contract.connect(owner).mint(owner.address);
            tokenCounterSummary++;
            tokenCounterOwner++;

            expect(await contract.balanceOf(owner.address))
            .to.equal(tokenCounterOwner);
            expect(await contract.ownerOf(tokenCounterSummary))
            .to.equal(owner.address);
            
            
            await contract.mint(owner.address);
            tokenCounterSummary++;
            tokenCounterOwner++;

            expect(await contract.balanceOf(owner.address))
            .to.equal(tokenCounterOwner);
            expect(await contract.ownerOf(tokenCounterSummary))
            .to.equal(owner.address);
            
            
            await contract.mint(addr1.address);
            tokenCounterSummary++;
            tokenCounterAddr1++;

            expect(await contract.balanceOf(addr1.address))
            .to.equal(tokenCounterAddr1);
            expect(await contract.ownerOf(tokenCounterSummary))
            .to.equal(addr1.address);
        })

        it("Should revert if creator isn't contract owner", async () => {
            await expect(contract.connect(addr1).mint(owner.address))
            .to.be.revertedWith("Ownable: caller is not the owner");
            

            expect(await contract.balanceOf(addr1.address))
            .to.equal(0);
            await expect(contract.ownerOf(1))
            .to.be.revertedWith("ERC721: invalid token ID");
        })
    })

    describe("Transfers", async () => {
        let tokenOwners: number[][] = [];
        
        beforeEach(async () => {
            let tokenCreated: number = 1;
            for (let i = 0; i < 3; i++) {
                tokenOwners[i] = [];
                for (let j = 0; j < 2; j++) {
                    tokenOwners[i][j] = tokenCreated;
                    tokenCreated++;
                    await contract.mint(signers[i].address);
                }
            }
       })

        describe("User's transfers", async () => {
            it("Should transfer token with given allowance", async () => {
                let addr1Balance: number = await contract.balanceOf(addr1.address);
                let addr2Balance: number = await contract.balanceOf(addr2.address);
                
                let tokenToTransfer: number = Number(tokenOwners[1].shift());

                // user has allowance to transfer his tokens at anytime
                await contract
                .connect(addr1)
                .transferFrom(addr1.address, addr2.address, tokenToTransfer);
                
                addr1Balance--;
                addr2Balance++;
                tokenOwners[2].push(tokenToTransfer);

                // check for it
                expect(await contract.balanceOf(addr1.address)).to.equal(addr1Balance);
                expect(await contract.balanceOf(addr2.address)).to.equal(addr2Balance);
                
                expect(await contract.ownerOf(tokenToTransfer)).to.equal(addr2.address);
                
                
                // one user can transfer tokens from another with allowance
                tokenToTransfer = Number(tokenOwners[1].shift());
    
                await contract.connect(addr1)
                .approve(addr2.address, tokenToTransfer);
                
                await contract
                .connect(addr2)
                .transferFrom(addr1.address, addr2.address, tokenToTransfer);
                
                addr1Balance--;
                addr2Balance++;
                tokenOwners[2].push(tokenToTransfer);
    
                // check for it
                expect(await contract.balanceOf(addr1.address)).to.equal(addr1Balance);
                expect(await contract.balanceOf(addr2.address)).to.equal(addr2Balance);
                
                expect(await contract.ownerOf(tokenToTransfer)).to.equal(addr2.address);
            })
            
            it("Should transfer through 3 first users", async () => {
                let tokenToTransfer: number = Number(tokenOwners[0].pop());
                let ownerBalance: number = await contract.balanceOf(owner.address);
                let addr1Balance: number = await contract.balanceOf(addr1.address);
                let addr2Balance: number = await contract.balanceOf(addr2.address);
                
                await contract.approve(addr1.address, tokenToTransfer);
                await contract
                .transferFrom(owner.address, addr1.address, tokenToTransfer);
                
                ownerBalance--;
                addr1Balance++;
                tokenOwners[1].push(tokenToTransfer);
                
                expect(await contract.balanceOf(owner.address)).to.equal(ownerBalance);
                expect(await contract.balanceOf(addr1.address)).to.equal(addr1Balance);
                
                expect(await contract.ownerOf(tokenToTransfer)).to.equal(addr1.address);


                tokenToTransfer = Number(tokenOwners[1].shift());

                await contract
                .connect(addr1)
                .transferFrom(addr1.address, addr2.address, tokenToTransfer);
                    
                addr1Balance--;
                addr2Balance++;

                expect(await contract.balanceOf(addr1.address)).to.equal(addr1Balance);
                expect(await contract.balanceOf(addr2.address)).to.equal(addr2Balance);
                
                expect(await contract.ownerOf(tokenToTransfer)).to.equal(addr2.address);
                })
            })
        describe("Operator's transfers", async () => {
            it("Should transfer token with given allowance", async () => {
                let ownerBalance: number = await contract.balanceOf(owner.address);
                let addr1Balance: number = await contract.balanceOf(addr1.address);
                let addr2Balance: number = await contract.balanceOf(addr2.address);

                await expect(contract.setApprovalForAll(owner.address, true))
                .to.be.revertedWith("ERC721: approve to caller");
                await contract.setApprovalForAll(addr2.address, true);

                
                let tokenToTransfer: number = Number(tokenOwners[0].pop());
                await contract
                .connect(addr2)
                .transferFrom(owner.address, addr1.address, tokenToTransfer);

                ownerBalance--;
                addr1Balance++;
                tokenOwners[1].push(tokenToTransfer);

                expect(await contract.balanceOf(owner.address)).to.equal(ownerBalance);
                expect(await contract.balanceOf(addr1.address)).to.equal(addr1Balance);

                expect(await contract.ownerOf(tokenToTransfer)).to.equal(addr1.address);
                
                tokenToTransfer = Number(tokenOwners[0].pop());
                
                await contract
                .connect(addr2)
                .transferFrom(owner.address, addr2.address, tokenToTransfer);
                
                ownerBalance--;
                addr2Balance++;
                tokenOwners[2].push(tokenToTransfer);

                expect(await contract.balanceOf(owner.address)).to.equal(ownerBalance);
                expect(await contract.balanceOf(addr2.address)).to.equal(addr2Balance);

                expect(await contract.ownerOf(tokenToTransfer)).to.equal(addr2.address);
            })
        })
    })
})