import styles from './login.module.css'
import new_logo from '../assets/images/new_logo.png'

const Login = () => {
  return <div className={styles.login_page}>
    <img src={new_logo} alt="" />
    안녕하세요? 여긴 로그인 페이지
  </div>
}

export default Login;