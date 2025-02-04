import React, { Fragment, useEffect, useRef, useState } from "react";
import Pill from "./components/Pill";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set()); // to avoid duplicate users
  const inputRef = useRef(null);
  const fetchUsers = () => {
    if (!searchTerm) return setSuggestions([]); // if search term is empty, then clear the suggestions
    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`) // fetching data from dummyjson rest api
      .then((res) => res.json())
      .then((res) => setSuggestions(res)); // setting the fetched data to suggestions state
    console.log("fetching users");
  };

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]); // adding selected user to selectedUsers array
    setSelectedUserSet(new Set([...selectedUserSet, user.email])); // adding selected user to selectedUserSet
    setSearchTerm(""); // clearing the search term
    setSuggestions([]); // clearing the suggestions
    inputRef.current.focus(); // focusing on the input field
  };

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id // only keeping the users whose id is not equal to the user.id
    ); // filtering out the user to be removed
    setSelectedUsers(updatedUsers); // updating the selectedUsers array

    const updatedEmails = new Set(selectedUserSet); // creating a new set from the selectedUserSet};
    updatedEmails.delete(user.email); // deleting the user email from the updatedEmails Set
    setSelectedUserSet(updatedEmails); // updating the selectedUserSet with the updatedEmails Set

    inputRef.current.focus(); // focusing on the input field
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const debouncedTimer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => {
      clearTimeout(debouncedTimer);
    };
  }, [searchTerm]);

  console.log(selectedUsers);

  return (
    <>
      <div className="user-search-container">
        <div className="user-search-input">
          {selectedUsers.map((user) => {
            // mapping through the selectedUser array to display the selected users
            return (
              <Pill
                key={user.id}
                image={user.image}
                text={user.firstName + " " + user.lastName}
                onClick={() => handleRemoveUser(user)}
              />
            );
          })}
          <div>
            <input
              ref={inputRef} // ref to focus on the input field
              type="text"
              name="input1"
              id="input1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter your search term"
              onKeyDown={handleKeyDown}
            />
            <ul className="suggestions-list">
              {suggestions.users && // if suggestions.users is not empty, then map through the suggestions.users array
                suggestions.users?.map((user) => {
                  return !selectedUserSet.has(user.email) ? ( // if selectedUserSet does not have the user email, then display the user in the list
                    <li key={user.id} onClick={() => handleSelectUser(user)}>
                      {/* onClick event to select user */}
                      <img
                        src={user.image}
                        alt={user.firstName + " " + user.lastName}
                      />
                      <span>{user.firstName + " " + user.lastName} ----- </span>
                      <span>{user.email}</span>
                    </li>
                  ) : (
                    // if selectedUserSet has the user email, then display <nothing></nothing>
                    <></>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
