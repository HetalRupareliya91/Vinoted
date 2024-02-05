import  AppURL  from "./AppURL";
const signout = async () => {
    try {
      let response = await fetch(AppURL + "", { method: 'GET' })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    signout
  }