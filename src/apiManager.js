import axios from "axios";
import {API} from '../src/server/config'

const getBalance=function(user){
  return  axios.get(`${API}/balance/${user}`)
}

const breakdown=function(user){
    return axios.get(`${API}/breakdown/${user}`)
}

const getAllTransactions=function(user){
    return axios.get(`http://localhost:3001/usert/${user}`)
}

const addTransaction= function(transaction){
    return axios.post("http://localhost:3001/transactions",transaction)
}

const deleteTransaction= function (transactionId){
    return axios.get(`http://localhost:3001/transactions/${transactionId}`)
}

const createUser = (user) =>{
   return axios.post(`${API}/signup`,user)
}

export {getBalance, breakdown, getAllTransactions, addTransaction, deleteTransaction, createUser}