import { useState } from "react"

interface Props {
  alLoguearse: (token: string) => void
}

export const Login = ({ alLoguearse }: Props) => {
  
  const[email,setEmail]=useState<string>("")

  const[password,setPassword]=useState<string>("")

  const [error, setError] = useState("")

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const url = "https://api-morosos.onrender.com/api/auth/login"

    const paquete= {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    try {
        const respuesta = await fetch(url,paquete)

        if (respuesta.ok) {
            const data = await respuesta.json()
            localStorage.setItem("tokenVIP", data.token);
            console.log("Token recibido:", data.token)
            alLoguearse(data.token) 
        } else {
            const errorData = await respuesta.json()
            setError(errorData.error || "Error en las credenciales")
        }

    } catch (error) {
        console.log(error)
        setError("Error de conexión con el servidor")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Morosos App 💸</h1>
        <p className="text-center text-slate-500 mb-8">Ingresá para gestionar las deudas</p>

        <form onSubmit={manejarSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="tu@email.com"
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition transform active:scale-95"
            >
              Entrar
            </button>
        </form>
      </div>
    </div>
  )
}