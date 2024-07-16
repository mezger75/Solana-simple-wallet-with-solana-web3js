import Header from "@/components/header/Header";
import WalletScreen from "@/components/wallet-screen/WalletScreen";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <WalletScreen />
    </div>
  );
}
