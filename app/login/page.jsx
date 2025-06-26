import Link from "next/link";
import { useState } from "react";
import NavbarLoggedOut from "../components/NavbarLoggedOut"; // adjust import path as needed
import styles from "./login.module.css";

export default function LoginPage() {
  const [data, setData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log(data);
  };

  return (
    <>
      <NavbarLoggedOut />
      <div className={styles.loginPage}>
        <div className={styles.loginHeader}>
          <h1>Log in</h1>
          <p>Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in magna lacus.</p>
        </div>

        <div className={styles.loginFormWrapper}>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={data.email}
                onChange={handleChange}
                required
                className={`${styles.formInput} ${styles.email}`}
              />

              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
                <img
                  src="/eye.png"
                  alt="Toggle password visibility"
                  className={styles.passwordToggleIcon}
                  onClick={togglePasswordVisibility}
                />
              </div>

              <div className={styles.formOptions}>
                <div className={styles.rememberMe}>
                  <input
                    type="checkbox"
                    id="remember-me"
                    name="rememberMe"
                    checked={data.rememberMe}
                    onChange={handleChange}
                    className={styles.rememberMecheckbox}
                  />
                  <label htmlFor="remember-me" className={styles.formLabel}>Remember me</label>
                </div>
                <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className={styles.formButton}>
              <button type="submit" className={styles.button}>
                Log in
                <img src="/Arrow icon.png" alt="arrow icon" />
              </button>
              <p>
                Don’t have an account?
                <Link href="/signup" className={styles.signUpLink}> Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}