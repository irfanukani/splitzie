import { ethers } from "ethers";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import abi from "./../@abi/abi.json";

const ExpenseById = (props) => {
  const params = useParams();

  const [Transactions, setTransactions] = useState([]);
  const [friendTransactions , setFriendTransactions] = useState([]);
  const [amount , setAmount] = useState(0);

  const getAllExpenses = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x3D1b5541352f5C97e173D9D30DF2BBD2c48fDF2f",
      abi,
      provider
    );
    const signerAddress = await signer.getAddress();

    const data = await contract.getExpenseByAddress(signer.getAddress());

    const data2 = await contract.getExpenseByAddress(params.id);
    
    let sum = 0;
    let newArr = [];
    data2.map((d) => {
        if(d.paidTo == signerAddress) {
            sum -= parseInt(d.amountPaid , 16);
            newArr.push(d);
        }
    });

    setFriendTransactions(newArr);

    data.map((d) => {
        if(d.paidTo == params.id) {
            sum += parseInt(d.amountPaid , 16)
        }
    })

    setAmount(sum);

    const updated = data.filter((d) => {
      return d.paidTo == params.id;
    });

    setTransactions(updated);
  };

  useEffect(() => {
    getAllExpenses();
  }, [params.id]);

  return (
    <div className="p-8 text-white overflow-scroll h-4/5">
        <div className="flex items-center mb-5">{(amount > 0) ? "Your Frined ows you (₹) " : "You owe (₹) "} : &nbsp;  <div className={`text-2xl ${(amount > 0) ? "text-green-400" : "text-red-400"}`}>{amount}</div> </div>
      <div className="">
        {Transactions?.map((tr) => {
          return (
            <div className="h-12 w-full border flex align-items-center gap-2 p-2 mt-2 text-white border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>

              {"You Paid ₹" + parseInt(tr?.amountPaid, 16)}
            </div>
          );
        })}
        {friendTransactions?.map((tr) => {
          return (
            <div className="h-12 w-full border flex align-items-center gap-2 p-2 mt-2 text-white border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>

              {"You Recieved ₹" + parseInt(tr?.amountPaid, 16)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ExpenseById;
