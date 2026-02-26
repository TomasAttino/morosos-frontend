import { useState } from "react";
import type { Cliente } from "../App";

interface clienteProps{
    cliente : Cliente
    alEliminar: (id: number) => void
    alEditar : (clienteViejo: Cliente) =>  void
    alModificarSaldo : (id: number, monto: number) => void
    mostrarDetalleCliente : (id:number)  => void
}

const ClienteCard= ({cliente, alEliminar,alEditar, alModificarSaldo ,mostrarDetalleCliente } : clienteProps )=>{

    const[montoInput, setMontoInput]= useState<string>("")


    const handleClick =(esPago:boolean) =>{

        if(!montoInput){
            return 
        }

        const valorNumerico= Number(montoInput)
        const montoFinal = esPago  ? valorNumerico*-1 : valorNumerico

        alModificarSaldo(cliente.id, montoFinal)
        setMontoInput("")
        return
    }


    
    return (
         // CONTENEDOR PRINCIPAL: Blanco, redondeado, con sombra suave
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
            
            {/* --- PARTE DE ARRIBA: Nombre y Tacho de basura --- */}
            {/* flex justify-between: Pone uno a la izquierda y otro a la derecha */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <button
                        onClick={()  => mostrarDetalleCliente(cliente.id)}
                        className="text-slate-800 font-bold text-lg"
                    >
                        {cliente.nombre}
                    </button>
                    
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Deudor # {cliente.id}</p>
                </div>
                <div>
                {/* Botón Eliminar: Texto gris que se pone rojo al pasar el mouse */}
                <button 
                    onClick={() => alEliminar(cliente.id)}
                    className="text-slate-300 hover:text-red-500 transition"
                    title="Eliminar cliente"
                >
                   {/* Icono de basura simple usando texto o podes buscar un icono SVG despues */}
                 🗑️
                </button>
                <button 
                    onClick={() => alEditar(cliente)}
                    className="text-slate-300 hover:text-red-500 transition"
                    title="Editar Cliente"
                >
                   {/* Icono de basura simple usando texto o podes buscar un icono SVG despues */}
                 ✏️
                </button>
                </div>
            </div>

            {/* --- PARTE DEL MEDIO: El Saldo --- */}
            <div className="mb-6">
                <p className="text-sm text-slate-500 mb-1">Saldo Actual:</p>
                {/* Lógica condicional: Si debe (saldo > 0) es Rojo, si no es Verde */}
                <p className={`text-3xl font-extrabold ${cliente.saldo > 50000 ? 'text-red-500' : 'text-green-500'}`}>
                    ${cliente.saldo}
                </p>
            </div>

            {/* --- PARTE DE ABAJO: Input y Botones --- */}
            {/* flex gap-2: Pone los elementos en fila con espacio de 8px entre ellos */}
            <div className="flex gap-2 items-center">
                
                {/* Input chiquito */}
                <input 
                    type="number"
                    value={montoInput}
                    onChange={(e) => setMontoInput(e.target.value)}
                    placeholder="$"
                    className="w-20 px-1 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Botón PAGAR (Verde clarito con texto verde oscuro) */}
                <button 
                    onClick={() => handleClick(true)}
                    className="flex-1 bg-green-100 text-green-700 font-bold py-2 rounded-lg hover:bg-green-200 transition"
                >
                    Pagar
                </button>

                {/* Botón FIAR (Rojo clarito con texto rojo oscuro) */}
                <button 
                    onClick={() => handleClick(false)}
                    className="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded-lg hover:bg-red-200 transition"
                >
                    Fiar
                </button>

            </div>
        </div>
    
    )
}

export default ClienteCard