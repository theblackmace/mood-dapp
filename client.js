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


const provider = new ethers.providers.Web3Provider(window.ethereum, "mumbai");

provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        MoodContract = new ethers.Contract(contractAddress, contractABI, signer);
    });
});

document.getElementById('get-mood').addEventListener('click', function() {
    getMood();
})

document.getElementById('set-mood').addEventListener('click', function() {
    setMood();
})

async function getMood() {
    const getMoodPromise = MoodContract.getMood();
    const Mood = await getMoodPromise;
    document.getElementById('show-mood').innerText = `Your mood: ${Mood}`;
    console.log(Mood);
}

async function setMood() {
    const mood = document.getElementById('mood').value;
    const setMoodPromise = MoodContract.setMood(mood);
    await setMoodPromise;
}