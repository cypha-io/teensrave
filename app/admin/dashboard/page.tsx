import { redirect } from "next/navigation";

const Dashboard = () => {
  redirect("/admin/dashboard/overview");
};

export default Dashboard;
