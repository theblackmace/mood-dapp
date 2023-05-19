const contractABI = `[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_mood",
				"type": "string"
			}
		],
		"name": "setMood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMood",
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
]`

const contractAddress = '0x4CaEF52018EC1218B18D233eA0e366367EDea902';

let MoodContract;
let signer;
let provider;
let account;


async function getAccount() {
	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
	  .catch((err) => {
		if (err.code === 4001) {
		  // EIP-1193 userRejectedRequest error
		  // If this happens, the user rejected the connection request.
		  console.log('Please connect to MetaMask.');
		} else {
		  console.error(err);
		}
	  });
	account = accounts[0];
}
  

window.addEventListener('load', function() {
	start();
});

document.getElementById('get-mood').addEventListener('click', function() {
    getMood();
})

document.getElementById('set-mood').addEventListener('click', function() {
    setMood();
})

async function start() {

	getAccount();

	const selectedChainId = await window.ethereum.request({ method: 'eth_chainId' });

	if(selectedChainId === '0x13881'){
		init();
	} else {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x13881'}],
			});
			  // refresh
			window.location.reload();			
		} catch {
			window.ethereum.request({
				method: "wallet_addEthereumChain",
				params: [{
					chainId: "0x13881",
					rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
					chainName: "Mumbai Testnet",
					nativeCurrency: {
						name: "MATIC",
						symbol: "MATIC",
						decimals: 18
					},
					blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
				}]
			});		
		}
	}
}

function init() {
	provider = new ethers.providers.Web3Provider(window.ethereum);
	signer = provider.getSigner(account);
	MoodContract = new ethers.Contract(contractAddress, contractABI, signer);
	console.log(MoodContract);
}

async function getMood() {
    const getMoodPromise = MoodContract.getMood();
    const Mood = await getMoodPromise;
    document.getElementById('show-mood').innerText = `Your mood: ${Mood}`;
    console.log(Mood);
}

async function setMood() {
    const mood = document.getElementById('mood').value;
    const setMoodPromise = await MoodContract.setMood(mood);
	const txReciept = await setMoodPromise.wait([confirms = 1]);
	console.log(txReciept);
	getMood();
}