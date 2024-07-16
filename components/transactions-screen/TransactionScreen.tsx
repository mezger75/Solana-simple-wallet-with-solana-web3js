"use client";
import { useState } from "react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function TransactionScreen() {
  const { account, setBalance } = useWallet();
  const [amount, setAmount] = useState<number>(0);
  const [receiver, setReceiver] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successTx, setSuccessTx] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const deleteError = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  const handleSendTransaction = async () => {
    if (!account.keypair) {
      setErrorMessage("No account found");
      deleteError();
      return;
    }
    if (!receiver) {
      setErrorMessage("No receiver address");
      deleteError();
      return;
    }
    if (amount <= 0) {
      setErrorMessage("Zero amount to transfer");
      deleteError();
      return;
    }

    try {
      setIsLoading(true);
      await connection.getBalance(account.keypair.publicKey);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: account.keypair.publicKey,
          toPubkey: new PublicKey(receiver),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [account.keypair]
      );
      if (signature) {
        setTxHash(signature);
        setSuccessTx(true);
        setTimeout(() => {
          setSuccessTx(false);
          setTxHash("");
        }, 3000);
      }

      const newBalance = await connection.getBalance(account.keypair.publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
      setIsLoading(false);
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        console.error("Transaction failed: ", error);
        setErrorMessage(error.message);
      } else {
        console.error("Transaction failed: ", error);
        setErrorMessage("An unknown error occurred");
      }
      deleteError();
    }
  };

  const requestAirdrop = async () => {
    if (!account.keypair) {
      console.log("No account found");
      return;
    }

    try {
      setIsLoading(true);
      const airdropSignature = await connection.requestAirdrop(
        account.keypair.publicKey,
        LAMPORTS_PER_SOL
      );
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });

      const newBalance = await connection.getBalance(account.keypair.publicKey);

      setBalance(newBalance / LAMPORTS_PER_SOL);
      setIsLoading(false);
    } catch (error) {
      console.error(`Airdrop failed: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4">
      <Input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        step={0.00001}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="mb-4"
      />
      <Input
        type="text"
        placeholder="Receiver Wallet Address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        className="mb-4"
      />
      <div className="flex gap-4">
        {account.balance !== 0 && (
          <Button onClick={handleSendTransaction}>
            {isLoading && <Loader2 className="animate-spin mr-2" />} Send
          </Button>
        )}
        {!account.balance && (
          <Button onClick={requestAirdrop}>
            {isLoading && <Loader2 className="animate-spin mr-2" />} Request
            Airdrop
          </Button>
        )}
      </div>
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      {successTx && (
        <p className="text-green-500 mt-2 break-words">
          Success transfer!{" "}
          <Link
            href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
            target="_blank"
            className="underline"
          >
            Details Of Transaction
          </Link>
        </p>
      )}
    </main>
  );
}
