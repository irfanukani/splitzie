import SideNavBar from "./@components/SideNavbar/index";
import { Link, Navigate , Route, Routes } from "react-router-dom";
import PopOver from "./@components/Dashboard/PopOver/PopOver";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from "./@abi/abi.json";
import Dashboard from "./@components/Dashboard/Dashboard";
import Transactions from "./@components/Dashboard/Transactions/Index";
import { toast, ToastContainer } from "react-toastify";
import {motion} from "framer-motion";
import AddFriend from "./@components/AddFriend";
import Lottie from "react-lottie-player";
import lottieJson from "./@animations/blockchain.json"
import ExpenseById from "./@components/ExpenseById";

const App = () => {
  const contractInfo = {
    address: "0x3D1b5541352f5C97e173D9D30DF2BBD2c48fDF2f",
  };

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractInfo.address, abi, provider);

    contract.on("Transaction", (amountPaid, paidBy, paidTo) => {
      toast.success(`Transaction of ${amountPaid} Successful!`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }, []);

  const [loading , setLoading] = useState(true);

  setTimeout(()=> {
    setLoading(false);
  } , [2000])

  if(loading) {
    return <div className="grid place-items-center h-screen w-full bg-gray-800"> 
    <Lottie
      loop
      animationData={lottieJson}
      play
      style={{ width: 350, height: 350 }}
    />
    </div>
  }

  return (
    <motion.div className="bg-gray-900 grid h-screen grid-cols-8">
      <div className="col-span-1 bg-gray-800 phone-hidden">
        <SideNavBar />
      </div>
      <motion.div animate={{y : [-200 , 0]}}  className="col-span-8 sm:col-span-7 p-4 md:p-12">
        <Routes>
        <Route path="/" element={<Navigate to={"/Dashboard"}></Navigate>}> </Route>
          <Route path="/Dashboard" element={<Dashboard />} />
          {/* <Route path="/Transactions" element={<Transactions />} /> */}
          <Route path="/Friends/:id" element={<ExpenseById />} />
          <Route path="/Friends" element={<AddFriend />} />
        </Routes>
      </motion.div>
      <div className="fixed bottom-0 w-full h-12 color-bottom sm:hidden flex justify-between items-center px-16">
        <Link to={"/Dashboard"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>
        <Link to={"/Friends"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};
export default App;
