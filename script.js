// 1. Declaração de variável global para armazenar a instância web3
let NFTFactoryContract;

// 2. Configuração do endereço do contrato e ABI
const NFTFactory_Address = "0x492b83acCA4C0c5773937407412d177c8FE8059b";
const NFTFactory_ABI = [
	{
		"inputs": [],
		"name": "checkIfOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			}
		],
		"name": "createNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNFTs",
		"outputs": [
			{
				"internalType": "contract NFT[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftContract",
		"outputs": [
			{
				"internalType": "contract NFT",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftSymbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

/* 3. Prompt user to sign in to MetaMask */
const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        const signer = provider.getSigner(accounts[0]);

        /* 3.1 Create instance of pet smart contract */
        NFTFactoryContract = new ethers.Contract(
            NFTFactory_Address,
            NFTFactory_ABI,
            signer
        );
    });
});
const nft_create = document.getElementById("create_div");
const nft_access = document.getElementById("access_div");
const nft_create_button = document.getElementById("create");
const nft_access_button = document.getElementById("access_but");

var isOwner = false;
var nftsymbol = "Your NIFT";
var nftContract = "";
const checkIfOwner = async() => {
    try {
        const owns = await NFTFactoryContract.checkIfOwner();
		const symbol = await NFTFactoryContract.nftSymbol();
		const nft = await NFTFactoryContract.nftContract();
        isOwner = owns;
		nftsymbol = symbol;
		nftContract = nft;
		console.log(nftContract)
    } catch (e) {}
}
var onetime = true;
function checkOwner() {
    checkIfOwner();
    if (isOwner && nftsymbol != "Your NIFT" && onetime) {
		nft_access.style.display = "block";
		nft_create.style.display = "none";
		nft_access_button.innerHTML += nftsymbol;
		onetime = false;
    }
}
setInterval(checkOwner, 1000)

// 4. Creating variables for reusable dom elements

/* 5. Function to set pet details */
const createNIFT = () => {
    // update button value
    nft_create_button.value = "Creating NIFT...";

    /* 5.1 Get inputs from pet form */
    const nft_name = document.querySelector("#Name");
    const nft_symbol = document.querySelector("#Symbol");

    // 5.2 Getting values from the inputs
    NFTname = nft_name.value;
    NFTsymbol = nft_symbol.value;

    /* 5.3 Set pet details in smart contract */
    NFTFactoryContract.createNFT(NFTname, NFTsymbol)
        .then(() => {
        })
        .catch((err) => {
            nft_create_button.value = "Create a NIFT";
            alert("Error setting pet details" + err.message);
        });
};
const accessNIFT = () => {
	window.location.href += "collection.html?contract="+nftContract
}

nft_access_button.addEventListener("click", accessNIFT)

/* Function to set pet details on click of button */
nft_create_button.addEventListener("click", createNIFT);




