"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";

export default function Header({
  showBackButton = false,
}: {
  showBackButton?: boolean;
}) {
  const { account, createAccount } = useWallet();
  const router = useRouter();
  const pathName = usePathname();
  return (
    <header className="flex justify-between items-center h-16 w-full bg-gray-700 p-4 text-white">
      {showBackButton && <Button onClick={() => router.back()}>Back</Button>}
      {account.keypair && <p>Balance: {account.balance} SOL</p>}
      {pathName === "/" && (
        <Button onClick={createAccount} className="ml-auto">
          {account.keypair ? "Create Another Wallet" : "Create Wallet"}
        </Button>
      )}
    </header>
  );
}
