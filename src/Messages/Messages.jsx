import AuthContext from '../signin/TokenManager'
import { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import Loading from '../dashboard/Loading'
import Card from "../components/card"

const Messages = () => {
  const [lastReplyMessage, setLastReplyMessage] = useState()
  const { getAccessTokenFromMemory } = useContext(AuthContext)
  const [lastMessageId, setLastMessageId] = useState()
  const [messageList, setMessageList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  //chat messages
  const getMessages = async (messageId) => {
    const token = getAccessTokenFromMemory()
    const userDataString = localStorage.getItem('user')
    const userData = JSON.parse(userDataString)

    const url = `${import.meta.env.VITE_HOST}/messages/getMessages`

    // console.log(url)
    if (!token) {
      console.error('Access token is missing or invalid')
      return
    }

    const requestBody = { username: userData.username, messageId }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      const responseBody = await response.json()

      if (response.ok) {
        // console.log(responseBody)
        return responseBody
      } else {
        alert(JSON.stringify(responseBody.error))
        // console.log('getMessages',responseBody)
      }
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  // change message read status
  const updateMessageReadStatus = async (messageId, newReadStatus) => {
    const token = getAccessTokenFromMemory()

    const url = `${import.meta.env.VITE_HOST}/messages/updateMessageReadStatus`

    if (!token) {
      console.error('Access token is missing or invalid')
      return
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageId, newReadStatus }),
      })

      if (!response.ok) {
        throw new Error('API response is not ok.')
      }

      // const data = await response.json()
      // console.log('Message updated:', data)
    } catch (error) {
      //console.error('Error updating message:', error)
      alert(JSON.stringify(error))
    }
  }

  useEffect(() => {
    getMessageId()
    getLastMessage()
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await getMessages()
      const { referencesMessage } = response

      if (referencesMessage && referencesMessage.length) {
        setMessageList((prevMessages) => {
          return [...prevMessages, ...referencesMessage].filter(
            (newMessage, index, self) =>
              index === self.findIndex((t) => t._id === newMessage._id)
          )
        })
      }
    } catch (error) {
      // console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }


  const handlePress = async (mess) => {
    setIsLoading(true)
    console.log(mess?.messageId)
    const filteredMessages = await getMessages(mess?.messageId)
    if (mess?.read === false) {
      await updateMessageReadStatus(mess?._id, true)
    }
    if (
      filteredMessages &&
      Array.isArray(filteredMessages?.referencesMessage)
    ) {
      navigate(`/messages/${mess?._id}`, {
        state: {
          customer: filteredMessages?.referencesMessage,
          company: mess?.companyId,
          hr: mess?.hrId,
          subject: mess?.subject,
          references: mess?.references,
          id: mess?._id,
          jobId: mess?.jobId
        }
      });
      setIsLoading(false)
    } else {
      console.error('Not an arr:', filteredMessages)
    }
  }

  async function getMessageId() {
    try {
      const value = localStorage.getItem('message_id')
      if (value !== null) {
        setLastMessageId(value)
        return value
      } else {
        return null
      }
    } catch (error) {
      console.error('Error retrieving message ID:', error)
      return null
    }
  }
  const getLastMessage = async () => {
    try {
      const stringValue = localStorage.getItem('lastReply')
      if (stringValue !== null) {
        const lastReply = JSON.parse(stringValue)
        setLastReplyMessage(lastReply)
      } else {
        // console.log('No saved last reply found')
      }
    } catch (error) {
      console.error('Error retrieving or parsing last reply:', error)
    }
  }

  const updatedMessages = (messageList ?? []).map((message) => {
    if (message._id == lastMessageId && message.firstMessage) {
      const updatedMessage = {
        ...message,
        updatedAt: lastReplyMessage?.updatedAt,
      }
      //  console.log('Updated message:', updatedMessage);
      return updatedMessage
    }
    return message
  })

  const sortedMessages = updatedMessages?.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  )
  const formatDate = (date) => {
    if (moment(date).isSame(moment(), 'day')) {
      return 'Today'
    } else if (moment(date).isSame(moment().subtract(1, 'days'), 'day')) {
      return 'Yesterday'
    } else {
      return moment(date).format('DD.MM.YYYY')
    }
  }

  return (
    <div className="flex h-full w-full">
    <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 duration-200" >
      <main
        className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
      >
        <div className="h-full">
        
    <>
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5"}>
      {/* <div className='bg-white min-h-[90vh]'> */}
        {messageList?.length === 0 && (
          <h2 className='text-2xl text-black'>You do not have any messages</h2>
        )}

        <div>
        {isLoading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
          {sortedMessages?.map((mess, idx) => {
            const key = mess?._id + idx
            const subjectLines = mess?.subject?.split('\n')
            let truncatedSubject = ''

            if (subjectLines) {
              const firstLine = subjectLines[0]

              if (firstLine.length > 75) {
                truncatedSubject =
                  firstLine.substring(0, 35) +
                  '\n' +
                  firstLine.substring(30) +
                  '\n' +
                  '...'
              } else if (firstLine.length > 35) {
                truncatedSubject =
                  firstLine.substring(0, 35) + '\n' + firstLine.substring(30)
              } else {
                truncatedSubject = mess?.subject
              }
            }

            if (mess?.firstMessage) {
              return (
                <div
                  key={key}
                  onClick={() => handlePress(mess)}
                  className={`${mess?.read ? '' : 'bg-navy-200'} m-2 `}
                >
                  <div className='w-[80%] m-auto flex items-center'>
                    <div className='flex w-[800px]  p-4 m-h-[20px] border-b border-gray cursor-pointer'>
                      <div>
                        <h2
                          className={`text-xl ${
                            mess?.read ? '' : 'font-semibold'
                          }`}
                        >
                          {mess?.companyId}
                        </h2>
                        <h2
                          className={`text-lg ${
                            mess?.read ? '' : 'font-semibold'
                          }`}
                        >
                          {truncatedSubject}
                        </h2>
                        <h2 className={`${mess?.read ? '' : 'font-semibold'}`}>
                          {mess?.body?.split('\n')[0] + '...'}
                        </h2>
                      </div>
                    </div>
                    <h2 className={`${mess?.read ? '' : 'font-semibold'}`}>
                      {formatDate(mess.updatedAt)}
                    </h2>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>

        {isLoading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
      {/* </div> */}
      </Card>
    </>
    
    </div>
    </main>
    </div></div>
  )
}

export default Messages
