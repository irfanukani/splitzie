
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import abi from "../../../@abi/abi.json";

const Transactions = () => {
  const [expenses, setExpenses] = useState();

  const getInfo = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(
      "0x3D1b5541352f5C97e173D9D30DF2BBD2c48fDF2f",
      abi,
      provider
    );
    const info = await erc20.expenses(0);
    setExpenses(info);
    console.log(info);
  };

  useEffect(() => {
    getInfo();
  }, []);

 
  return (
    <div className="p-8">

      <div className="w-full bg-gray-700 h-96 p-8 rounded-md">
        <div className="flex border p-2 border-gray-300">
          <div className="text-blue-400">
            {expenses?.paidBy.slice(0, 14) + "..."}
          </div>
          <div className="text-white">
            {" "}
            Paid ₹ {parseInt(expenses?.amountPaid._hex, 16)} on Behalf of &nbsp;
          </div>
          <div className="text-blue-400">
            {expenses?.paidTo.slice(0, 14) + "..."}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Transactions;
