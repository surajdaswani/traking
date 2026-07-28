import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { clearSession } from "../../lib/auth";
import { applyTheme, getCurrentTheme } from "../../lib/theme";
import { STRINGS } from "../../lib/strings";
import styles from "./NavBar.module.css";

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.link} ${styles.linkActive}` : styles.link;
}

export function NavBar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getCurrentTheme);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const handleThemeToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <nav className={styles.nav}>
      <span className={`${styles.brand} brand-wordmark`}>
        {STRINGS.app.name}
      </span>
      <NavLink to="/" end className={navLinkClassName}>
        {STRINGS.nav.home}
      </NavLink>
      <NavLink to="/search" className={navLinkClassName}>
        {STRINGS.nav.search}
      </NavLink>
      <button
        type="button"
        className={styles.themeToggle}
        onClick={handleThemeToggle}
      >
        {theme === "dark" ? STRINGS.nav.themeToLight : STRINGS.nav.themeToDark}
      </button>
      <button type="button" className={styles.logout} onClick={handleLogout}>
        {STRINGS.nav.logout}
      </button>
    </nav>
  );
}
