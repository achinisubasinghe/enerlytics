"use client";

import TopNav from "../../../components/ui/global/TopNav";
import AddUserForm from "./AddUserForm";

export default function AdminPage() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Add User / Manage Users</p>
      </div>

      <div>
        <AddUserForm />
      </div>
    </>
  );
}
