import React from 'react'
import styles from '../../styles/pages/dashboard.module.css'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import TextArea from '../../components/textarea'
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Minha Dashboard</title>
      </Head>
      <main className={styles.main}>

        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual e a sua tarefa?</h1>
            <form>
              <TextArea placeholder='Digite qual e a sua tarefa...'/>
              <div className={styles.checkboxArea}>
                <input type="checkbox" className={styles.chackbox} />
                <label>Deixar a tarefa publica?</label>
              </div>
              <button type='submit' className={styles.btn}>Registrar</button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PUBLICO</label>
              <button className={styles.btnShare}>
                <FiShare2
                  size={22}
                  color='#3183ff'
                />
              </button>
            </div>
            <div className={styles.taskContent}>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              <button className={styles.btnTrash}>
                <FaTrash
                  size={24}
                  color='#ea3140'
                />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session = await getSession({req}) //basicamente com esse metodo iremos obter os dados do usuario logado 

  if(!session?.user){
    //se não houver usuario ira redirecionar para home 

    return { //esse retorno ira redirecionar o usuario para home page caso não esteja logado
      redirect:{
        destination: "/",
        permanent: false
      }
    }
  }

  return {
    props:{}
  }
}

//basicamente a função "getServerSideProps" ira verificar se ah um usuario logado antes mesmo de renderizar as informações 
//em react utilizamos o useEfect para realizar essa funcionalidade porem no next podemos utilizar o "getServerSideProps" para ta realizando sua funcionalidade no lado do servidor ou seja antes mesmo da pagina ser carregada essa função ja tera sido executada 