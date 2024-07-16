"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import bs58 from "bs58";

interface WalletContextType {
  account: { keypair: Keypair | null; balance: number };
  createAccount: () => void;
  setBalance: (balance: number) => void;
}
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<{
    keypair: Keypair | null;
    balance: number;
  }>({
    keypair: null,
    balance: 0,
  });

  const getBalance = async (keypair: Keypair) => {
    const balance =
      (await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL;
    setAccount({ keypair, balance: balance });
  };

  useEffect(() => {
    const keypairFromLocalStorage = localStorage.getItem("account");
    if (keypairFromLocalStorage) {
      const parsedKeypair = JSON.parse(keypairFromLocalStorage);
      const keypair = Keypair.fromSecretKey(
        bs58.decode(parsedKeypair.secretKey)
      );
      getBalance(keypair);
    }
  }, []);

  const createAccount = () => {
    const keypair = Keypair.generate();
    const initialBalance = 0;
    setAccount({ keypair, balance: initialBalance });
    const serializedKeypair = {
      publicKey: keypair.publicKey.toBase58(),
      secretKey: bs58.encode(keypair.secretKey),
    };
    localStorage.setItem("account", JSON.stringify(serializedKeypair));
  };

  const setBalance = (balance: number) => {
    setAccount((prevState) => ({
      ...prevState,
      balance,
    }));
  };

  return (
    <WalletContext.Provider value={{ account, createAccount, setBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
