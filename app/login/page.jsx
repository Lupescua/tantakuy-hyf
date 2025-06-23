'use client'
import { useState } from "react";
import Link from 'next/link';
import styles from './login.module.css'

export default function login(){
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
  if (showPassword) {
    setShowPassword(false);
  } else {
    setShowPassword(true);
  }
};
    return(
        <>
        <div className={styles.loginPage}>
            <div className={styles.loginHeader}>
                <h1>Log in</h1>
                <p>Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in magna lacus.</p>
            </div>
            <div className={styles.loginFormWrapper}>

                <form>

                    <div className={styles.formFields}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input type="email" className={`${styles.formInput} ${styles.email}`} required />

                    <label htmlFor="password" className={styles.formLabel}>Password</label>
                    <div className={styles.passwordWrapper}>
                      <input
                            type={showPassword ? "text" : "password"}
                            id="password"
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
                            <input type='checkbox' id="remember-me"  className={styles.rememberMecheckbox}></input>
                            <label htmlFor="remember-me"  className={styles.formLabel} >Remember me</label>
                        </div>
                        <div>
                            <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                                Forgot password?
                                </Link>

                        </div> 
                    </div>

                    </div>

                    <div className={styles.formButton}>
                        <button type='submit'  className={styles.button}>Log in  
                       
                        <img
                        src="/Arrow icon.png"
                        alt="arrow icon"
                        /></button>
                        <p>Don’t have an account? <span><Link href='signup' className={styles.signUpLink}>Sign up</Link></span></p>
                    </div>

                </form>

            </div>


        </div>

        </>

);
}