import styles from './SignupPage.module.css';
import RoleSelector from '../components/signup/RoleSelector';
export default function SignupPage() {
  return (
    <main className="home">
      <h1 className="hero-title">Get started</h1>
      <p className="hero-subtitle">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      </p>

      <div className="card">
        <RoleSelector></RoleSelector>
      </div>
    </main>
  );
}
