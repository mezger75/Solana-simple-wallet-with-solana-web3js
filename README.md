# Solana Simple Wallet and Transaction App

This is a web app for creating a crypto wallet and transferring funds through the Solana dev network, built using Next.js, solana-web3.js and TailwindCss.

Try it on Mobile (screen width under 768px):

https://solana-simple-wallet-with-solana-web3js.vercel.app/

## Getting Started

- You should have Node.js and npm (install it from [official Node.js website](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs))

### Installation steps

1. Clone the repo:

   ```bash
   git clone https://github.com/mezger75/Solana-simple-wallet-with-solana-web3js.git
   cd Solana-simple-wallet-with-solana-web3js
   ```

2. Install dependencies:

   npm install

### Launching the App

1. Run the dev server:

   npm run dev

2. Open your browser and check the address http://localhost:3000

### Building the App

1. Build the application for production:

   npm run build

2. Start the production server:

   npm run start

### How to fund your wallet?

1. Through 'Request Airdrop' button:

   After creating the wallet in the app, you can request SOL through the "Request Airdrop" button on the '/transactions' page. This feature is available only once per day.

2. Wallet funding through CLI:

   For Windows: [Install it from here](https://docs.solanalabs.com/cli/install#windows)

   For MacOS & Linux: [Install it from here](https://docs.solanalabs.com/cli/install#macos--linux)

After creating your wallet with the app, request SOL with the following CLI command:

```bash
solana airdrop 2 <WALLET_ADDRESS> --url https://api.devnet.solana.com
```

Then you can confirm the transaction with this command:

```bash
solana confirm <TRANSACTION_SIGNATURE> --url https://api.devnet.solana.com
```
