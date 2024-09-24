import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/CardComponent";
import exp from "constants";


interface User {
  id: number;
  name: string;
  email: string;
}


export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ id: 0, name: "", email: "" });
  const [updateUser, setUpdateUser] = useState({ id: "", name: "", email: "" });
  const [isEdit, setIsEdit] = useState(false);




  // const handleChange = (e: any) => {
  //   const { id, value } = e.target

  //   setNewUser((prev) =>
  //     ({ ...prev, [id]: value }))
  // }
  // fetchUsers

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/users`);
      setUsers(res?.data?.reverse())
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])



  const getUserByid = async (userId: number) => {
    try {
      const res = await axios.get(`${apiUrl}/users/${userId}`);
      console.log(res?.data);
      setNewUser({
        id: res?.data?.id,
        name: res?.data?.name,
        email: res?.data?.email
      })
      setIsEdit(true)

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])


  const EditUser = async (e: any) => {
    e.preventDefault();
    console.log(newUser.id);  // Check if newUser.id is valid
    try {
      const res = await axios.put(`${apiUrl}/users/${newUser.id}`, {
        name: newUser.name,
        email: newUser.email
      });
      if (res) {
        fetchData();
        setNewUser({ id: 0, name: "", email: "" });
        setIsEdit(false);
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };



  const createUser = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/users`, {
        name: newUser.name,
        email: newUser.email
      })
      if (res) {
        fetchData()
        setNewUser({ id: 0, name: "", email: "" })
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }


  const deleteUser = async (userId: number) => {
    try {
      const res = await axios.delete(`${apiUrl}/users/${userId}`)
      if (res) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }


  return (
    <main className="flex flex-col w-full items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Managment App</h1>


        <form>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name:
          </label>
          <input

            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-500"
            id="name"
            type="text"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />

          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-500"
            id="email"
            type="email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />

          <button onClick={isEdit ? EditUser : createUser} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            {isEdit ? "Edit" : "Add"}
          </button>
        </form>


        <div className="space-y-2">
          {
            users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow ">
                <Card card={user} />
                <div className="flex flex-col gap-5">
                  <button onClick={() => deleteUser(user.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                    Delete
                  </button>
                  <button onClick={() => getUserByid(user.id)} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                    Edit
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </main>
  )


}