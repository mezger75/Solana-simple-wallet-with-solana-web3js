"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, CopyCheck } from "lucide-react";
import bs58 from "bs58";

export default function WalletScreen() {
  const [isHidden, setIsHidden] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { account } = useWallet();
  const router = useRouter();
  const publicKey = account.keypair?.publicKey.toBase58();
  const privateKey = account.keypair
    ? bs58.encode(account.keypair.secretKey)
    : null;

  const copyToClipboard = async (): Promise<void> => {
    try {
      setIsCopied(true);
      await navigator.clipboard.writeText(publicKey as string);
      console.log("Text copied to clipboard");
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4">
      <p className="break-words">
        Wallet Address: {publicKey}
        {account.keypair && !isCopied && (
          <Copy className="h-5" onClick={() => copyToClipboard()} />
        )}
        {isCopied && <CopyCheck className="h-5" />}
      </p>
      <p className="break-words">
        Private Key:{" "}
        <span className={isHidden ? "blur-sm" : "blur-0"}>{privateKey}</span>
        {account.keypair && !isHidden && (
          <Eye className="h-5" onClick={() => setIsHidden((prev) => !prev)} />
        )}
        {account.keypair && isHidden && (
          <EyeOff
            className="h-5"
            onClick={() => setIsHidden((prev) => !prev)}
          />
        )}
      </p>
      {account.keypair && (
        <Button onClick={() => router.push("/transactions")}>
          Send transaction
        </Button>
      )}
    </main>
  );
}
