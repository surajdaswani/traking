import { Outlet } from "react-router";
import { NavBar } from "../components/NavBar/NavBar";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div>
      <NavBar />
      <div className={styles.page}>
        <Outlet />
      </div>
    </div>
  );
}
