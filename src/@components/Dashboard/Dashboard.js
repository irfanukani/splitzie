import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import PopOver from "../Dashboard/PopOver/PopOver";
import abi from "../../@abi/abi.json";
import { Dialog, Transition } from "@headlessui/react";
import Creatable from "react-select/creatable";
import {motion} from "framer-motion"


const Dashboard = () => {
  const [amount, setAmount] = useState("-");
  const [event, setEvent] = useState(0);
  const [transactions, setTransaction] = useState([]);

  const [friends, setFriends] = useState();

  const [selfAddress, setSelfAddress] = useState();
  const [friendsArray, setFriendsArray] = useState();

  const [valueMapper , setValueMapper] = useState([]);

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    setSelfAddress(signer.getAddress());
    const contract = new ethers.Contract(
      "0x3D1b5541352f5C97e173D9D30DF2BBD2c48fDF2f",
      abi,
      provider
    );
    const data = await contract.getTotal(signer.getAddress());
    console.log(parseInt(data._hex, 16));
    setAmount(parseInt(data._hex, 16));

    const transactions = await contract.getExpenseByAddress(
      signer.getAddress()
    );
    setTransaction(transactions);
    console.log(transactions);

    const friends = await contract.retriveFriends(signer.getAddress());
    const mapper = new Map();
    setFriendsArray(friends);
    mapper.set(await signer.getAddress(), "You");
    console.error(signer.getAddress());
    friends.map((f) => {
      mapper.set(f.adr, f.name);
    });
    setFriends(mapper);
  };

  function getOptions() {
    return friendsArray?.map((fr)=>{
      return {value :  fr.adr , label : fr.name}  
    })
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      "0x3D1b5541352f5C97e173D9D30DF2BBD2c48fDF2f",
      abi,
      provider
    );

    contract.on("Transaction", (amountPaid, paidBy, paidTo) => {
      setEvent(event + 1);
      closeModal();
    });
    init();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [paymentDetails, setPaymentDetails] = useState({});

  function handleChange(e) {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  }
  const [recipients , setReciepents] = useState([]);

  function handleRecipientChange(e) {
    setReciepents(e.map((x) => x.value))
    console.log(e.map((x) => x.value))
  }


  async function sendDataToContract() {
    console.log(paymentDetails);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x3D1b5541352f5C97e173D9D30DF2BBD2c48fDF2f",
      abi,
      signer
    );
    recipients.map(async (recipient) => {
      await contract.addExpense(
        recipient,
        (paymentDetails.amount / (recipients.length + 1)),
        paymentDetails.typeOfExpense,
        paymentDetails.note
      );
    })
    
    // console.log(data);
  }

  const [loading , setLoading] = useState(true);

  return (
    <>
      <div className="absolute z-0 top-500 left-40 opacity-50">
        <img src={"https://tailwindcss.com/_next/static/media/1-dark@tinypng.a99d6c93.png"} />
      </div>
      <div className="flex z-50 w-full phone-flex-col align-center text-white justify-between">
        <div className="font-extrabold text-3xl">Dashboard</div>
        <PopOver />

        <div
          onClick={openModal}
          className="rounded-full w-36 grid place-items-center py-2 text-white cursor-pointer my-8 bg-orange-600"
          style={{zIndex : 10}}
        >
          Add Expense
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Expense
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col">
                    <Creatable  isMulti={true}
                      options={getOptions()}
                      onChange={handleRecipientChange}
                    ></Creatable>
                    <input
                      onChange={handleChange}
                      className="text-sm mt-4 w-full border border-gray-200 h-12 text-gray-500 p-1"
                      type="number"
                      placeholder="Amount"
                      name="amount"
                    ></input>
                    <select
                      onChange={handleChange}
                      className="text-sm mt-4 w-full border border-gray-200 h-12 text-gray-500 p-1"
                      name="SplitType"
                      id="splitType"
                    >
                      <option value="equally">Equally</option>
                    </select>
                    <input
                      onChange={handleChange}
                      name="typeOfExpense"
                      className="text-sm mt-4 w-full border border-gray-200 h-12 text-gray-500 p-1"
                      placeholder="Type Of Expense (e.g. Food , Entertainment)"
                    ></input>
                    <input
                      onChange={handleChange}
                      name="note"
                      className="text-sm mt-4 w-full border border-gray-200 h-12 text-gray-500 p-1"
                      placeholder="Note"
                    ></input>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={sendDataToContract}
                    >
                      Create!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="flex text-white mt-8 text-light flex-col">
        <div className="font-semibold text-small">Total Expenses</div>
        <motion.div
          animate={{fontSize : ["36px" , "46px"]}}
          transition={{delay : 0.5}}
          className={`text-6xl ${
            amount > 0 ? "text-green-400" : "text-red-400"
          } font-light`}
        >
          ₹ {amount}
        </motion.div>
      </div>

      <div className="z-50 glass-effect w-full mt-12 rounded-xl p-4 h-80 overflow-scroll">
        <div className="font-light border-l-2 border-orange-600 text-white text-xl">
          {" "}
          &nbsp; Recent Expenses
        </div>
        <br />
        {transactions?.map((tr , idx) => {
          return (
            <motion.div animate={{opacity : [0 , 1] , x : [-750 , 0] , scale : [0.5 , 1]}} transition={{delay : 0.2 * idx}} className=" opacity-0 border text-xsm mt-2 hover:cursor-pointer hover:shadow-lg border-gray-700 w-full rounded-md p-4 text-white flex items-center h-16 gap-4 justify-between">
              <div className="flex gap-4 items-center">
                <img
                  alt="Profile"
                  className="rounded-full w-10 border border-gray-700 border-2"
                  src={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAKhJREFUWEdj/Bh97j8DEgjYth+Zy7DByxGFTyqHkHmMow4Y8BD4UV6AkgbQ4/jnkzgUIfQ4RVePnmbYZRbhTTaMow4Y8BAgNRGSmgaoXg6MOoDqIeAo2Iu3HEDP15Q6AL1QYBx1wICHAHpBRGrZT6h9QKhuwKgLRh0wGgKjIUD3EEAviEgt+0ktB9DrEoy6YNQBAx4ChNr5hOIcXZ5Q+4Hk9sCoA6gdAgAYwBHINfNLmQAAAABJRU5ErkJggg=="
                  }
                />
                <div>
                  {friends?.get(tr.paidBy)
                    ? friends?.get(tr.paidBy)
                    : tr.paidBy}{" "}
                  Paid{" "}
                  <b>
                    ₹ {parseInt(tr.amountPaid._hex, 16)} to{" "}
                    {friends?.get(tr.paidTo)
                      ? friends?.get(tr.paidTo)
                      : tr.paidTo}{" "}
                  </b>
                </div>
              </div>
              <div className="bg-green-500 py-1 px-8 rounded-full phone-hidden">{tr.typeOfExpense}</div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
export default Dashboard;
