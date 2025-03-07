import { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../utils/api";
import { useForm } from "react-hook-form";
import { Vortex } from './../components/ui/vortex';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);
 
  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
        toast.success("User berhasil diperbarui! ✅");
      } else {
        await addUser(data);
        toast.success("Selamat user berhasil ditambahkan! 🥳🎉");
      }
      reset();
      setEditingUser(null);
      fetchUsers(); 
    } catch (error) {
      if (error.response && error.response.status === 422) {
        toast.error("Gagal! Email sudah dipakai atau password kurang dari 8 karakter.");
      } else {
        toast.error("Terjadi kesalahan. Coba lagi!");
      }
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
      toast.success("User berhasil dihapus 🗑️");
    } catch (error) {
      toast.error("Gagal menghapus user. Coba lagi!");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user); 
    reset(user); 
  };

  return (
    <div className="relative w-full h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute inset-0 -z-10">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={2000}
          baseHue={190}
          className="flex items-center justify-center w-full h-full"
        >

        </Vortex>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center p-6">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            CRUD Users
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mb-6 text-black space-y-4">
            <input
              {...register("name")}
              className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              required
            />
            <input
              {...register("email")}
              type="email"
              className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />
            <input
              {...register("password")}
              type="password"
              className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required={!editingUser}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 duration-300 hover:scale-[1.02] transition-all"
              >
                {editingUser ? "Update" : "Add"} User
              </button>
              {editingUser && (
                <button
                  type="button"
                  className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 duration-300 hover:scale-[1.05] transition-all"
                  onClick={() => {
                    reset();
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b text-black hover:bg-gray-100">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 duration-300 hover:scale-[1.05] transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 duration-300 hover:scale-[1.05] transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 p-3">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
