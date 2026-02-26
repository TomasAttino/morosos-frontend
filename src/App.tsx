import { useEffect, useState } from 'react'
import './App.css'
import { Login } from './components/Login'
import ClienteCard from './components/ClienteCard'
import { HistorialModal } from './components/HistorialModal';
import { Toaster, toast } from 'sonner';

export interface Cliente{
  id: number
  nombre: string
  telefono: string
  saldo: number

}

interface Movimiento {
    id: number;
    fecha: string;
    monto: number;
    descripcion: string;
    tipo: string;
}

interface ClienteConDetalle extends Cliente {
    movimientos: Movimiento[];
  }

function App() {
  
  const [listaClientes, setListaClientes] = useState<Cliente[]>([])

  const [clienteSeleccionado, setClienteSeleccionado]= useState<ClienteConDetalle | null>(null);

  const[nombreInput, setNombreInput] = useState<string> ("")

  const [token, setToken] = useState<string | null>(localStorage.getItem("tokenVIP"))

  const [mostrarTodosClientes,setMostrarTodosClientes] = useState<boolean>(false)

  const[clienteModificado, setClienteModificado] = useState<Cliente | null>(null)

  const[clienteABorrar,setClienteABorrar]= useState<Cliente | null>(null);

  const totalDeuda  = listaClientes.reduce((total, cliente)  => {
    return total  + Number(cliente.saldo)
  }, 0 )

  useEffect(()=>{

    if(!token) return;

    const cargarLista = async ()=>{

    try{
      const respuesta= await fetch("https://api-morosos.onrender.com/api/clientes" ,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if(respuesta.ok){
        const datos  = await respuesta.json()
        setListaClientes(datos)
      }

      else{
        toast.error("El servidor rechazo la conexion (401/403)")
      }
 
    }
    catch{
      toast.error("Error al cargar la pagina:" )
    }
  }
    cargarLista()

  },[token])

  const cerrarSesion =()=>{
    localStorage.removeItem("tokenVIP");
    setToken(null);
    setListaClientes([]);
  }

  const agregarCliente = async () =>{

    if (!nombreInput) return;
    const url= "https://api-morosos.onrender.com/api/clientes"

    const pedido= {
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body : JSON.stringify({nombre: nombreInput})
    }

    try{

      const respuesta  = await fetch(url,pedido)

      if(respuesta.ok){

        const clienteCreado= await respuesta.json() ;
        toast.success(`Cliente agregado con exito : ${clienteCreado.nombre}`)

        setListaClientes([...listaClientes, clienteCreado])

        setNombreInput("")
      }else{
        toast.error("Error en el servidor")
      }
    }catch{
      toast.error("Error en el servidor:"  )
    }

  }

  const eliminarCliente= async (id : number) =>{

    const url= "https://api-morosos.onrender.com/api/clientes"

    const paquete = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        id: id 
      })
    }

    try{
      const respuesta= await fetch(url, paquete)


      
      if(respuesta.ok){
        toast.success("Cliente eliminado con exito")
        const clienteEliminado = await respuesta.json()
        toast.success(`Se elimino el cliente ${clienteEliminado.nombre} `)
        setListaClientes((p) => p.filter((cliente) => cliente.id !== id))

      }else{
        const errorData = await respuesta.json();
        toast.error(errorData.error);
        toast.error("No se puede eliminar a un cliente con saldo")
      }
    }
    catch{
      toast.error("Error al intentar eliminar al cliente")
    }
  }

  const modificarSalario= async (id :number, monto : number) =>{
     
    const url= `https://api-morosos.onrender.com/api/clientes/${id}`

    const paquete={
      method: "PUT",
      headers:{
         "Content-Type": "application/json",
         "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
      monto: monto
      })
    }

    try{

      const respuesta = await fetch(url,paquete)

      if(respuesta.ok){

        const clienteActualizadoJson= await respuesta.json();

        toast.success(`${clienteActualizadoJson.nombre} actualizo su monto a ${clienteActualizadoJson.saldo}`)
        // codigo para recargar todos los clientes iguales menos este ultimo modificado

        setListaClientes((prev) => prev.map((cliente) =>{

          if(cliente.id === id){
            return clienteActualizadoJson;
          }
          else{
            return cliente
          }
        }
        ))}
    }
    catch{
        toast.error("No se pudo actualizar el monto")
    }
  }

  const mostrarDetalleCliente = async (id:number) =>{

    const url = `https://api-morosos.onrender.com/api/clientes/${id}`

    try{
      const respuesta = await fetch(url ,
        {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(respuesta.ok){
        const clienteDetalle = await respuesta.json();

        toast.success(`Cliente encontrado ${clienteDetalle} `)

        setClienteSeleccionado(clienteDetalle)
      } else{
        toast.error("Error al cargar el cliente")
      }
    }catch{
      toast.error("Error en el servidor")
    }

  }

  const abrirEdicion = async (cliente :Cliente) =>{

    setClienteModificado(cliente)
  }
  
  const guardarEdicion =async() =>{

    if (!clienteModificado) return;

    const url = `https://api-morosos.onrender.com/api/clientes/editar`;

    const paquete = {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
       },
      body: JSON.stringify({
        id: clienteModificado.id,
        nombre: clienteModificado.nombre,
        telefono: clienteModificado.telefono
      })
    };

    try {
      const respuesta = await fetch(url, paquete);

      if (respuesta.ok) {
        const clienteActualizado = await respuesta.json();
        
        setListaClientes((prev) => 
          prev.map((c) => c.id === clienteActualizado.id ? clienteActualizado : c)
        );

        setClienteModificado(null);
        toast.success(`${clienteActualizado.nombre} editado con éxito`);
      } else {
        toast.error("El backend rechazó la edición");
      }
    } catch  {
      toast.error("No se pudo editar el cliente");
    }
  };

  if (!token) {
    return (
      <Login alLoguearse={(tokenRecibido) => setToken(tokenRecibido)} />
    );
  }


  return (
    <>
    <Toaster richColors position="top-right" />
<div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(circle_farthest-side_at_var(--x,50%)_var(--y,50%),#334155_0%,#020617_100%)] py-10">
  
  <div className="max-w-xl mx-auto mb-10">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      
     <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 flex justify-between items-center">
        <h2 className="text-white text-lg font-bold opacity-90">
          💰 Finanzas del Negocio
        </h2>
        
        <button 
          onClick={cerrarSesion}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition text-sm shadow-md active:scale-95"
          title="Cerrar sesión segura"
        >
          Salir 🚪
        </button>
      </div>

      <div className="p-8 flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
            Total en la calle
          </p>
          <p className="text-5xl font-extrabold text-slate-800 mt-2">
            ${totalDeuda}
          </p>
        </div>

        <div className="text-center bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
          <span className="block text-2xl font-bold text-blue-600">
            {listaClientes.length}
          </span>
          <span className="text-xs text-blue-400 font-bold uppercase">
            Clientes
          </span>
        </div>
      </div>
    </div>
  </div>
  <div className="max-w-xl mx-auto mb-10 flex gap-4">
    <input 
      type="text"
      value={nombreInput}
      onChange={(e) => setNombreInput(e.target.value)}
      placeholder='Nombre del nuevo deudor...' 
      className="text-white w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
    />
    <button 
      onClick={agregarCliente} 
      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95"
    >
      Agregar
    </button>
    <button 
      onClick={() => mostrarTodosClientes?setMostrarTodosClientes(false) : setMostrarTodosClientes(true)} 
      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95"
    >
      {mostrarTodosClientes? "Deudores":"Todos"}
    </button>
  </div>
  <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {listaClientes
        .filter((c) =>{
          if(mostrarTodosClientes===true){
            return true
          }else{
            return Number(c.saldo) > 0 
          }
        })
        .sort((a, b) => Number(b.saldo) - Number(a.saldo))
        .map((c) => (
          <ClienteCard 
            key={c.id}
            cliente={c}
            alEliminar={() =>setClienteABorrar(c)}
            alModificarSaldo={modificarSalario}
            mostrarDetalleCliente = {mostrarDetalleCliente}
            alEditar={abrirEdicion}
          />
        ))
    }

      {clienteSeleccionado && (
          <HistorialModal 
              cliente={clienteSeleccionado} 
              cerrar={() => setClienteSeleccionado(null)} 
          />
      )}

      {clienteModificado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Editar Cliente</h2>
            
            <p className="text-slate-300 mb-4">
              Estás editando a: <span className="font-bold text-blue-400">{clienteModificado.nombre}</span>
            </p>
            <div className="mb-4">
              <label className="block text-slate-400 text-sm font-bold mb-2">Nombre</label>
              <input
                type="text"
                value={clienteModificado.nombre}
                onChange={(e) => setClienteModificado({ ...clienteModificado, nombre: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-400 text-sm font-bold mb-2">Teléfono</label>
              <input
                type="text"
                value={clienteModificado.telefono || ""} // Por si no tiene teléfono y es null
                onChange={(e) => setClienteModificado({ ...clienteModificado, telefono: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={() => setClienteModificado(null)}
                className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button 
              onClick={(guardarEdicion)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-bold">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {clienteABorrar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-red-900/50 w-full max-w-sm text-center">
            
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-6">
              <span className="text-3xl">⚠️</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">¿Estás seguro?</h2>
            <p className="text-slate-400 mb-6">
              Vas a eliminar a <span className="font-bold text-red-400">{clienteABorrar.nombre}</span>. Esta acción no se puede deshacer y borrará todo su historial.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={() => setClienteABorrar(null)}
                className="px-5 py-2.5 text-slate-300 font-semibold hover:bg-slate-800 rounded-xl transition"
              >
                Cancelar
              </button>
              
              <button 
                onClick={() => {
                  eliminarCliente(clienteABorrar.id);
                  setClienteABorrar(null);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
  </div>
</div>
    </>
  )
}


export default App
