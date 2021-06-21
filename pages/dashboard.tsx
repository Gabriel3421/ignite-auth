import { setupAPIClient } from '../services/api';
import styles from '../styles/Home.module.css'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <h1>dashboard</h1>
    </div>
  )
}
export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  console.log(response.data)

  return {
    props: {}
  }
})