import Header from "@/components/header/Header";
import TransactionScreen from "@/components/transactions-screen/TransactionScreen";

export default function Transaction() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header showBackButton />
      <TransactionScreen />
    </div>
  );
}
