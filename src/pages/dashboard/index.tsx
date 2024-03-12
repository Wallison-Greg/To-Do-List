//estilos
import styles from '../../styles/pages/dashboard.module.css'

//next
import Head from 'next/head'
import Link from 'next/link'

//hoocks
import React, {ChangeEvent, FormEvent, useState, useEffect} from 'react'

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
import { addDoc, collection, query, onSnapshot, where, orderBy, doc, deleteDoc} from 'firebase/firestore'

//tipagem 
type Props = {
  user: {
    email: string
  }
}
interface TaskProps{
  id: string,
  created: Date,
  public: boolean,
  tarefa: string,
  user: string
}

const Dashboard = ({user}: Props) => {

  const [input, setInput] = useState("")
  const [publicTask, setPublicTask] = useState(false)
  const [tasks, setTasks] = useState<TaskProps[]>([])

  const docCollection = collection(db, "tarefas")

  useEffect(() => {

    async function loadTasks(){
      //ordenando e filtrando os valores do banco
      const q = query(
        docCollection,
        orderBy("created", "desc"), //nesse metodo estamos ordenando em ordem decrescente de acordo com a data de criação
        where('user', '==', user?.email) //realizando o filtro para trazer somente os postes do proprio usuario logado
      )

      onSnapshot(q, (snapshot) => { //basicamente esse metodo ira traze os valores do banco em tempo real
        const lista = [] as TaskProps[];

        snapshot.forEach((doc) => {
          lista.push({//inserindo os valores dentro do arrei 'lista'
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public
          })
        })

        setTasks(lista)
      })
    }

    loadTasks();

  }, [user?.email])

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

  async function handleShare (id: string){
    await navigator.clipboard.writeText( //pegando a url com o id do post
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, 'tarefas', id)//passando a referencia do post que sera deletado atravez do seu id

    await deleteDoc(docRef)//removendo o post do banco de acordo com id passado como referencia 
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

          {tasks && tasks.map((task) => (
            <article className={styles.task} key={task.id}>
              {task.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLICO</label>
                  <button className={styles.btnShare} onClick={() => handleShare(task.id)}>
                    <FiShare2
                      size={22}
                      color='#3183ff'
                    />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {task.public ? (
                  <Link href={`/task/${task.id}`}>
                    <p>{task.tarefa}</p>
                  </Link>
                ): (
                  <p>{task.tarefa}</p>
                )}
                <button className={styles.btnTrash} onClick={() => handleDeleteTask(task.id)}>
                  <FaTrash
                    size={24}
                    color='#ea3140'
                  />
                </button>
              </div>
            </article>
          ))}

        </section>
      </main>
    </div>
  )
}

export default Dashboard;

//essa função tem como objetivo carregar informações do lado do servidor antes mesmo de renderizar a pagina, o famoso (SSR)
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