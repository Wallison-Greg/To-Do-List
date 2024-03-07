import React, {ChangeEvent, FormEvent, useState} from 'react'
import styles from '../../styles/pages/dashboard.module.css'
import Head from 'next/head'

//autentication
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

//components
import TextArea from '../../components/textarea'

//icons
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'

//firebase
import { db } from '@/services/firebase'
import { addDoc, collection } from 'firebase/firestore'

type Props = {
  user: {
    email: string
  }
}

const Dashboard = ({user}: Props) => {

  const [input, setInput] = useState("")
  const [publicTask, setPublicTask] = useState(false)

  const docCollection = collection(db, "tarefas")

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPublicTask(e.target.checked)
  }

  async function handleSubmit(e:FormEvent){
    e.preventDefault();

    if(input === "") return;

    try {

      //criando um novo documento no banco 
      await addDoc(docCollection, {
        //adicionando os valores que serão passados para dentro do banco
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask
      })

      setInput("")
      setPublicTask(false)

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Minha Dashboard</title>
      </Head>
      <main className={styles.main}>

        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual e a sua tarefa?</h1>
            <form onSubmit={handleSubmit}>
              <TextArea 
                placeholder='Digite qual e a sua tarefa...' 
                value={input} 
                onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                /*
                  obs: precisamos passar o "ChangeEvent<HTMLTextAreaElement>" como tipagem para podermos pegar o value
                  caso contrario dara erro na aplicação pois o typescript n vai reconhecer o value
                */
              />
              <div className={styles.checkboxArea}>
                <input 
                  type="checkbox" 
                  className={styles.chackbox} 
                  checked={publicTask}
                  onChange={handleChangeInput}
                />
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
    props:{
      user:{
        email: session?.user?.email
      }
    }
  }
}

//basicamente a função "getServerSideProps" ira verificar se ah um usuario logado antes mesmo de renderizar as informações 
//em react utilizamos o useEfect para realizar essa funcionalidade porem no next podemos utilizar o "getServerSideProps" para ta realizando sua funcionalidade no lado do servidor ou seja antes mesmo da pagina ser carregada essa função ja tera sido executada 