import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { CheckIcon, XIcon } from "@heroicons/react/solid"
import { useForm } from "react-hook-form"
import { useConnectedUserContext } from "@/pages/_app"
import createUser from "@/api/createUser"
import { XCircleIcon } from '@heroicons/react/solid'
import FormButton from "@/components/FormButton"

export default function Signup() {
  const { connectedUser, setConnectedUser } = useConnectedUserContext()
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState(null)
  const [requestSending, setrequestSending] = useState(false)
  
  async function onSubmit(data) {
    try {
      setrequestSending(true)
      setErrorMessage(null)
      const user = await createUser(data.email, data.displayName, data.password)
      setConnectedUser(user)
      setrequestSending(false)
      router.push("/feed")
    } catch(error) {
      setErrorMessage(error.message)
      setrequestSending(false)
    }
  }

  const formPswd = watch("password") || ""

  const uppercaseCondition = (localPswd) => {
    const password = localPswd || formPswd
    return password.search(/[A-Z]/) !== -1
  }
  
  const lowercaseCondition = (localPswd) => {
    const password = localPswd || formPswd
    return password.search(/[a-z]/) !== -1
  }

  const numberCondition = (localPswd) => {
    const password = localPswd || formPswd
    return password.search(/[1-9]/) !== -1
  }

  const lengthCondition = (localPswd) => {
    const password = localPswd || formPswd
    return password.length >= 11
  }

  const passwordValidation = (inputValue) => {
    return uppercaseCondition(inputValue)
      && lowercaseCondition(inputValue)
      && numberCondition(inputValue)
      && lengthCondition(inputValue)
  }

  return (
    <section className="flex flex-col w-full px-4 py-6 bg-white sm:rounded-lg shadow sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

        <div className="flex flex-col">
          <label className="text-sm">Pseudonyme</label>
          <input 
            className={`${errors.displayName ? "invalid-input" : "valid-input"} input block w-full mt-1`} 
            type="text" 
            {...register("displayName", { required: true })}
          />
          { errors.displayName && <p className="text-red-500">Le pseudonyme doit être renseigné !</p> }
        </div>

        <div className="flex flex-col mt-4">
          <label className="text-sm">Adresse e-mail</label>
          <input 
            className={`${errors.email ? "invalid-input" : "valid-input"} input block w-full mt-1`} 
            type="email" 
            placeholder="johndoe@mail.com"
            {...register("email", { required: true, pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" })}
          />
          { errors.email && <p className="text-red-500">L&apos;adresse e-mail doit être renseignée !</p> }
        </div>

        <div className="flex flex-col mt-4">
          <label className="text-sm">Mot de passe</label>
          <input 
            className={`${errors.password ? "invalid-input" : "valid-input"} input block w-full mt-1`}
            type="password"
            {...register("password", { required: true, validate: inputValue => passwordValidation(inputValue) })}
          />
          { errors.password && <p className="text-red-500">Les conditions ci-dessous doivent être respectée !</p> }
          <ul className="mt-2 -mx-1">
            <Badge conditionIsFulfilled={uppercaseCondition} text="contient une majuscule" />
            <Badge conditionIsFulfilled={lowercaseCondition} text="contient une minuscule" />
            <Badge conditionIsFulfilled={numberCondition} text="contient un chiffre" />
            <Badge conditionIsFulfilled={lengthCondition} text="contient au moins 11 caractères" />
          </ul>
        </div>

        <div className="flex items-center mt-4">
          <FormButton loading={requestSending} text="Créer mon compte" />
        </div>

      </form>

      { (errorMessage) && <div className="p-4 mt-4 rounded-md bg-red-50">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{ errorMessage }</h3>
          </div>
        </div>
      </div> }

    </section>
  )
}

function Badge({ text, conditionIsFulfilled }) {
  return (
    <li className={`${conditionIsFulfilled() ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'} inline-flex items-center px-2 py-1 m-1  rounded-full `}>
      { conditionIsFulfilled() ? <CheckIcon className="h-4 mr-1" /> : <XIcon className="h-4 mr-1" />}
      { text }
    </li>
  )
}