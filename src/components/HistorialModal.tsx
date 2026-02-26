
interface Movimiento {
    id: number;
    fecha: string;
    monto: number | string;
    descripcion: string;
    tipo: string;
}

interface ClienteConDetalle {
    id: number;
    nombre: string;
    saldo: number | string;
    movimientos: Movimiento[];
}

interface Props {
    cliente: ClienteConDetalle;
    cerrar: () => void;
}

export const HistorialModal = ({ cliente, cerrar }: Props) => {

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="bg-slate-800 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{cliente.nombre}</h2>
                        <p className="text-slate-400 text-sm">Historial de movimientos</p>
                    </div>
                    <button 
                        onClick={cerrar}
                        className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-full transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 sticky top-0 shadow-sm">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Descripción</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cliente.movimientos.map((mov) => (
                                <tr key={mov.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 text-sm text-slate-600">
                                        {new Date(mov.fecha).toLocaleDateString()} 
                                        <span className="text-xs text-slate-400 block">
                                            {new Date(mov.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} hs
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-slate-800 block">{mov.descripcion}</span>
                                        <span className="text-xs text-slate-400">{mov.tipo}</span>
                                    </td>
                                    <td className={`p-4 text-right font-bold ${Number(mov.monto) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {Number(mov.monto) > 0 ? '+' : ''}${mov.monto}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {cliente.movimientos.length === 0 && (
                        <div className="p-10 text-center text-slate-400">
                            No hay movimientos registrados para este cliente.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button 
                        onClick={cerrar}
                        className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-900 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}