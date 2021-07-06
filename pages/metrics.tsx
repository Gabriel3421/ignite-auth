import { setupAPIClient } from '../services/api';
import styles from '../styles/Home.module.css'
import { withSSRAuth } from '../utils/withSSRAuth'


export default function Metrics() {
  return (
    <div className={styles.container}>
      <h1>Metrics</h1>
    </div>
  )
}
export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
})