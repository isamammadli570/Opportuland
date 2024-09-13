// CustomerDetailScreen.tsx
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa'
import secureLocalStorage from 'react-secure-storage'
import Loading from '../dashboard/Loading'
import { Link } from 'react-router-dom'
import Card from "../components/card"

const ChatArea = () => {
  const { customer, company, subject, references, id, jobId } =
    useLocation().state
 
  const [message, setMessage] = useState('')
  const [userMessages, setUserMessages] = useState([])
  const initialShowMoreStates = customer.reduce((acc, _, index) => {
    acc[index] = false
    return acc
  }, {})
  const [showMore, setShowMore] = useState(initialShowMoreStates)
  const [selectedFile, setSelectedFile] = useState([])
  const [loadingStates, setLoadingStates] = useState({
    mainLoading: false,
    attachmentLoading: false,
    sendLoading: false,
  })

  const sendAttachment = async (file) => {
    if (!file) {
      console.log('No file to send')
      return
    }
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/saveAttachments`,

        {
          method: 'POST',
          body: formData,

          headers: {},
        }
      )
      const responseData = await response.json()

      // console.log('File uploaded successfully:', responseData)
      return responseData
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    }
  }

  // sendemail
  const sendEmail = async (message, attachmentData, subject, references) => {
    const userStr = localStorage.getItem('user')
    const token = secureLocalStorage.getItem('accessToken')

    const user = JSON.parse(userStr)
    const attachmentsToSend = attachmentData || []

    const url = `${import.meta.env.VITE_HOST}/messages/sendEmail`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },

        body: JSON.stringify({
          userEmail: user.username,
          attachments: attachmentsToSend,
          message: message,
          subject: subject,
          references: references,
        }),
      })
      if (response.ok) {
        const responseData = await response.json()
        return responseData
      } else {
        const errorText = await response.text()
        throw new Error(`Error sending email: ${errorText}`)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return null
    }
  }
  const isInputDisabled =
    loadingStates.mainLoading || loadingStates.attachmentLoading

  //show more text

  const handleToggle = (index) => {
    const updatedShowMore = { ...showMore, [index]: !showMore[index] }
    setShowMore(updatedShowMore)
  }
  // if dont have a message
  if (!Array.isArray(customer)) {
    return <h2>Dont have a message</h2>
  }

  // extract user name
  const extractNameOrEmail = (fromString) => {
    const nameMatch = fromString.match(/^(.*?)\s*<.*?>$/)
    if (nameMatch && nameMatch[1].trim() !== '') {
      return nameMatch[1].replace(/^"|"$/g, '').trim()
    }

    const emailMatch = fromString.match(/<([^>]+)>/)
    if (emailMatch) {
      const email = emailMatch[1]
      const usernameMatch = email.match(/^(.*?)@/)
      if (usernameMatch) {
        return usernameMatch[1]
      }
    }

    return nameMatch
  }

  // sort by timestamps
  const sortedMessages = customer?.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  // timestamps
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes},  ${day}/${month}/${year}`
  }

  // pick file
  const pickFile = async () => {
    if (!isInputDisabled) {
      try {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.pdf'
        input.multiple = true
        document.body.appendChild(input)

        input.click()

        const filesPromise = new Promise((resolve) => {
          input.addEventListener('change', () => resolve(input.files), {
            once: true,
          })
        })

        const selectedFilesData = await filesPromise

        document.body.removeChild(input)

        // Check if selectedFilesData is a FileList
        if (selectedFilesData instanceof FileList) {
          // Convert FileList to an array using Array.from
          const filesArray = Array.from(selectedFilesData)

          // Now you can use the map function on the array
          // filesArray.map((file) => {
          //   // Process each file as needed

          // });
          setSelectedFile(filesArray)
        } else {
          console.error('Invalid selected files data:', selectedFilesData)
        }
      } catch (error) {
        console.error('Error while selecting file:', error)
      }
    }
  }

  const clearSelectedFile = (index) => {
    setSelectedFile((prevUris) => prevUris.filter((_, i) => i !== index))
  }
  // processAttachmentWithDB fonksiyonu
  const processAttachmentWithDB = async (id, filename) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/pdf/${id}`
      )

      const blob = await response.blob()

      const downloadLink = document.createElement('a')
      downloadLink.href = window.URL.createObjectURL(blob)
      downloadLink.download = filename
      downloadLink.click()
    } catch (error) {
      console.error('Error processing attachment with DB:', error)
    }
  }

  // downloadAttachmentFromIMAP fonksiyonu
  const downloadAttachmentFromIMAP = async (emailId, filename) => {
    try {
      const userStr = localStorage.getItem('user')

      const user = JSON.parse(userStr)
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/downloadFromServer`,

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: emailId,
            user: user.username,
            name: filename,
          }),
        }
      )

      if (response.ok) {
        const attachmentData = await response.json()
        const downloadLink = document.createElement('a')
        downloadLink.href = `data:${attachmentData.contentType};base64,${attachmentData.content}`
        downloadLink.download = filename
        downloadLink.click()
      } else {
        console.error(
          'Error downloading attachment from IMAP:',
          response.statusText
        )
      }
    } catch (error) {
      console.error('Error downloading attachment from IMAP:', error)
    }
  }

  const handleAttachmentPress = async (attach) => {
    try {
      setLoadingStates((prev) => ({ ...prev, attachmentLoading: true }))

      if (attach?._id) {
        await processAttachmentWithDB(attach._id, attach.filename)
      } else if (attach?.email_id) {
        await downloadAttachmentFromIMAP(attach.email_id, attach.filename)
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, attachmentLoading: false }))
    }
  }

  // send
  const handleSendClick = async () => {
    if (!isInputDisabled) {
      if (loadingStates.mainLoading) {
        console.log('An operation is still in progress. Please wait.')
        return
      }
      if (message?.trim() === '' && selectedFile.length === 0) {
        console.log('Message or file is required to send.')
        return
      }
      setLoadingStates((prev) => ({ ...prev, mainLoading: true }))
      try {
        console.log('click')
        let attachmentsInfo = []

        for (const file of selectedFile) {
          setLoadingStates((prev) => ({ ...prev, attachmentLoading: true }))
          const attachmentData = await sendAttachment(file)
          setLoadingStates((prev) => ({ ...prev, attachmentLoading: false }))
          if (attachmentData) {
            attachmentsInfo.push(attachmentData)
          }
        }
        const lastReply = await sendEmail(
          message,
          attachmentsInfo,
          subject,
          references
        )
        // setRemoteStatus(lastReply?.remote)
        // console.log(lastReply.remote)
        const stringValue = JSON.stringify(lastReply)
        try {
          localStorage.setItem('lastReply', stringValue)
          localStorage.setItem('message_id', id)
          // console.log('Last reply successfully saved')
        } catch (error) {
          console.error('Error saving last reply:', error)
        }

        setUserMessages((prevMessages) => [
          ...prevMessages,
          { body: message, updatedAt: new Date() },
        ])
        setMessage('')
        setSelectedFile([])
      } catch (error) {
        console.error('Error during send operation:', error)
      } finally {
        setLoadingStates((prev) => ({ ...prev, mainLoading: false }))
      }
    }
  }

  const cleanName= subject?.replace(/[/\\]/g, '')
  return (
    <div className="flex h-full w-full">
    <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900 duration-200">
      <main
        className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
      >
        <div className="h-full">
    <>
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5"}>
      <div className='min-h-screen text-center w-full sm:w-2/3 mx-auto py-10'>
        <h2 className='font-bold text-2xl  my-3'>{company}</h2>
        <Link to={`/job/${cleanName}/${jobId}`} className='text-xl my-3 text-blue-600 underline'>
          {subject}
        </Link>
        {sortedMessages?.map((message, idx) => {
          const hasBody = message.body && message.body.length > 0
          const hasAttachment =
            message.attachment && message.attachment.length > 0

          if (!hasBody && !hasAttachment) {
            return null
          }

          return (
            <div key={message.id || idx} className='px-10 text-left'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h2 className='font-medium text-xl'>
                  {extractNameOrEmail(message?.from)}
                </h2>
                <h2 style={{ fontSize: 14 }} className='font-semibold'>
                  {message.firstMessage
                    ? formatTime(message.createdAt)
                    : formatTime(message.updatedAt)}
                </h2>
              </div>

              {hasBody && (
                <div>
                  <h2 className='text-left mt-3'>
                    {showMore[message._id]
                      ? message?.body
                      : `${message?.body.substring(0, 400)}`}
                  </h2>
                  {message?.body.length > 100 && (
                    <button onClick={() => handleToggle(message._id)}>
                      <h2 className='text-blue-400'>
                        {showMore[message._id]
                          ? '...Show Less'
                          : '...Show More'}
                      </h2>
                    </button>
                  )}

                  {message?.attachment?.map((attach, idx) => {
                    <div className='bg-gray-500' key={idx}>
                      {attach}
                    </div>
                  })}
                </div>
              )}

              {hasAttachment &&
                message.attachment.map((attach, attachIdx) => (
                  <button
                    key={attach.id || attachIdx}
                    onClick={() => handleAttachmentPress(attach)}
                  >
                    <h2 className='bg-gray-300 p-3 text-left'>
                      {attach?.filename} ,
                      {attach?.sizeMB
                        ? ` ${attach?.sizeMB?.substring(0, 3)}kb`
                        : ` ${attach?.size?.substring(0, 3)}kb`}
                    </h2>
                  </button>
                ))}
            </div>
          )
        })}
        {userMessages?.map((userMessage, idx) => (
          <div key={idx}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                margin: '20px ',
              }}
            >
              <h2 className='text-base font-medium '>You</h2>
              <h2 style={{ fontSize: 14 }} className='font-medium'>
                {formatTime(userMessage.updatedAt)}
              </h2>
            </div>
            <div>
              <h2 className='text-gray text-left mx-10'>{userMessage.body}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* answer */}

      <div className='flex justify-center my-5'>
        <textarea
          className='w-2/3 bg-slate-200 border border-gray-400'
          name=''
          id=''
          rows='10'
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        ></textarea>

        {selectedFile?.map((file, index) => (
          <div key={index}>
            <h2>{file?.name}</h2>
            <button
              onClick={() => clearSelectedFile(index)}
              style={{ position: 'absolute', top: -5, right: 0 }}
            >
              {/* <Icon name='times' size={20} color='#000' /> */}
            </button>
          </div>
        ))}
      </div>
      <div className='flex justify-center mb-9'>
        <button
          onClick={pickFile}
          disabled={isInputDisabled}
          className='flex bg-slate-100 mx-10 px-3 py-2'
        >
          <h2>Pick Attachment</h2>
          <FaPaperclip size={26} color='#000' />
        </button>

        <button
          onClick={handleSendClick}
          className='flex bg-yellow-300 px-3 py-2'
        >
          <h2>Send Message</h2>
          <FaPaperPlane size={30} color='#000' />
        </button>
      </div>
      </Card>
      {loadingStates.mainLoading && <Loading />}
      {loadingStates.attachmentLoading && <Loading />}
    </>
    </div>
    </main>
    </div>
    </div>
  )
}

export default ChatArea
