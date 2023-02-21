import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import abi from "../@abi/abi.json";

const AddFriend = () => {
  const contractInfo = {
    address: "0x3D1b5541352f5C97e173D9D30DF2BBD2c48fDF2f",
  };

  const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState();
  const [newAddress, setNewAddress] = useState([]);

  async function getFriends() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractInfo.address, abi, provider);
    const data = await contract.retriveFriends(signer.getAddress());
    setFriends(data);
  }

  useEffect(() => {
    getFriends();
  }, []);

  async function handleSubmit() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractInfo.address, abi, signer);
    const data = await contract.addFriend([friendName, newAddress]);
    if (data) toast("Adding Friend!", { type: "default" });
    setFriendName("");
    setNewAddress("");
    getFriends();
  }

  return (
    <Fragment>
      <div className="p-8 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          onChange={(e) => setFriendName(e.target.value)}
          className="h-12 sm:w-2/5 outline-none bg-gray-700 p-2 text-white"
          placeholder="Enter Friend's Name"
        ></input>
        <input
          type="text"
          onChange={(e) => setNewAddress(e.target.value)}
          className="h-12 sm:w-2/5 outline-none bg-gray-700 p-2 text-white"
          placeholder="Enter Friend's Address"
        ></input>
        <button
          onClick={handleSubmit}
          className="bg-orange-400 h-12 w-64 sm:w-24 w-10"
        >
          Add
        </button>
      </div>
      <div className="p-8 flex gap-2 flex-col">
        {friends?.map((fr) => {
            return <Link to={`/Friends/${fr.adr}`} className="flex cursor-pointer border items-center border-gray-700 p-4 text-white">
            <img
                  alt="Profile"
                  className="rounded-full w-10 border border-gray-700 border-2 mx-2"
                  src={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAMtJREFUWEdjNLov/Z8BCXCuL0LmYrC/B/bhlSdVP+OoAwZdCOCNYAYGBlLjmJB5GGmAkIZRB9A8BAhZQCiKCMmjlyMklwOELCAkP+oAjBCw7utFqQsIBeHH1jl4lfBXpxAyAkWecdQBAx4COsKaKGkAPQ7R45ztzCe8cfzLhA9FnpB5jKMOGPAQIJQICbUBCWV6QnULwXJg1AF0DwH0fI+ejwk5CD3OCZmHkQYIaRh1ANVDgFBBRCifkyqPHsUE6wJSLSCkftQB6CEAAHtC3VlfDEOlAAAAAElFTkSuQmCC"
                  }
                />
            {fr.name}</Link>
        })}
      </div>
    </Fragment>
  );
};
export default AddFriend;
