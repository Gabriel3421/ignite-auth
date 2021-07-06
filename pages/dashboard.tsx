import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCan } from '../hooks/useCan';
import { Can } from '../components/Can';
import { setupAPIClient } from '../services/api';
import { api } from '../services/apiClient';
import styles from '../styles/Home.module.css'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  const { user, isAuthenticated, signOut } = useAuth()

  useEffect(()=> {
    api.get('/me').then(response => console.log(response))
  }, [])
  return (
    <div className={styles.container}>
      <h1>Bem vindo, {user?.email}</h1>
      <button onClick={signOut}>Sign out</button>
      <Can permissions={['metrics.list']}>
        <h2>Metrics</h2>
      </Can>
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