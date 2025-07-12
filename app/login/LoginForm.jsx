'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function LoginForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const { refresh } = useAuth();

  const [data, setData] = useState({
    email: '',
    password: '',
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
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await API.post('/login', {
        email: data.email,
        password: data.password,
      });

      const user = res.data?.user;
      if (res.data?.success && user) {
        console.log('✅ Login success:', user);

        // update the AuthContext
        refresh();

        if (user.role === 'company') {
          router.push(`/company/${user.id}/profile`);
        } else {
          router.push('/');
        }
      } else {
        throw new Error(res.data?.message || 'Login failed');
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Login failed';
      console.error('❌ Login failed:', msg);
      setErrorMsg(msg);
    }
  };
  return (
    <>
      <div className={styles.loginPage}>
        <div className={styles.loginHeader}>
          <h1>Log ind</h1>
          {/* TODO: Replace with Danish translation */}
        </div>

        <div className={styles.loginFormWrapper}>
          {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={data.email}
                onChange={handleChange}
                required
                className={`${styles.formInput} ${styles.email}`}
              />

              <label htmlFor="password" className={styles.formLabel}>
                Adgangskode
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
                {showPassword ? (
                  <AiOutlineEye
                    onClick={togglePasswordVisibility}
                    className={styles.passwordToggleIcon}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    onClick={togglePasswordVisibility}
                    className={styles.passwordToggleIcon}
                  />
                )}
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
                  <label htmlFor="remember-me" className={styles.formLabel}>
                    Husk mig
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className={styles.forgotPasswordLink}
                >
                  Glemt adgangskode?
                </Link>
              </div>
            </div>

            <div className={styles.formButton}>
              <button type="submit" className={styles.button}>
                Log ind
                <img src="/Arrow icon.png" alt="arrow icon" />
              </button>
              <p>
                Har du ikke en konto?{' '}
                <Link href="/signup" className={styles.signUpLink}>
                  Tilmeld dig
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
