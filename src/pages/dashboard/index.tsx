import React from 'react'
import styles from '../../styles/pages/dashboard.module.css'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Minha Dashboard</title>
      </Head>
      <h1>pagina painel</h1>
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